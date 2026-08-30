#!/usr/bin/env node
// Preview the ai.whitespacedesign.ca section against a local dev server.
//
//   npm run dev                      # in one terminal
//   npm run content:preview          # in another, then open the URL it prints
//
// Why this exists: next.config.js 308-redirects /blog and /blog/* to
// ai.whitespacedesign.ca unless the request carries x-wsai-proxy — the header
// the Cloudflare worker sets when it fetches that section. The redirect is
// load-bearing (without the exemption the worker would fetch a redirect back to
// itself and loop), but it means that in dev, opening an ai post in a browser
// bounces you to the live site and it looks like your post failed to build.
//
// This sits in front of dev and adds the header, so the local page renders.
// The other three collections have no such redirect and need none of this.
//
//   node scripts/content/preview.mjs [--from <listenPort>] [--to <devPort>]
//
// Defaults: listens on 3001, forwards to Next dev on 3000.

import http from 'node:http'

function parseArgs(argv) {
  const flags = { from: 3001, to: 3000 }
  for (let i = 0; i < argv.length; i++) {
    const [name, inline] = argv[i].replace(/^--/, '').split(/=(.*)/s)
    if (name === 'from' || name === 'to') {
      const value = Number(inline ?? argv[++i])
      if (!Number.isInteger(value) || value < 1 || value > 65535) {
        console.error(`error: --${name} needs a port number`)
        process.exit(1)
      }
      flags[name] = value
    }
  }
  return flags
}

const { from: listenPort, to: upstreamPort } = parseArgs(process.argv.slice(2))

// Generous: a cold Next dev route compile can take a while on first hit.
const UPSTREAM_TIMEOUT_MS = 120_000

const server = http.createServer((req, res) => {
  const upstream = http.request(
    {
      host: '127.0.0.1',
      port: upstreamPort,
      path: req.url,
      method: req.method,
      headers: {
        ...req.headers,
        host: `127.0.0.1:${upstreamPort}`,
        'x-wsai-proxy': '1',
      },
    },
    (proxied) => {
      // An upstream reset after the headers are out emits on the RESPONSE
      // stream, which the request-level handler below never sees. Unhandled,
      // that takes the whole proxy down mid-preview.
      proxied.on('error', () => res.destroy())
      res.writeHead(proxied.statusCode ?? 502, proxied.headers)
      proxied.pipe(res)
    }
  )
  // A dev server that accepts the socket but never answers would otherwise hang
  // the browser indefinitely and hold the socket. Next's first compile of a
  // route is genuinely slow, so this is generous rather than tight.
  upstream.setTimeout(UPSTREAM_TIMEOUT_MS, () => {
    upstream.destroy(
      new Error(`no response from the dev server within ${UPSTREAM_TIMEOUT_MS / 1000}s`)
    )
  })

  upstream.on('error', (err) => {
    if (res.headersSent) {
      res.destroy()
      return
    }
    res.writeHead(502, { 'content-type': 'text/plain' })
    res.end(
      `preview proxy could not reach the dev server on :${upstreamPort}\n\n` +
        `${err.message}\n\nIs \`npm run dev\` running?\n`
    )
  })

  // If the browser gives up mid-request, stop waiting on the dev server too.
  res.on('close', () => {
    if (!upstream.destroyed) upstream.destroy()
  })
  req.pipe(upstream)
})

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `error: port ${listenPort} is already in use. Pass --from <port> to pick another.`
    )
    process.exit(1)
  }
  throw err
})

server.listen(listenPort, () => {
  console.log(`AI blog preview: http://localhost:${listenPort}/blog`)
  console.log(`  forwards to Next dev on :${upstreamPort}, adding x-wsai-proxy`)
  console.log('  Ctrl-C to stop.')
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // The AI blog moved to ai.whitespacedesign.ca — it is AI content, and that
      // is the AI brand. Same consolidation already done for whitespace and
      // race-dad, and it matters more here: a new subdomain inherits none of the
      // apex's authority, so handing it six already-indexed posts is the best
      // available fix for that.
      //
      // `missing` is load-bearing, not an optimisation. The AI worker SERVES
      // this section by fetching these exact URLs, so without the header
      // exemption the worker would fetch a 301 pointing back at itself and loop
      // forever. The worker sets x-wsai-proxy on every upstream request.
      {
        source: '/blog',
        destination: 'https://ai.whitespacedesign.ca/blog',
        permanent: true,
        missing: [{ type: 'header', key: 'x-wsai-proxy' }],
      },
      {
        source: '/blog/:slug*',
        destination: 'https://ai.whitespacedesign.ca/blog/:slug*',
        permanent: true,
        missing: [{ type: 'header', key: 'x-wsai-proxy' }],
      },
    ]
  },
}

module.exports = nextConfig

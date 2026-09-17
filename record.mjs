// Records short looping .mp4 clips of the four trend sections on the UI
// Trends Playground (/whitespace/playground/ui-trends) for use as hero
// videos in the whitespace trend posts.
//
// Requires the dev server on :3000 (npm run dev) and ffmpeg on PATH.
//
// Locators: each trend is a <section>; CSS-module class names are hashed and
// the headings are split by <Punct> spans (which breaks Playwright's exact
// text= matchers), so sections are found by tag + hasText filtering instead.
import { chromium } from 'playwright'
import { exec } from 'child_process'
import path from 'path'
import fs from 'fs'

const OUT_DIR = 'public/images/whitespace'
const PAGE_URL = 'http://localhost:3000/whitespace/playground/ui-trends'

// File names match the Video: paths in drafts/whitespace/*.md.
const SECTIONS = [
  { name: 'aurora-backgrounds', text: 'Aurora Mesh Gradients', scroll: 300 },
  { name: 'glassmorphism-ui', text: 'Glassmorphism', scroll: 300 },
  { name: 'bento-box-layouts', text: 'Bento Box Layout', scroll: 300 },
  // The sticky graphic only earns its keep while travelling past the tall
  // cards, so this section gets a much deeper scroll.
  { name: 'scrollytelling-interactive', text: 'Scrollytelling', scroll: 1200 },
]

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function waitForFile(filePath, timeoutMs = 10000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    try {
      if (fs.statSync(filePath).isFile()) return true
    } catch {}
    await sleep(100)
  }
  return fs.existsSync(filePath)
}

async function renameWithRetry(from, to, attempts = 5) {
  for (let i = 0; i < attempts; i++) {
    try {
      fs.renameSync(from, to)
      return
    } catch (err) {
      if (i === attempts - 1) throw err
      await sleep(250)
    }
  }
}

function convertToMp4(webmPath, finalPath) {
  // Playwright webm has no audio track; yuv420p keeps the H.264 output
  // playable in every browser and faststart lets it start before EOF.
  const cmd = `ffmpeg -y -i "${webmPath}" -c:v libx264 -crf 23 -preset fast -pix_fmt yuv420p -movflags +faststart "${finalPath}"`
  return new Promise((resolve, reject) => {
    exec(cmd, (error, _stdout, stderr) => {
      if (error) {
        console.error(`ffmpeg error: ${error.message}\n${stderr}`)
        reject(error)
        return
      }
      resolve()
    })
  })
}

async function recordSection(browser, section) {
  console.log(`Recording ${section.name}...`)
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: { dir: OUT_DIR, size: { width: 1280, height: 720 } },
  })
  const page = await context.newPage()
  page.setDefaultTimeout(60000)

  try {
    await page.goto(PAGE_URL)
    await sleep(2000)

    const sectionEl = page.locator('section').filter({ hasText: section.text })
    const count = await sectionEl.count()
    if (count !== 1) {
      throw new Error(`expected exactly 1 section matching "${section.text}", found ${count}`)
    }

    await sectionEl.scrollIntoViewIfNeeded()
    await sleep(1000)

    // Gentle scroll down through the section, then back up.
    const step = 300
    for (let scrolled = 0; scrolled < section.scroll; scrolled += step) {
      await page.mouse.wheel(0, step)
      await sleep(700)
    }
    await page.mouse.wheel(0, -section.scroll)
    await sleep(1000)

    const video = page.video()
    const videoPath = await video.path()
    // Closing the context finalizes the webm on disk.
    await page.close()
    await context.close()

    if (!waitForFile(videoPath)) {
      throw new Error(`video file was never written: ${videoPath}`)
    }
    const webmPath = path.join(OUT_DIR, `${section.name}.webm`)
    const finalPath = path.join(OUT_DIR, `${section.name}.mp4`)
    renameWithRetry(videoPath, webmPath)
    console.log(`Saved ${webmPath}`)

    console.log(`Converting ${section.name} to mp4...`)
    await convertToMp4(webmPath, finalPath)
    fs.unlinkSync(webmPath)
    console.log(`Saved ${finalPath}`)
  } finally {
    // On failure the context must still close so no orphan page@*.webm
    // files are left behind in public/images/whitespace.
    await page.close().catch(() => {})
    await context.close().catch(() => {})
  }
}

async function run() {
  fs.mkdirSync(OUT_DIR, { recursive: true })

  // Sweep stray Playwright default-named videos from earlier failed runs.
  for (const f of fs.readdirSync(OUT_DIR)) {
    if (/^page@.*\.webm$/.test(f)) {
      fs.unlinkSync(path.join(OUT_DIR, f))
      console.log(`Removed stray ${f}`)
    }
  }

  console.log('Launching Playwright...')
  const browser = await chromium.launch({ headless: true })
  try {
    for (const section of SECTIONS) {
      await recordSection(browser, section)
    }
  } finally {
    await browser.close()
  }
  console.log('Done!')
}

run().catch((err) => {
  console.error(err)
  process.exitCode = 1
})

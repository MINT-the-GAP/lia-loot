import { spawn } from "node:child_process"
import { access, mkdtemp, readFile, rm } from "node:fs/promises"
import { existsSync } from "node:fs"
import { createServer } from "node:http"
import { basename, dirname, join, resolve } from "node:path"
import { tmpdir } from "node:os"
import { fileURLToPath } from "node:url"

const projectRoot = fileURLToPath(new URL("../", import.meta.url))
const fixturePath = join(projectRoot, "tests", "browser-stress.html")
const bundlePath = join(projectRoot, "dist", "index.js")

function browserCandidates() {
  return [
    process.env.LOOT_BROWSER_PATH,
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "/usr/bin/microsoft-edge",
    "/usr/bin/microsoft-edge-stable",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ].filter(Boolean)
}

function findBrowser() {
  const browser = browserCandidates().find((candidate) => existsSync(candidate))
  if (!browser) {
    throw new Error(
      "Kein lokaler Edge-/Chrome-/Chromium-Browser gefunden. " +
      "Setze LOOT_BROWSER_PATH auf die ausführbare Browserdatei.",
    )
  }
  return browser
}

async function startServer() {
  const allowed = new Map([
    ["/tests/browser-stress.html", fixturePath],
    ["/dist/index.js", bundlePath],
  ])
  const server = createServer(async (request, response) => {
    try {
      const pathname = new URL(request.url || "/", "http://127.0.0.1").pathname
      if (pathname === "/favicon.ico") {
        response.writeHead(204)
        response.end()
        return
      }
      const file = allowed.get(pathname)
      if (!file) {
        response.writeHead(404, { "content-type": "text/plain; charset=utf-8" })
        response.end("Not found")
        return
      }
      const body = await readFile(file)
      response.writeHead(200, {
        "cache-control": "no-store",
        "content-length": body.length,
        "content-type": pathname.endsWith(".html")
          ? "text/html; charset=utf-8"
          : "text/javascript; charset=utf-8",
      })
      response.end(body)
    } catch (error) {
      response.writeHead(500, { "content-type": "text/plain; charset=utf-8" })
      response.end(String(error))
    }
  })
  await new Promise((resolveListen, rejectListen) => {
    server.once("error", rejectListen)
    server.listen(0, "127.0.0.1", resolveListen)
  })
  return server
}

function runBrowser(browser, profile, url) {
  const args = [
    "--headless=new",
    "--disable-background-networking",
    "--disable-component-update",
    "--disable-default-apps",
    "--disable-gpu",
    "--disable-sync",
    "--metrics-recording-only",
    "--mute-audio",
    "--no-default-browser-check",
    "--no-first-run",
    "--user-data-dir=" + profile,
    "--virtual-time-budget=30000",
    "--dump-dom",
    url,
  ]
  if (typeof process.getuid === "function" && process.getuid() === 0) {
    args.unshift("--no-sandbox")
  }

  return new Promise((resolveProcess, rejectProcess) => {
    const child = spawn(browser, args, {
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    })
    let stdout = ""
    let stderr = ""
    let settled = false
    const finish = (callback, value) => {
      if (settled) return
      settled = true
      clearTimeout(timeout)
      callback(value)
    }
    const timeout = setTimeout(() => {
      child.kill("SIGKILL")
      finish(
        rejectProcess,
        new Error("Browser-Stresstest überschritt 45 Sekunden."),
      )
    }, 45_000)

    child.stdout.setEncoding("utf8")
    child.stderr.setEncoding("utf8")
    child.stdout.on("data", (chunk) => { stdout += chunk })
    child.stderr.on("data", (chunk) => { stderr += chunk })
    child.once("error", (error) => finish(rejectProcess, error))
    child.once("close", (code) => {
      finish(resolveProcess, { code, stderr, stdout })
    })
  })
}

function decodeHtml(value) {
  return value
    .replaceAll("&quot;", String.fromCharCode(34))
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&")
}

async function removeProfile(profile) {
  const expectedParent = resolve(tmpdir())
  const target = resolve(profile)
  if (
    dirname(target) !== expectedParent ||
    !basename(target).startsWith("lia-loot-browser-stress-")
  ) {
    throw new Error("Unsicheres temporäres Profilziel: " + target)
  }
  await rm(target, {
    force: true,
    maxRetries: 4,
    recursive: true,
    retryDelay: 150,
  })
}

await Promise.all([access(fixturePath), access(bundlePath)])
const browser = findBrowser()
const server = await startServer()
const address = server.address()
const port = typeof address === "object" && address ? address.port : null
if (!port) throw new Error("Der lokale Testserver erhielt keinen Port.")

const profile = await mkdtemp(join(tmpdir(), "lia-loot-browser-stress-"))
const url =
  "http://127.0.0.1:" + port +
  "/tests/browser-stress.html?run=" + encodeURIComponent(Date.now())

try {
  const execution = await runBrowser(browser, profile, url)
  const resultMatch =
    /<pre id="loot-stress-result" data-status="(pass|fail)">([\s\S]*?)<\/pre>/u.exec(
      execution.stdout,
    )
  if (!resultMatch) {
    throw new Error(
      "Der Browser lieferte kein Stressresultat. Exit " +
      execution.code + ".\n" + execution.stderr.slice(-3000),
    )
  }
  const payload = decodeHtml(resultMatch[2])
  if (resultMatch[1] !== "pass" || execution.code !== 0) {
    throw new Error(
      "Browser-Stresstest fehlgeschlagen: " + payload +
      "\nBrowser-Exit: " + execution.code +
      "\n" + execution.stderr.slice(-3000),
    )
  }
  const parsed = JSON.parse(payload)
  console.log(
    "Browser-Stresstest bestanden: " +
    parsed.assertions + " Assertions, " +
    parsed.locks + " Locks, " +
    parsed.chests + " Truhen.",
  )
} finally {
  await new Promise((resolveClose) => server.close(resolveClose))
  await removeProfile(profile)
}

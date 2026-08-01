import { createServer } from "node:http"
import { readFile, stat } from "node:fs/promises"
import {
  extname,
  isAbsolute,
  join,
  relative,
  resolve,
} from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(fileURLToPath(new URL("../../", import.meta.url)))
const host = process.env.PLAYWRIGHT_TEST_HOST ?? "127.0.0.1"
const port = Number.parseInt(process.env.PORT ?? "4173", 10)

if (!Number.isInteger(port) || port < 1 || port > 65_535) {
  throw new Error(`Ungültiger Testserver-Port: ${process.env.PORT}`)
}

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".map", "application/json; charset=utf-8"],
  [".md", "text/markdown; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
])

function send(response, status, body, contentType = "text/plain; charset=utf-8") {
  const payload = Buffer.isBuffer(body) ? body : Buffer.from(body)
  response.writeHead(status, {
    "cache-control": "no-store",
    "content-length": payload.byteLength,
    "content-type": contentType,
  })
  response.end(payload)
}

function repositoryPath(pathname) {
  const candidate = resolve(root, pathname.replace(/^\/+/, ""))
  const fromRoot = relative(root, candidate)
  if (fromRoot.startsWith("..") || isAbsolute(fromRoot)) return null
  return candidate
}

const server = createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.setHeader("allow", "GET, HEAD")
    send(response, 405, "Method Not Allowed")
    return
  }

  let requestUrl
  try {
    requestUrl = new URL(request.url ?? "/", `http://${host}:${port}`)
  } catch {
    send(response, 400, "Bad Request")
    return
  }

  if (requestUrl.pathname === "/__health") {
    send(
      response,
      200,
      JSON.stringify({ ok: true }),
      "application/json; charset=utf-8",
    )
    return
  }

  if (requestUrl.pathname === "/favicon.ico") {
    response.writeHead(204, { "cache-control": "no-store" })
    response.end()
    return
  }

  let pathname
  try {
    pathname = decodeURIComponent(requestUrl.pathname)
  } catch {
    send(response, 400, "Bad Request")
    return
  }

  let filePath = repositoryPath(pathname)
  if (!filePath) {
    send(response, 403, "Forbidden")
    return
  }

  try {
    const metadata = await stat(filePath)
    if (metadata.isDirectory()) filePath = join(filePath, "index.html")
    const body = await readFile(filePath)
    const contentType =
      contentTypes.get(extname(filePath).toLowerCase()) ??
      "application/octet-stream"
    if (request.method === "HEAD") {
      response.writeHead(200, {
        "cache-control": "no-store",
        "content-length": body.byteLength,
        "content-type": contentType,
      })
      response.end()
      return
    }
    send(response, 200, body, contentType)
  } catch (error) {
    const status = error?.code === "ENOENT" ? 404 : 500
    send(response, status, status === 404 ? "Not Found" : "Server Error")
  }
})

server.listen(port, host, () => {
  console.log(`Loot-Testserver: http://${host}:${port}`)
})

function shutdown() {
  server.close(() => process.exit(0))
}

process.once("SIGINT", shutdown)
process.once("SIGTERM", shutdown)

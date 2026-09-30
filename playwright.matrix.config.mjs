import { defineConfig, devices } from "@playwright/test"
import { existsSync } from "node:fs"

const chromeCandidates = [
  process.env.LOOT_CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
].filter(Boolean)
const edgeCandidates = [
  process.env.LOOT_EDGE_PATH,
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
].filter(Boolean)

const installedPath = (candidates) =>
  candidates.find((candidate) => existsSync(candidate))
const chromePath = installedPath(chromeCandidates)
const edgePath = installedPath(edgeCandidates)

const desktop = {
  deviceScaleFactor: 1,
  locale: "de-DE",
  viewport: { height: 900, width: 1440 },
}
const win11Desktop = {
  ...desktop,
  deviceScaleFactor: 1.25,
  viewport: { height: 864, width: 1536 },
}

const chromiumProject = (name, executablePath, use, metadata) => ({
  name,
  metadata,
  use: {
    ...use,
    browserName: "chromium",
    ...(executablePath ? { launchOptions: { executablePath } } : {}),
  },
})

export default defineConfig({
  testDir: "./tests/browser",
  testMatch: /(?:browser-stress|reserve-slide)\.spec\.mjs/u,
  timeout: 140_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  forbidOnly: true,
  retries: 1,
  workers: 4,
  reporter: "line",
  outputDir: "test-results/matrix",
  use: {
    baseURL: "http://127.0.0.1:4173",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "node tests/browser/server.mjs",
    url: "http://127.0.0.1:4173/__health",
    reuseExistingServer: true,
    timeout: 30_000,
  },
  projects: [
    chromiumProject(
      "edge-win10-real",
      edgePath,
      desktop,
      { browser: "Edge", os: "Windows 10", simulation: !edgePath },
    ),
    chromiumProject(
      "edge-win11-webprofile",
      edgePath,
      win11Desktop,
      { browser: "Edge", os: "Windows 11", simulation: true },
    ),
    chromiumProject(
      "chrome-win10-real",
      chromePath,
      desktop,
      { browser: "Chrome", os: "Windows 10", simulation: !chromePath },
    ),
    chromiumProject(
      "chrome-win11-webprofile",
      chromePath,
      win11Desktop,
      { browser: "Chrome", os: "Windows 11", simulation: true },
    ),
    {
      name: "firefox-win10",
      metadata: { browser: "Firefox", os: "Windows 10", simulation: false },
      use: { ...desktop, browserName: "firefox" },
    },
    {
      name: "firefox-win11-webprofile",
      metadata: { browser: "Firefox", os: "Windows 11", simulation: true },
      use: { ...win11Desktop, browserName: "firefox" },
    },
    chromiumProject(
      "brave-win10-chromium-sim",
      undefined,
      desktop,
      { browser: "Brave", os: "Windows 10", simulation: true },
    ),
    chromiumProject(
      "brave-win11-chromium-sim",
      undefined,
      win11Desktop,
      { browser: "Brave", os: "Windows 11", simulation: true },
    ),
    {
      name: "safari-desktop-webkit-sim",
      metadata: { browser: "Safari", os: "macOS", simulation: true },
      use: { ...devices["Desktop Safari"], locale: "de-DE" },
    },
    {
      name: "ios-safari-iphone-sim",
      metadata: { browser: "Safari", os: "iOS iPhone", simulation: true },
      use: { ...devices["iPhone 13"], locale: "de-DE" },
    },
    {
      name: "ios-safari-ipad-sim",
      metadata: { browser: "Safari", os: "iOS iPad", simulation: true },
      use: { ...devices["iPad Mini"], locale: "de-DE" },
    },
  ],
})

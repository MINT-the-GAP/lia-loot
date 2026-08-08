import assert from "node:assert/strict"
import test from "node:test"

import {
  courseVersionFromMetadata,
  liaCourseIdentity,
  setLiaCourseRevision,
  setLiaCourseVersion,
} from "../src/course-identity.ts"

test("isoliert Zustände nach der tatsächlich geladenen LiaScript-Kurs-URL", () => {
  const previousWindow = globalThis.window
  try {
    globalThis.window = {
      LIA: {
        defaultCourseURL: "https://courses.example/raum-a.md#4",
      },
      location: {
        href: "https://viewer.example/course/?preview=1#2",
        pathname: "/course/",
        search: "?preview=1",
      },
    }
    assert.equal(
      liaCourseIdentity(),
      "https://courses.example/raum-a.md::version=0.0.1",
    )

    globalThis.window.LIA.defaultCourseURL =
      "https://courses.example/raum-b.md#7"
    assert.equal(
      liaCourseIdentity(),
      "https://courses.example/raum-b.md::version=0.0.1",
    )
  } finally {
    globalThis.window = previousWindow
  }
})

test("entfernt ohne Runtime-Kurs zumindest den Folien-Hash des Viewers", () => {
  const previousWindow = globalThis.window
  try {
    globalThis.window = {
      location: {
        href: "https://viewer.example/course/?preview=1#8",
        pathname: "/course/",
        search: "?preview=1",
      },
    }
    assert.equal(
      liaCourseIdentity(),
      "https://viewer.example/course/?preview=1::version=0.0.1",
    )
  } finally {
    globalThis.window = previousWindow
  }
})

test("trennt dieselbe Kurs-URL nach der deklarierten Kursversion", () => {
  const previousWindow = globalThis.window
  try {
    globalThis.window = {
      LIA: { defaultCourseURL: "https://courses.example/raum-a.md#5" },
      location: {
        href: "https://viewer.example/?preview=1#5",
        pathname: "/",
        search: "?preview=1",
      },
    }
    setLiaCourseVersion("2.7.0")
    assert.equal(
      liaCourseIdentity(),
      "https://courses.example/raum-a.md::version=2.7.0",
    )
  } finally {
    setLiaCourseVersion("0.0.1")
    globalThis.window = previousWindow
  }
})

test("trennt dieselbe URL und Version nach dem Quelltext-Fingerprint", () => {
  const previousWindow = globalThis.window
  try {
    globalThis.window = {
      LIA: { defaultCourseURL: "https://courses.example/raum-a.md" },
      location: {
        href: "https://viewer.example/#1",
        pathname: "/",
        search: "",
      },
    }
    setLiaCourseVersion("2.7.0")
    setLiaCourseRevision("source-a")
    const first = liaCourseIdentity()
    setLiaCourseRevision("source-b")
    const second = liaCourseIdentity()

    assert.equal(
      first,
      "https://courses.example/raum-a.md::version=2.7.0::revision=source-a",
    )
    assert.equal(
      second,
      "https://courses.example/raum-a.md::version=2.7.0::revision=source-b",
    )
    assert.notEqual(first, second)
  } finally {
    setLiaCourseVersion("0.0.1")
    globalThis.window = previousWindow
  }
})

test("übernimmt Version und Revision atomar aus derselben Kursquelle", async () => {
  const previousWindow = globalThis.window
  const identity = await import(
    `../src/course-identity.ts?source-identity=${Date.now()}`,
  )
  try {
    globalThis.window = {
      LIA: { defaultCourseURL: "https://courses.example/source.md" },
      location: {
        href: "https://viewer.example/#1",
        pathname: "/",
        search: "",
      },
    }
    assert.equal(
      await identity.prepareLiaCourseIdentity(async () => ({
        version: "6.1.0",
        revision: "markdown-abc",
      })),
      "6.1.0",
    )
    assert.equal(
      identity.liaCourseIdentity(),
      "https://courses.example/source.md::version=6.1.0::revision=markdown-abc",
    )
  } finally {
    globalThis.window = previousWindow
  }
})

test("wartet nach frühem Ready kurz auf den laufenden Quellfingerprint", async () => {
  const previousWindow = globalThis.window
  const identity = await import(
    `../src/course-identity.ts?source-grace=${Date.now()}`,
  )
  let resolveSource
  try {
    globalThis.window = {
      LIA: { defaultCourseURL: "https://courses.example/grace.md" },
      location: {
        href: "https://viewer.example/#1",
        pathname: "/",
        search: "",
      },
    }
    const prepared = identity.prepareLiaCourseIdentity(
      () =>
        new Promise((resolve) => {
          resolveSource = resolve
        }),
      1_000,
      100,
    )
    await new Promise((resolve) => setImmediate(resolve))
    globalThis.window.LIA.onReady({ version: "7.0.0" })
    resolveSource({ version: "6.9.0", revision: "source-late" })

    assert.equal(await prepared, "7.0.0")
    assert.equal(
      identity.liaCourseIdentity(),
      "https://courses.example/grace.md::version=7.0.0::revision=source-late",
    )
  } finally {
    globalThis.window = previousWindow
  }
})

test("liest die Version aus LiaScripts Ready-Metadaten defensiv", () => {
  assert.equal(courseVersionFromMetadata({ version: " 3.1.4 " }), "3.1.4")
  assert.equal(
    courseVersionFromMetadata({ definition: { version: "2026.08" } }),
    "2026.08",
  )
  assert.equal(courseVersionFromMetadata({ version: "" }), null)
})

test("uebernimmt die Ready-Version und erhaelt vorhandene Callbacks", async () => {
  const previousWindow = globalThis.window
  const identity = await import(
    `../src/course-identity.ts?ready-test=${Date.now()}`,
  )
  let forwardedMetadata = null
  const previousReady = (metadata) => {
    forwardedMetadata = metadata
  }
  try {
    globalThis.window = {
      LIA: {
        defaultCourseURL: "https://courses.example/ready.md",
        onReady: previousReady,
      },
      location: {
        href: "https://viewer.example/#1",
        pathname: "/",
        search: "",
      },
    }
    const prepared = identity.prepareLiaCourseIdentity(
      () => new Promise(() => {}),
      1_000,
    )
    const metadata = { version: "4.2.0" }
    globalThis.window.LIA.onReady(metadata)
    assert.equal(await prepared, "4.2.0")
    assert.equal(forwardedMetadata, metadata)
    assert.equal(globalThis.window.LIA.onReady, previousReady)
  } finally {
    globalThis.window = previousWindow
  }
})

test("wartet nach Source-null oder -Fehler weiter auf Ready", async () => {
  const previousWindow = globalThis.window
  try {
    for (const [label, loadSourceVersion] of [
      ["null", async () => null],
      [
        "reject",
        async () => {
          throw new Error("source unavailable")
        },
      ],
    ]) {
      const identity = await import(
        `../src/course-identity.ts?ready-race=${label}-${Date.now()}`,
      )
      globalThis.window = {
        LIA: {
          defaultCourseURL: `https://courses.example/${label}.md`,
        },
        location: {
          href: "https://viewer.example/#1",
          pathname: "/",
          search: "",
        },
      }

      const prepared = identity.prepareLiaCourseIdentity(
        loadSourceVersion,
        1_000,
      )
      await new Promise((resolve) => setImmediate(resolve))
      globalThis.window.LIA.onReady({ version: "5.4.3" })
      assert.equal(await prepared, "5.4.3")
    }
  } finally {
    globalThis.window = previousWindow
  }
})

test("verwendet bei fehlender Source den begrenzten Default-Fallback", async () => {
  const previousWindow = globalThis.window
  const identity = await import(
    `../src/course-identity.ts?fallback-test=${Date.now()}`,
  )
  try {
    globalThis.window = {
      location: {
        href: "https://viewer.example/#1",
        pathname: "/",
        search: "",
      },
    }
    assert.equal(
      await identity.prepareLiaCourseIdentity(async () => null, 0),
      "0.0.1",
    )
  } finally {
    globalThis.window = previousWindow
  }
})

import assert from "node:assert/strict"
import test from "node:test"

import { liaCourseIdentity } from "../src/course-identity.ts"

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
      "https://courses.example/raum-a.md",
    )

    globalThis.window.LIA.defaultCourseURL =
      "https://courses.example/raum-b.md#7"
    assert.equal(
      liaCourseIdentity(),
      "https://courses.example/raum-b.md",
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
      "https://viewer.example/course/?preview=1",
    )
  } finally {
    globalThis.window = previousWindow
  }
})

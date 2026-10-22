---
title: Testing
description: How Clipkin's tests run, what a good test looks like here, and the tests that only run when you ask for them.
---

Clipkin uses Node's built-in test runner (`node:test`) with `node:assert/strict`. There's no Jest,
Vitest or Mocha.

## Run the tests

```bash
pnpm test
```

This finds every test file and runs them together, with a two-minute limit per test:

- `packages/*/test/**/*.test.ts`: each package's own tests;
- `test/**/*.test.ts`: tests that cover several packages at once;
- `platform/*/test/**/*.test.ts`: the hosted platform;
- `examples/*/packages/*/test/**/*.test.ts`: the example project packages.

To run one file, which is quicker and lighter on memory:

```bash
node --import tsx --test packages/script/test/script.test.ts
```

## Write a test

Tests are plain `test(…)` calls; the codebase doesn't use `describe`:

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { parseScript } from "@clipkin/script";

test("a Role Cue labels the dialogue", () => {
  const parsed = parseScript("story.reel", "<intro><HOST> Hello.</intro>");
  assert.equal(parsed.serializations.dialogue, "HOST: Hello.");
});
```

Put it in the package's `test/` folder, named `*.test.ts`.

## What deserves a test

Add a test when it protects something real:

- a behavior someone relies on;
- a boundary between packages;
- a failure that could corrupt work, repeat a paid generation, or leave the environment unsafe.

Test each fact once, in the package that owns it. Don't add tests just to raise coverage, to repeat
a list that registration already checks, or to keep behavior that has been removed. When behavior
goes, its tests go with it.

## Common patterns

**Compiling a video.** Most tests compile a small `.reel` or Run file in memory and check the result:
its outputs, records or planned steps. They never call an outside service. The fixtures are written
inside the test itself (an in-memory `/project/audio.reel`, for example). Shared helpers live in the
repository's root `test/` folder: `fixture-resource.ts`, `timeline-fixture.ts`,
`temporal-fixture.ts`, `alpha-video-fixture.ts` and `support/video-domain.ts`.
`packages/compiler/test/compiler.test.ts` shows how to set up the compiler.

**Providers.** Test how requests are mapped, uploaded, polled, collected and how failures are
reported, against a stand-in for the service (by replacing `fetch`). The example Providers in
`examples/provider-package` do exactly this, including collecting a returned image without paying for
a generation. Never call a real paid service from a test that runs by default.

**Package boundaries.** Boundaries are defined by each package's `package.json`, public entry
points and shared types. Test the behavior at those boundaries. Don't grep source text as a stand-in
for dependency checks.

**Keep private material out.** Don't commit customer or brand material, keys or traces of them, paid
outputs, or paths from your own machine. A test that calls a live service must be opt-in, use no
committed secret, and cost nothing unless switched on.

## Tests that run only when asked

Some tests need extra tools or take a long time, so they're skipped unless you turn them on:

| Run | What it tests | Needs |
|---|---|---|
| `pnpm test:image-opencv` | Image operations through OpenCV | `uv sync --project packages/provider-image-opencv-local/runtime --frozen` first |
| `pnpm test:whisperx-service` | The local WhisperX service (Python tests) | uv; Python 3.10–3.13 |
| `pnpm test:runtime-scale` | Many builds running at once in the local runtime | Time |
| `CLIPKIN_BROWSER_TESTS=1` with `node --import tsx --test packages/provider-html-local/test/<file>.test.ts` | Rendering in a real browser | Chrome, FFmpeg and FFprobe. `CLIPKIN_TEST_CHROME_PATH` picks the browser |
| `CLIPKIN_FFPROBE_TESTS=1` | Volcengine media checks | FFprobe |
| `CLIPKIN_AGENT_TESTS=1` | The hosted platform's Claude agent, against a stand-in | Nothing else |
| `CLIPKIN_CODEX_TESTS=1` | The hosted platform's Codex agent | `CLIPKIN_CODEX_BIN` |
| `CLIPKIN_DOCKER_TESTS=1`, `CLIPKIN_DOCKER_RENDER_TESTS=1` | Sandboxed workspaces, and rendering inside them | Docker and `CLIPKIN_SANDBOX_IMAGE` |

Tests that need FFmpeg or a browser for a small part skip that part on their own when the tool is
missing.

## Example projects

The `examples/` folder doubles as larger fixtures:

- `interview`, `podcast` and `ranking-football`: complete video projects with Sources, Runs and
  stylesheets;
- `semantic-composition`: components driven by the Script and by plain times;
- `minimal-author-package`: a complete component package with a preview;
- `provider-package`: two complete project Providers with their tests.

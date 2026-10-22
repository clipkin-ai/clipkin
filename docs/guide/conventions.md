---
title: Conventions
description: How code in the Clipkin repository is named, split into packages, typed and stored.
---

These are the rules for working inside the Clipkin repository. Your own extensions use your own
package scope and Clipkin's public entry points; see [Packages and Extension](./packages.md).

## Names

| What | Style | Example |
|---|---|---|
| Package folder | lower-case with hyphens | `packages/narrative-speech-alignment/` |
| Package name | `@clipkin/` plus the folder name | `@clipkin/narrative-speech-alignment` |
| Provider for an outside service | `provider-` prefix | `@clipkin/provider-replicate` |
| Source file | lower-case with hyphens | `source-time.ts` |
| Exported type or class | PascalCase | `SpeechAlignmentError` |
| Exported function or value | camelCase | `alignNarrative` |

Providers that run local tools are named after what they do, such as `@clipkin/media-local`.

## Packages and imports

- **Each package declares its public entry points** in `package.json` `exports`. Almost all export
  `src/index.ts`. The kit packages also export their `.grade` files, and Studio exports its CLI.
- **Imports inside a package use `.js` extensions,** as Node's module resolution requires.
- **Packages import each other by name** (`@clipkin/…`), never by relative path, and every package
  they import is listed in their own `dependencies` or `devDependencies`. A few tests still reach
  into a sibling package's files by relative path; new code shouldn't.
- **No circular dependencies** between packages.

## TypeScript

The root `tsconfig.json` checks the whole workspace through ordinary package links. There's no
central `paths` list, so adding a package never means editing it.

| Setting | Value | What it means for you |
|---|---|---|
| `target` | ES2023 | Modern JavaScript |
| `module`, `moduleResolution` | NodeNext | `.js` extensions on relative imports |
| `strict` | true | All strict checks |
| `noUncheckedIndexedAccess` | true | `array[i]` and `record[key]` may be `undefined`, so handle it |
| `exactOptionalPropertyTypes` | true | An optional property can't be set to `undefined` unless its type says so |
| `verbatimModuleSyntax` | true | Use `import type` and `export type` for types |

`pnpm check` runs the type-checker for the engine; `pnpm check:platform` does the same for the hosted
platform, which has its own settings.

## Stored and exchanged data

- **Every stored format is versioned `@1`,** such as `clipkin.module@1`, `clipkin.build@1` and
  `clipkin.runtime-local@1`.
- **Module interfaces use version `1`** in their references. This is separate from the package's
  npm version: npm decides which code is installed; the interface version is what authors write
  against (`@clipkin/seedance@1`).
- **The package manager owns installed versions and files.** Clipkin identifies Modules, Fragments and
  their implementations by meaning; it doesn't hash installed packages.
- **Data types are read-only.** The shared protocol types live in `@clipkin/protocol`. Each package
  defines its own formats and Module types in its manifest; there's no central list of all types.
- **Schemas are data, not TypeScript interfaces:** a JSON-style description (`ValueSchema`) that can
  be stored and checked.
- **Use `canonicalize()` before storing or comparing values.** It sorts keys, turns `-0` into `0`,
  and rejects values that aren't plain JSON, such as `undefined`, `NaN` or functions.

## Errors

- **Authoring mistakes stop compilation with a clear message.** Errors from reading `.reel` files
  include the file, line and column. Compiler errors carry a code and the thing they're about.
- **Failures while running are recorded on the build,** as a failed operation, not thrown at the
  user.
- **Providers retry only what their service allows,** within their own limits.
- **A failed attempt ends that build.** Further work is a new build, which can reuse the outputs that
  had already finished ([reusing results](../quickstart/run.md#reusing-results)).

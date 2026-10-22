---
title: Development Guide
description: Set up the Clipkin source code, run its checks and tests, and find your way around before changing or extending it.
---

This section is for people who build on Clipkin: new components, new model services, Studio
features, or Clipkin itself. To make videos, start with the [Quickstart](../quickstart.md) instead.

## What you need

| Tool | Version | Used for |
|---|---|---|
| Node.js | 22.15 or newer | Everything |
| pnpm | 10.33 | Installing the workspace. Corepack picks the right version from `package.json` |
| FFmpeg and FFprobe | A recent release | Preparing and mixing media in real builds |
| [uv](https://docs.astral.sh/uv/) | Latest | Python tools that run on your computer: image operations (Python 3.13) and local WhisperX (3.10 to 3.13). uv sets up the Python each one needs |
| Chrome | Downloaded by `clipkin runtime up` | Rendering videos on your computer |

Node.js and pnpm are enough to type-check and run the tests. The rest are only needed to build real
videos.

To get a computer ready to render, run `clipkin runtime up --runtime <profile>`. It prepares the local
tools the Profile uses, including the browser, and starts the worker. `clipkin doctor --runtime
<profile>` reports anything missing without installing it.

## Everyday commands

```bash
corepack enable
pnpm install --frozen-lockfile   # after pulling, or after changing dependencies
pnpm check                       # type-check the engine
pnpm test                        # run the test suite
```

| Command | Does |
|---|---|
| `pnpm check` | Type-checks the engine with `tsc --noEmit` |
| `pnpm check:platform` | Type-checks the hosted platform's server and runner |
| `pnpm test` | Runs every package, example-package, platform and repository test with Node's test runner |
| `pnpm clipkin …` | Runs the `clipkin` command from this checkout |
| `pnpm studio --run <file.slate>` | Opens [Studio](../quickstart/preview.md) on a Run |

Some tests need extra tools or take a long time, and run only when asked; [Testing](./testing.md)
explains them. On a machine with little memory, run one test file at a time:
`node --import tsx --test packages/script/test/script.test.ts`.

## Where things are

```text
clipkin/
├── bin/              the clipkin command
├── packages/         the engine: every component, model service and tool, one package each
├── platform/         the hosted Clipkin service: server, web app, runner, sandbox and operations
├── skills/clipkin/    the skill that teaches agents to make videos
├── examples/         complete example video projects, used as test fixtures
├── docs/             this documentation
├── test/             tests that cover several packages at once
└── scripts/          build helpers
```

Packages are named after what they do: `caption-fine` is a caption style, `provider-replicate`
connects Replicate, `seedance` describes the Seedance models. Each has its own `README.md`,
`src/` and `test/`.

Real video projects don't live in this folder. The examples here are fixtures for the tests; a video
project is its own folder with its own `package.json`
([Run Source & Builds](../quickstart/run.md)).

## The rest of this section

| Guide | Covers |
|---|---|
| [Making videos with an Agent](./skill.md) | How the agent directs a video, chooses services and keeps the project editable |
| [Packages and Extension](./packages.md) | How components, models and services arrive as packages, and how to share yours |
| [Adding an Author Package](./author-packages.md) | Building a new component, step by step |
| [Component Anatomy](./component-anatomy.md) | What a component is made of inside |
| [Models and Providers](./providers.md) | Connecting accounts, and adding a model or a service |
| [Runtime](./runtime.md) | Profiles, workers, builds and their results |
| [Studio Companions](./studio-companion-architecture.md) | Giving a component timeline items and controls in Studio |
| [Timing edits in Studio](./studio-temporal-windows.md) | Letting Studio edit the timing a component declares |
| [Testing](./testing.md) | The test runner, test patterns and the tests that run only on request |
| [Conventions](./conventions.md) | Naming, module boundaries, TypeScript settings and stored data |
| [Use Clipkin in your Agent](./agents.md) | The agents Clipkin works with, and setting them up |
| [Model and deployment services](./service-partners.md) | Every model service Clipkin can use, and running your own |

Studio's interface can be translated: `packages/studio/LOCALIZATION.md` explains the language files.

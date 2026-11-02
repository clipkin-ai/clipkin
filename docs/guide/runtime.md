---
title: Runtime
description: How a project picks its services, how builds run in the background, and where their results are kept.
---

Three files divide the work. The `.reel` file describes the video. The Run file (`.slate`) says what
to make this time and what to reuse. The **Runtime** carries it out with the services your Profile
selects, and the project keeps what comes out.

| Part | Holds |
|---|---|
| The project | The video files, assets, its own component packages, and which Profile it uses |
| The Distribution | The `clipkin` tool, its public SDKs and the standard way of running builds |
| The Runtime Profile | Which services handle which requests, the keys they use, and how much each can run at once |
| A build | One attempt at a Run, with a fixed plan and settings |
| The results store | The finished outputs of each build, how it ended, and the record of what ran |

Clipkin's core plans and runs steps without knowing they make a video. New components and
[Providers](./providers.md) plug in through the same package interfaces as the built-in ones.

## The project and its Profile

Commands run inside a **project**: the nearest folder upward with a `package.json` containing
`"clipkin": { "project": true }`, or the folder you give with `--project`. Nothing else makes a folder
a project.

```bash
clipkin runtime init
clipkin paths
```

`runtime init` writes a starter `clipkin.runtime.json` and selects it. It never overwrites an existing
Profile: if one is there, it stops with an error, so give it a different path. Selecting a Profile
writes its path to `.clipkin/runtime`, and creates `.clipkin/.gitignore` so the project's Clipkin
folder stays out of git.

`clipkin runtime use <profile>` selects another Profile, and `clipkin runtime unset` clears the
selection. `--runtime <profile>` on any command uses a Profile for that one command. A project only
reads its own selection, and paths on the command line are relative to where you are.

## What a Profile contains

```json
{
  "format": "clipkin.runtime-local@1",
  "dataRoot": ".clipkin/runtimes/local",
  "credentials": { "local": { "use": "@clipkin/credential-store-local" } },
  "endpoints": {
    "clipkin.default": {
      "use": "@clipkin/provider-clipkin",
      "config": {
        "apiKey": { "store": "local", "key": "clipkin.account" }
      }
    },
    "media.local": { "use": "@clipkin/media-local" }
  },
  "bindings": {}
}
```

- **`dataRoot`** is where running builds keep their working files and logs, relative to the Profile.
- **`credentials`** names where keys come from. The local store keeps them in your system keychain,
  or in private files on Linux. The env store reads them from environment variables.
- **`endpoints`** lists the services, each with its Provider (`use`) and settings (`config`).
  `clipkin.default` generates through your Clipkin account, which is the only address it accepts.
  Keys are referred to, never written in the file. An optional `pool` lets Endpoints share one capacity limit.
- **`bindings`** say which Endpoint handles a kind of request when several could. The starter binds
  word timing to your Clipkin account:

```json
"bindings": {
  "@clipkin/whisperx@1#whisperx-alignment": "clipkin.default"
}
```

- **`worker`** can set `executionMemoryMb` for the background worker (1024 by default).

The starter Profile has `clipkin.default`, `media.local`, `html.local` and `image.opencv.local`.
Installing a Provider package only makes it available; listing it under `endpoints` gives it a job.
The Model decides what a request means; the Provider decides what its service supports and what it
costs. A request that fails on its Endpoint is never quietly sent through another account. Each
Provider's README lists its settings.

## Prepare only what you need

```bash
clipkin runtime up --endpoint media.local
clipkin runtime status
```

`runtime up` prepares the local programs the chosen Endpoints run (the browser, Python
environments) and starts the background worker. It doesn't sign in or start paid services. Without
`--endpoint` it prepares everything in the Profile; repeat `--endpoint` to pick several.

| Command | Does |
|---|---|
| `clipkin programs prepare\|up\|status\|down --endpoint <name>` | Manage the local programs alone, without the worker |
| `clipkin doctor [--endpoint <name>]` | Check the setup and each service's own diagnostics, without generating anything |
| `clipkin auth status <endpoint>` | Show the key stored for an Endpoint |
| `clipkin auth login clipkin.default` | Store your Clipkin account key |

A stored key or a reachable service doesn't guarantee every request will work, so read `doctor`'s
warnings as well as its errors. Without a Profile selected, `doctor` checks only the project's
results. Setting up some local tools, such as WhisperX, can mean large downloads; compare that with
a hosted option first.

`clipkin plan <run>` checks what the Run needs and whether the Profile can provide it. `clipkin build`
starts the worker if needed and submits one build. [Run Source & Builds](../quickstart/run.md) covers
planning, prices and reuse.

## Builds run in the background

```bash
clipkin build build.slate --follow
clipkin status <build-id> --watch
clipkin logs <build-id>
```

The worker runs builds, not your terminal. `--follow` and `status --watch` only watch: closing the
terminal or running out of wait time doesn't stop the build. To stop one, use
`clipkin cancel <build-id>`. Cancelling a remote job is best effort, and finished outputs are kept.

A failed build stays failed. A new build can reuse its finished outputs. If a build has finished
running but its results still need saving, `status` says so and names
`clipkin result finish <build-id>`, which saves them without generating anything again.
`clipkin result discard` cancels a submission that never started.

`clipkin logs <build-id>` shows a build's steps and problems. `clipkin runtime logs` shows the worker's
own log, and each local program keeps its own logs.

## Several builds at once

Several builds can run together. Limits belong to the account, the deployment or your computer, and
a build waiting on a remote job doesn't hold up unrelated local work. `clipkin activity` shows what's
running across builds.

Each build uses the project code and settings as they were when it started. Editing a component or
the Profile affects the next build, not ones already running. Local programs live separately, so one
warm WhisperX can serve several builds.

The worker keeps the environment it started with. After updating Clipkin or your shell environment,
check what's running, then restart: `clipkin runtime down` stops the worker, and
`clipkin programs down` stops the local programs. Builds don't isolate code from each other for
security; they're separate runs, not a sandbox.

## Results stay with the project

Results are kept in the project's `.clipkin/results/`, on the machine where Clipkin runs. If that's a
remote server, the whole Runtime runs there; queue, working files and results aren't split across
machines. Archive or move finished results yourself when you need to.

A build publishes each output as it finishes, and records how it ended. An output can point at a file
that already exists instead of copying it. `clipkin get` makes a separate copy when a person or another
tool needs the file.

`clipkin builds`, `clipkin history`, `clipkin inspect` and `clipkin get` read results without needing the
original Profile.

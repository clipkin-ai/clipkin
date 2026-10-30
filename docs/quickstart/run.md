---
title: Run Source & Builds
description: Set up a project, connect your models, check the cost, build the video, get the file out, and reuse what you've already generated.
---

This page covers everything around the video itself: setting up a project folder, connecting the
services that generate media, seeing the cost before you spend, building, getting the finished file,
and reusing takes you've already paid for. Your agent normally does all of this for you; this page
explains what it's doing.

## From an empty folder to a finished video

```bash
mkdir my-video && cd my-video
echo '{ "clipkin": { "project": true } }' > package.json
clipkin runtime init
clipkin auth login replicate.default
clipkin runtime up
# write main.reel and build.slate (below)
clipkin plan build.slate
clipkin pricing build.slate
clipkin build build.slate --follow
clipkin get <build-id> --output final.video --to output/final.mp4
```

1. **`package.json`** with `"clipkin": { "project": true }` marks the folder as a Clipkin project.
   Commands look for it, so it has to exist first.
2. **`runtime init`** writes the starter Runtime Profile (below) and selects it.
3. **`auth login`** stores your Clipkin account key, which pays for generation.
4. **`runtime up`** prepares the tools that run on your computer and starts Clipkin's background
   worker.
5. **`plan`, `pricing` and `build`** check the work, show the cost and make the video.
6. **`get`** copies the finished file out.

Keep video projects in their own folders, outside any Clipkin source checkout.

## The Run file

The `.reel` file describes the whole video. A Run file (`.slate`) says what to make from it this
time, and which earlier results to reuse:

```slate
<?reel using="@clipkin/markup/run@1"?>
<slate version="1">
  <author source="./main.reel"/>
  <target output="final.video"/>
</slate>
```

- **The first line is required,** exactly as shown.
- **`author`** comes first and names the `.reel` file, relative to the Run file.
- **`target`** names an output to make. Add several to get several results from one build, for
  example the full video and a preview range:

```slate
  <target output="final.video"/>
  <target output="middle.video"/>
```

A `target` can be any generated output of the `.reel` file, not only the final video: a single
take, a generated image or one Track, so you can check those before building the whole thing.
Settings such as styles can't be targets, and an output that doesn't exist is reported by name.

## Reusing results

Each build is kept on your computer, in `.clipkin/results/`, with an id like
`bld_20261020T101502123Z_K3P9X2M4QA`. A new build doesn't reuse anything by itself: reuse is stated
in the Run file, so it's never a surprise.

```slate
<?reel using="@clipkin/markup/run@1"?>
<slate version="1">
  <author source="./main.reel"/>
  <target output="final.video"/>

  <build-record id="hook-v2" build="bld_20261020T101502123Z_K3P9X2M4QA" output="hook-take.video"/>
  <satisfy output="hook-take.video" candidate="hook-v2"/>
</slate>
```

- **`build-record`** points at one output of an earlier build.
- **`satisfy`** uses it in place of an output of this build. The names don't have to match, so you
  can pick the second of three tries.
- **The steps that would have made it are dropped from the plan,** so that take isn't generated or
  charged again. `plan` counts them as "Run selections".

You can also supply a file you made elsewhere:

```slate
  <file id="my-take" type="@clipkin/blob@1#Blob" from="./takes/hook.mp4" media-type="video/mp4"/>
  <satisfy output="hook-take.video" candidate="my-take"/>
```

To find what to reuse, `clipkin builds` lists past builds, `clipkin history hook-take.video` follows
one output across them, and `clipkin inspect <build-id>` shows what a build holds. `check` doesn't
confirm that a `build-record` exists; `plan` does.

## The Runtime Profile

The Runtime Profile, `clipkin.runtime.json`, says which services handle which jobs. `runtime init`
writes a starter one:

| Endpoint | Does | Needs |
|---|---|---|
| `replicate.default` | Every generation model: video, images, voices, background removal, and word timing, through your Clipkin account | A Clipkin account key |
| `media.local` | Preparing, trimming and mixing media | FFmpeg installed on your computer |
| `html.local` | Rendering the final video | A headless Chrome, which `clipkin runtime up` downloads |
| `image.opencv.local` | [Image operations](./images.md) | [uv](https://docs.astral.sh/uv/), which `clipkin runtime up` uses to set up Python |

- **`clipkin runtime use <file>`** selects a different Profile for the project.
- **`clipkin paths`** shows where things live: the project's `.clipkin` folder (already excluded from
  git), the selected Profile, and the shared folder for tools on your computer.
- **`clipkin runtime status`** checks the worker and tools. **`clipkin runtime down`** stops the worker,
  and **`clipkin programs down`** stops the local tools.

## Connect your Clipkin account

Generation runs through your Clipkin account and is paid with your credits. Create a key on your
[Account page](/account) under **Local access**, then store it:

```bash
clipkin auth login replicate.default
```

Clipkin asks for the key without showing what you type. Keys are stored per computer, not per
project: in the system keychain on macOS and Windows, and in private files on Linux. Never paste a
key into your agent's chat.

- **`clipkin auth status replicate.default`** shows what's stored.
- **`clipkin doctor --endpoint replicate.default`** checks that it works.
- **`clipkin auth logout replicate.default`** removes it.

Generation is charged to your credits as each request is made. A few things to know:

- **Cloning a voice from a recording** asks you to confirm on the Account page that it's your voice
  or that you have permission. The agent tells you when.
- **Errors explain themselves:** 402 means you need more credits, and 401 means the key is missing,
  revoked or mistyped.

## See the cost first

```bash
clipkin plan build.slate
clipkin pricing build.slate
```

**`plan`** lists every request the build would make. With a Profile selected, it also shows which
service handles each one, and reports anything that can't run: a missing key, a model a service
doesn't offer, a reference a service refuses. A build with problems in its plan won't start.

**`pricing`** estimates the cost of those requests. It needs a Profile, and calls no service: rates
come with Clipkin. It ends with a summary:

- **Price:** in dollars and credits.
- **Held:** a safety margin of credits above the estimate, used when a build runs in Clipkin's hosted
  app. Builds on your own computer don't reserve anything.
- **Requests:** how many have a price, how many run locally for free, and how many have no price
  yet. A request has no price when the service would refuse it (`plan` says why), or when its cost
  is only measured during the build, such as word timing priced by audio length.

Credits are charged per request. The estimate is a close guide; the Account page shows the actual
charges.

## Build

```bash
clipkin build build.slate --follow
```

`build` checks everything again, then starts at once: it doesn't ask for confirmation, so look at the
plan and price first. `--follow` shows progress until it finishes. Without it, the build carries on in
the background:

| Command | Does |
|---|---|
| `clipkin status <build-id> --watch` | Follow a build's progress |
| `clipkin logs <build-id>` | Show a build's steps and any problems |
| `clipkin runtime logs` | Show the worker's log |
| `clipkin cancel <build-id>` | Stop a build |
| `clipkin builds` | List past builds |

Useful `build` options: `--title "Launch v2"` names the build, `--runtime <profile>` uses another
Profile for this build, and `--max-wait-ms` limits how long `--follow` waits.

## Get the finished file

When a build finishes, it prints the command to save each result:

```bash
clipkin get bld_20261020T101502123Z_K3P9X2M4QA --output final.video --to output/final.mp4
```

`--output` is the target's name and `--to` is where to save it. Folders are created as needed, and
an existing file is never overwritten. You can also find results in Studio's **Outputs** tab
([Studio](./preview.md)).

## When something is wrong

| Message | What to do |
|---|---|
| "Could not find a Clipkin project" | Add a `package.json` with `"clipkin": { "project": true }` |
| "pricing needs a Runtime" | Run `clipkin runtime init`, or select one with `clipkin runtime use` |
| `RUNTIME_CREDENTIAL_MISSING` | Store the key with `clipkin auth login <endpoint>` |
| `MANAGED_PROGRAM_DOWN` | Start the local tools with `clipkin runtime up` |
| A request listed as `replicate.default: …` with a reason, and "not supported" in the summary | The service won't take it: a model it doesn't offer, a size it doesn't make, or a reference it refuses. Change the request, for example to a model that accepts it |
| `UNKNOWN_SOURCE_EXPORT` | A `target` or `satisfy` names an output the `.reel` file doesn't have |
| "Build … does not contain Output …" | A `build-record` points at the wrong build or output name |
| `SOURCE_HEADER_MISSING` | The Run file's first line is missing |

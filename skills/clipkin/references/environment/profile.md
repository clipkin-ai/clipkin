# Configure the Runtime Profile

Come here to choose a project's execution environment, wire Endpoints to credentials, decide which
Endpoint serves a capability, size shared capacity, or work out when an edit actually takes effect.
[Models and Providers](model-and-provider.md) owns which services to use and how to connect them;
[local tools](local-tools.md) owns preparing and running local programs.

Sections: [starting a Profile](#create-a-profile-when-the-project-needs-one),
[the file's fields](#read-and-edit-the-actual-configuration),
[which Endpoint serves what](#connect-model-capability-need-and-endpoint),
[keys and Stores](#put-secrets-behind-credential-references),
[limits and pools](#set-capacity-at-the-resource-it-describes) and
[when edits apply](#know-when-a-change-takes-effect).

## Create a Profile when the project needs one

Run these inside the project:

```bash
clipkin runtime init
clipkin paths
```

`runtime init` writes an editable starter `clipkin.runtime.json` beside the project and records it as
the project's selection in `.clipkin/runtime`. If a Profile already exists it is left alone. Nothing is
installed, no service is contacted, nobody is logged in and no Worker starts.

The starter is the Distribution's default selection:

- one writable credential Store, `local` (`@clipkin/credential-store-local`);
- `replicate.default` (`@clipkin/provider-replicate`), the only model Endpoint, which serves the image
  and video models, voices (Qwen3 TTS design, clone and preset speakers; MiniMax speech and voice
  cloning), background removal (BRIA) and hosted word timing with one Replicate API token, read
  from `{ "store": "local", "key": "replicate.api-key" }`;
- three credential-free local Endpoints: `media.local` (FFmpeg media work), `html.local` (HTML
  rendering in a managed browser) and `image.opencv.local` (image operations);
- `dataRoot: ".clipkin/runtimes/local"` and one binding,
  `"@clipkin/whisperx@1#whisperx-alignment": "replicate.default"`, which keeps alignment on Replicate
  when `elevenlabs.default` or `whisperx.local` is declared later.

The direct Providers `elevenlabs`, `fishaudio`, `mimo`, `volcengine`, `byteplus`, `openai`, `google`,
`xai`, `minimax`, `alibaba` and `pixverse` still ship with the Distribution but are not declared by
the starter; add one as `<vendor>.default` (key `<vendor>.api-key`) instead of, or next to,
Replicate when the work needs something Replicate refuses or only that vendor offers (ElevenLabs,
Fish Audio or MiMo voices, Volcengine matting of sources longer than 60 s), or when the user
already has that account.
[The Provider overview](model-and-provider.md#choose-the-practical-capability-path-with-the-user)
lists what each Endpoint serves. A declared Endpoint is a routing option, not a to-do item:
an Endpoint nobody's Run demands needs no key, no login and no preparation. Keep the entries and
bindings that fit the work and the user's chosen setup.

Other ways to select a Profile:

- `clipkin runtime use <profile>` records an existing Profile for this project, and
  `clipkin runtime unset` removes the selection.
- `--runtime <profile>` overrides the selection for a single command.
- `--project /path/to/project` makes a command act on that project from anywhere; it works for
  `paths`, `auth`, `doctor`, `runtime`, `programs` and Build status and control.

Commands only ever read the selection file of the project they are pointed at. They do not guess from
a familiar filename or borrow another project's choice. The
[project boundary](../creation/project-files.md#establish-the-project-boundary) explains how the
project itself is found.

| Location | What it holds |
| --- | --- |
| Project directory | Sources, Runs, assets and component dependencies |
| `.clipkin/runtime` | The file that names the selected Profile |
| The Profile file | Editable execution choices; can be shared deliberately |
| Profile `dataRoot` | Execution data, Worker state and working files, resolved from the Profile's directory |
| Host state (`clipkin paths`) | Machine-wide prepared Programs and helpers, e.g. `<hostState>/programs/…` |
| Project `.clipkin/results` | Finished Results and Outputs that belong to this project |

The selection file and the execution directory must be different paths. The CLI, Studio and the
creation commands all address the same project context; there is no separate CLI environment to
set up. Installed code, selected configuration and existing execution data stay separate.

## Read and edit the actual configuration

A complete Profile for credential-free local media work:

```json
{
  "format": "clipkin.runtime-local@1",
  "dataRoot": ".clipkin/runtimes/local",
  "credentials": {},
  "endpoints": {
    "media.local": {
      "use": "@clipkin/media-local"
    }
  },
  "bindings": {}
}
```

It selects media processing and nothing else. It relies on the host to supply compatible `ffmpeg`
and `ffprobe`; it installs neither, chooses no image model and renders no HTML pictures. Use it
when that is genuinely all the work needs, never as a replacement for a production's existing Profile.

| Field | How to decide |
| --- | --- |
| `credentials` | Named Credential Store adapters; leave empty when no selected Endpoint needs a secret |
| `endpoints` | Named Provider instances; `use` names the package and that package's README defines `config` |
| `bindings` | Full capability keys, each pointing at the Endpoint name that serves it |
| Endpoint `pool` | Optional label for one real account, deployment or compute quota that several instances draw on |
| `dataRoot` | The directory holding this Runtime's execution state; a different path means different state |
| `worker.executionMemoryMb` (optional) | Memory budget for Build execution processes; the Runtime package owns its start-up policy |

Documentation snippets are fragments: merge them into the matching objects of the existing Profile
and keep the other services, credential references and bindings the project relies on. A fragment
without `format` and `dataRoot` is not a Profile on its own. Installing a package makes an adapter
available; declaring it under `endpoints` creates an instance. Configuration keys belong to the
package, so `region`, `models` or `baseUrl` on one Provider says nothing about another Provider's schema.

## Connect Model, capability, Need and Endpoint

The [roles of Model and Provider](model-and-provider.md#start-from-the-capability-the-work-needs)
separate what is asked from who answers. An authored request becomes a concrete external **Need**
only when the Run still demands its output; an existing Result Candidate can satisfy that output with
no new request.

A **capability** names the exact operation, such as `@clipkin/seedance@1#seedance-2`. The Profile
routes it to an **Endpoint**, a configured Provider instance, and a **binding** is the explicit form of
that routing choice:

- Exactly one eligible Endpoint: it serves the capability, no binding needed.
- Several eligible Endpoints and no binding: an error, never a fallback order.
- A binding: the named Endpoint serves the capability and must actually support the concrete request.

Overlap is common, so check it whenever an Endpoint is added:

| Capability | Endpoints that can offer it |
| --- | --- |
| `@clipkin/whisperx@1#whisperx-alignment` | `replicate.default` (hosted Scribe; the starter binds it), plus `elevenlabs.default` (also Scribe) and `whisperx.local` when declared |
| A generation capability Replicate hosts (Seedance 2.0, Seedream, GPT Image, Nano Banana, Grok Imagine, MiniMax H3, Wan, PixVerse V6) | `replicate.default`, plus its direct Provider once declared, plus any project Provider you declare for the same capability |
| Qwen3 TTS (`@clipkin/qwen3-speech`), MiniMax speech (`@clipkin/minimax-speech`), BRIA matting (`@clipkin/bria-matting`) | `replicate.default` only (no direct Provider serves them), plus any project Provider you declare |
| Any other generation capability (ElevenLabs, Fish Audio, MiMo voices, Volcengine matting, Seedance 2.5, PixVerse C1, Grok Imagine 1.5) | Its direct Provider once declared, plus any project Provider you declare for the same capability |

For example, declaring `byteplus.default` next to `replicate.default` makes both offer
`@clipkin/seedance@1#seedance-2`; bind the one that should serve it:

```json
{
  "bindings": {
    "@clipkin/seedance@1#seedance-2": "byteplus.default"
  }
}
```

Capabilities only BytePlus offers, such as `#seedance-2.5`, need no binding. A project that declares
`whisperx.local` must likewise replace the starter's alignment binding to say which one aligns speech:

```json
{
  "bindings": {
    "@clipkin/whisperx@1#whisperx-alignment": "whisperx.local"
  }
}
```

Bind `"replicate.default"` (the starter's choice) or a declared `"elevenlabs.default"` instead to keep hosted
transcription. Always copy the complete capability
key from the Model or Provider documentation rather than a vendor's model label. The same Source can
then align locally in one deployment and through a hosted service in another.

Explicit bindings let capability-scoped commands load just the named Endpoints. Without one, finding
the eligible implementations may require loading every declared Endpoint package, so a declared
Provider package that was never installed can block discovery. Fix the declaration or add the
intended binding. An account the work does not use never has to be logged in for routing to resolve.

[Local WhisperX](local-tools.md#select-local-whisperx-explicitly) shows the complete local alignment
fragment, and [service connections](model-and-provider.md) show vendor and project
Provider fragments. Result storage and project-package resolution are unrelated to this routing.

## Put secrets behind credential references

The Profile stores only a Store name and a key; the secret itself stays inside that Store.

| Store package | Where secrets live |
| --- | --- |
| `@clipkin/credential-store-local` | Writable. macOS Keychain, Windows Credential Locker, or owner-private files on Linux. `config.backend: "file"` (with optional `config.path`) forces files, e.g. for Windows secrets longer than Credential Locker's 512 characters |
| `@clipkin/credential-store-env` | Read-only. Resolves one explicitly named environment variable per reference |

The local Store picks its backend from the operating system; it is one Store, not a list of stores to
try in turn. A read failure never moves a secret elsewhere or falls back to another Store, and
`backend: "system"` on Linux fails rather than quietly switching to files. The file backend's
`path` resolves under the Host state root shown by `clipkin paths`; read the Store's README for
platform and permission rules.

To use a Store, declare it under `credentials` and name it in the Endpoint's credential reference.
The starter already does this for its one vendor Endpoint:

```json
{
  "credentials": {
    "local": { "use": "@clipkin/credential-store-local" }
  },
  "endpoints": {
    "replicate.default": {
      "use": "@clipkin/provider-replicate",
      "config": {
        "apiKey": { "store": "local", "key": "replicate.api-key" }
      }
    }
  }
}
```

A direct Provider added later takes the same shape, for example `openai.default` with
`@clipkin/provider-openai` and `openai.api-key`, or `elevenlabs.default` with
`@clipkin/provider-elevenlabs` and `elevenlabs.api-key`. Once the user has chosen to connect that account:

```bash
clipkin auth status replicate.default
clipkin auth login replicate.default
```

`login` asks for the key through secure terminal input and writes it to the Store. With
`--from /private/path/key.txt` it imports a secret file the user placed there instead; `--slot <name>`
targets one slot when an Endpoint declares several; `auth logout` removes a value. Login and logout
can replace or delete a damaged value without reading it, while `status` and execution still report
read errors. On a hosted Clipkin workspace the platform supplies these credentials, so there is
nothing for the user to store.

None of the shipped vendor Providers uses browser sign-in, but a Provider may declare one, and
`auth status` says so. Its `login` then prints `Sign in through your browser: <url>` and waits. Run it as a
background task and give the user that URL. If the login does not finish on its own, the callback
page shows a `<code>#<state>` value; while the CLI is still waiting, deliver it with
`curl "http://127.0.0.1:<port>/callback?code=<code>&state=<state>"`, where `<port>` is the number
after the last `.` in `<state>`. The code is single-use and only valid for that waiting process. The
login is finished when the CLI reports the credential stored, not when the browser page says success.

For a deployment whose environment owns the secret, declare the env Store and point the Endpoint's
reference at a variable name you choose:

```json
{
  "credentials": {
    "env": { "use": "@clipkin/credential-store-env" }
  },
  "endpoints": {
    "openai.default": {
      "use": "@clipkin/provider-openai",
      "config": {
        "apiKey": { "store": "env", "key": "OPENAI_API_KEY" }
      }
    }
  }
}
```

That variable must reach both the CLI commands that need it and the Worker when it starts.
`auth login` cannot write to an environment Store, and exporting a variable in a terminal does not
change a Worker that is already running.

Use separate Endpoint names and credential keys for separate accounts; the binding chooses which one
serves a capability, and storing a different vendor's key never changes which Provider runs.
`auth status <endpoint>` reports declared slots without revealing values. "Configured" means present,
not accepted, funded, reachable or permitted for every model. Secrets never belong in Sources, Runs,
the Profile, command-line arguments, git history or chat.

## Set capacity at the resource it describes

The Worker advances Builds; the HTML renderer's `workers` counts Chrome processes inside one render
Need. They are different controls, and there is no separate Build-wide model concurrency knob.

| Control | What it limits |
| --- | --- |
| `config.defaultConcurrency` (most Providers) | Simultaneous Needs on that resource across all Builds |
| `config.actionLimits` with `submit`, `poll`, `collect` | Concurrency and rate of each action, where the Provider accepts them |
| Endpoint `pool` | Shared identity for instances that consume the same real quota |
| HTML renderer `workers`, `maxWorkers` | Fixed Chrome count per render, or the ceiling for `auto` |
| HTML renderer `browserCapacity` | Chrome budget shared across admitted renders |

Size limits from the account, not from habit. Vendor examples from the Provider READMEs: Replicate
defaults to 4 for the Endpoint and for each action; OpenAI's image rate depends on the account tier
(20, 150 or 250 images per minute), set through `actionLimits.submit.rate`; Xiaomi MiMo defaults to
100 requests per minute; Fish Audio defaults to 5 concurrent calls for its starter tier; PixVerse
defaults to 2 and depends on the plan; ElevenLabs' `defaultConcurrency` should match the plan's
concurrency. Each README lists which keys it accepts.

A render budget, for example:

```json
{
  "endpoints": {
    "html.local": {
      "use": "@clipkin/provider-html-local",
      "pool": "local-render",
      "config": {
        "defaultConcurrency": 2,
        "workers": 4,
        "browserCapacity": 6
      }
    }
  }
}
```

Two renders may be admitted, but only one four-browser render fits inside six browsers at a time.
Pick real numbers for the machine. The renderer holds both budgets for the whole render, including
preparation and encoding, and does not hand capacity back as individual browsers exit.

Instances that share a pool must agree on its limits, and two accounts do not share a pool just
because they offer the same model. Coordination covers Builds sharing one Runtime execution store; it
is not a cross-machine quota service. An accepted asynchronous operation keeps its task claim while
pending, and short submit/poll/collect calls draw on their own action budgets when declared. Ending
a Build attempt releases its local claims but keeps receipts and the last known remote state; it
does not mean the remote task was cancelled.

`clipkin activity --verbose` shows actual claims when capacity explains a wait. Studio's transient work
is limited per session, separately from all of this.

## Ask each command for the fact it owns

| What you want to know | Where to look, and its limits |
| --- | --- |
| Which project, Profile and storage locations apply? | `clipkin paths` |
| Is a credential stored for this Endpoint? | `clipkin auth status <endpoint>`; says nothing about account access |
| What will this Run demand, and through which Endpoints? | `clipkin plan <run>`; concrete requests, support checks, cheap readiness of the Endpoints it resolves |
| What will it cost? | `clipkin pricing <run>`; per-request quotes and the Run estimate, see [Builds](../production/builds.md#price-the-same-requests) |
| Do the selected services work? | `clipkin doctor --endpoint <instance>`; bounded active diagnosis, no generation submitted |
| Is the Worker running and is work active? | `clipkin runtime status`, `clipkin activity` |
| Which local helpers answer, and where are their logs? | `clipkin programs status --endpoint <instance> --verbose` |

Pick the observation the next step needs; none of these is a ritual to run before every operation.
Without a selected Profile, `doctor` checks project Results only; with one, it may contact remote
services. `plan` never probes remote services or installs anything, and neither command prepares
every language model just because a local service reports healthy.

Prepare selected resources and start helpers with
[the local Program commands](local-tools.md#let-the-selected-endpoint-own-its-program). When a
capability is missing, Script, reference and component work may still proceed; say which requested
outcome is waiting on it. [Review](../production/review.md#show-what-the-current-work-establishes)
distinguishes useful intermediate evidence from the deliverable.

## Know when a change takes effect

| Change | What follows |
| --- | --- |
| Source, Run or project component code | Submit a new Build for the changed work |
| Endpoint config or a binding | New Builds read the current choice; a Build already submitted keeps the configuration it loaded |
| A value in a writable Store | Later credential reads see it; it is not a reason to restart the Worker |
| The Distribution, Worker start-up policy or the Worker's inherited environment (including env-Store variables) | Restart the Worker explicitly once active work allows |
| The model, device, compute type, batch size or cache of a local service that is running | Prepare the new resources, then restart that helper while idle |
| An extra WhisperX alignment language in the same cache | Run a scoped `programs prepare`; the service can keep running |
| The browser download source | Used by the next preparation that needs it; a healthy cached browser stays in use |
| The Profile behind an open Studio session | Restart the session if it must load the edited selection |

Starting a Build does not freeze external files or services in place. Consult
[Build execution scope](../production/builds.md#build-with-the-current-project-implementation) before
restarting a coordinator or changing dependencies while work is active. Do not restart everything
after every edit, and do not expect a finished Build to run again by itself.

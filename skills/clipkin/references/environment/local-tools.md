# Local tools and Managed Programs

Come here to judge how much local preparation the work needs, to choose local WhisperX, or to
prepare, start, inspect or repair a local Endpoint's executable or Managed Program.

Go to [host executables](#supply-host-executables-at-machine-scope),
[local media configuration](#configure-local-media-tools),
[the Program lifecycle](#let-the-selected-endpoint-own-its-program),
[the render browser](#prepare-the-local-rendering-browser),
[WhisperX](#select-local-whisperx-explicitly) or
[downloads and mirrors](#make-network-preparation-practical).

## Assess local preparation

`clipkin paths` shows the selected Profile and the machine's Host state. Read the configuration of the
Endpoints the work will use, the locations their Provider READMEs document, and whether host
executables such as `ffmpeg`, `ffprobe` and `uv` resolve. Clipkin's managed WhisperX lives in its own
Python environment under the Host state, so a missing global `whisperx` command tells you nothing
about it; the `@clipkin/provider-whisperx-local` README owns where that installation and its service live.

Sort what you find into three groups: ready to use, needing a start or a repair, and needing a
download. Feed that into the
[service decision](model-and-provider.md#choose-the-practical-capability-path-with-the-user), then
prepare the chosen setup following its Provider's instructions and the evidence in its logs. Weigh
hardware and the network the machine can actually reach as well as files on disk. A cached Python
environment may still lack the speech-model weights, or one language's aligner, that the first
useful request needs. Existing weights are a point in favour of the local route; say so while still
offering the hosted alternative (Scribe, through the Clipkin account's `replicate.default`, serves the
same alignment capability). Starting a
newly configured large model is preparation even when every weight is cached. A service the user
already chose and that works can simply be carried forward.

Keep four facts apart: **available**, **selected**, **prepared** and **running**. A binary on disk may
not be the one the Profile selects; a Profile declaration installs nothing; a running speech service
does not mean a new language's aligner is cached. Verify whatever the next step relies on,
rather than declaring the whole machine ready or unready.

## Diagnose the selected local capability

| Question | Command |
| --- | --- |
| Which Profile and machine locations apply? | `clipkin paths` |
| Is the Worker running, and is work active? | `clipkin runtime status` |
| What has the Worker itself reported? | `clipkin runtime logs` |
| Which selected helpers answer, and where are their logs? | `clipkin programs status --verbose` |
| Do an Endpoint's configuration and service access work? | `clipkin doctor --endpoint <instance>` |

Read the failing Endpoint's message and its package README before changing anything on the machine.
The Profile says which local implementation is selected; a service that works for another project is
no evidence that this Profile uses it.

## Supply host executables at machine scope

The Distribution needs Node.js 22.15 or newer. Local media work needs both `ffmpeg` and `ffprobe`,
either on `PATH` or at explicit paths the Provider accepts. Managed Python Programs (local WhisperX,
the OpenCV image operations, the `yt-dlp` downloader) use `uv` to build their locked environments in
the machine's Program Home. Check the installed Distribution's requirements before touching Node;
updating the Skill does not change them.

Install whichever executables the chosen work is missing with the host's normal package manager,
then verify them in the environment that will run Clipkin:

```bash
# macOS
brew install ffmpeg
brew install uv
ffmpeg -version
ffprobe -version
uv --version
```

```powershell
# Windows
winget install --id Gyan.FFmpeg.Shared -e
winget install --id astral-sh.uv -e
ffmpeg -version
ffprobe -version
uv --version
```

On Linux, use the distribution's package manager or the tool's current official installer for the
same executables. These tools belong to the machine, not to the video project; `clipkin paths` shows
the shared Host state that the Runtime adapters prepare into.

### Configure local media tools

With ordinary installations, the media and rendering Providers find `ffmpeg` and `ffprobe` on their
process `PATH`. When a deployment deliberately uses specific binaries, merge their real paths into
the selected Endpoint (these absolute paths are placeholders):

```json
{
  "endpoints": {
    "media.local": {
      "use": "@clipkin/media-local",
      "config": {
        "ffmpegPath": "/opt/media/bin/ffmpeg",
        "ffprobePath": "/opt/media/bin/ffprobe"
      }
    }
  }
}
```

A relative path here resolves against the Runtime `dataRoot`. In JSON, write Windows paths with
forward slashes or escaped backslashes. The media Program probes these executables during
preparation; `programs prepare` never installs FFmpeg for you. `html.local` accepts the same
`ffmpegPath` and `ffprobePath` keys and needs them set separately when it should use custom
binaries, because one Endpoint's configuration never carries over to another.

A passing `-version` probe proves the executable runs, not that every codec or operation works; read
the actual media failure when a specific input misbehaves. A changed `PATH` reaches only processes
started afterwards: reopening a terminal does not change a Worker that is already running (see
[when changes take effect](profile.md#know-when-a-change-takes-effect)).

## Let the selected Endpoint own its Program

Each Endpoint can bring at most one Managed Program with it: resources to prepare plus, optionally, a helper that
keeps running. The render browser has to be installed but never runs permanently; WhisperX needs
weights and a warm service; the media tools need only their executable probes. The Provider declares
what preparation, start-up and probing mean; the Runtime carries those declarations out:

```bash
clipkin programs up --endpoint whisperx.local
clipkin programs status --endpoint whisperx.local
```

| Intention | Command |
| --- | --- |
| Prepare resources without starting helpers | `clipkin programs prepare --endpoint <instance>` |
| Prepare and start the selected helpers | `clipkin programs up --endpoint <instance>` |
| See their current state and log paths | `clipkin programs status --endpoint <instance>` |
| Stop helpers Clipkin manages | `clipkin programs down --endpoint <instance>` |
| Prepare, start helpers and start the Worker | `clipkin runtime up --endpoint <instance>` |

`--endpoint` takes a Profile instance name and can be repeated; it scopes preparation and Program
operations together. Leaving it out deliberately covers the whole Profile, including every
Endpoint it declares. Bindings decide which Endpoint fulfils a request, and `plan` checks only the
Endpoints its requests resolve to, so an unused local service or a key nobody stored never
becomes a prerequisite for a Build.

Program commands leave the Worker alone, and `runtime down` stops the Worker and its execution
processes while leaving Programs up. A later Build can therefore reuse a model that is already warm;
use a scoped `programs down` when the helper itself should stop. Repeating `up` on a healthy service
keeps it warm, while an explicit `prepare` can still add newly requested resources. Submitting a
Build may start the Worker, but it never installs missing resources or starts these helpers. Before a
cold start, local WhisperX reconciles its packaged Python environment, and uv reuses cached packages
and weights; that is unrelated to loading project component code for a new Build.

A service that is still loading already has a live PID: a repeated `up` observes that process instead
of spawning another, and a readiness wait can expire while the process stays alive. Read its probe
and log to learn why it is not Ready yet. If two commands prepare the same Program at once, the
second reports the current owner and its logs; repeating the command does not make preparation faster.

Ordinary projects rely on these declarations; they do not run a service's internal `uv sync` or Python
entry point by hand. Operator commands in a service's README are for diagnosing that packaged service,
not for building a second installation inside the project.

Some tools have their own entry points and need no Profile or Build:

- [Video downloading](../production/video-downloads.md): `clipkin download prepare` once, then
  `clipkin download <url> --to <video.mp4>`.
- [Browser capture](../production/browser-capture.md): `clipkin capture install-browser` prepares its
  browser; `--browser-cache` and `--browser-download-base-url` choose the cache and archive source.
- [Image operations](../production/image-operations.md): the local OpenCV Provider manages its own
  Python environment, and `pythonExecutable` selects an operator-managed compatible one instead.

Each keeps preparation separate from use, and none of them needs a Runtime Profile.

## Prepare the local rendering browser

Rendering uses a browser that belongs to the chosen HTML renderer Provider. Its installed
`@clipkin/provider-html-local` README describes the configuration that installation supports; a newer
Skill cannot add options to an older executable, and
[Distribution updates](distribution.md#check-and-update-the-relevant-installation) explain how to
check and update when an option you need is missing.

For ordinary rendering, use the browser version the Provider release recommends (Chrome for Testing,
headless shell). Prepare the selected instance explicitly, substituting the real Profile and name:

```bash
clipkin programs prepare --runtime <profile> --endpoint html.local
```

`runtime up` also prepares selected Programs and then starts the Worker. Installing the package alone
does not fetch the browser. `doctor` and the checks before a Build look at the selected executable but never download it, and a system Chrome does not count as the selected browser being ready. The usual
declaration needs no version written into the project:

```json
{
  "endpoints": {
    "html.local": {
      "use": "@clipkin/provider-html-local"
    }
  }
}
```

The Provider release records its recommendation (`clipkin.htmlBrowser.version`); that, not a search
of the system or a moving "latest" channel, decides the managed version. Managed downloads default
to `~/.cache/clipkin/html-rasterizer/chrome`.

| Intent | Provider configuration |
| --- | --- |
| Use the release's recommended managed browser | Leave out `chromePath` and `browserVersion` |
| Deliberately pick another managed release | `browserVersion` set to an exact four-part version |
| Use a browser installation the user controls | `chromePath` set to its executable |
| Keep managed downloads in another cache | `browserCacheDirectory` |
| Fetch missing archives from a chosen compatible source | `browserDownloadBaseUrl` |

`chromePath` cannot be combined with `browserVersion` or `browserDownloadBaseUrl`; such combinations
fail. A user-managed browser is never downloaded or repaired by Clipkin. Relative browser and cache
paths resolve from the Runtime `dataRoot`, not from the Profile's directory.

Environment hints, other cached versions and an installed system Chrome never override the
selection; `doctor --endpoint html.local` reports what is selected when you need to diagnose it.

When the browser download is blocked, point the Provider's `config.browserDownloadBaseUrl` at a
compatible source; an npm mirror does not redirect browser archives. Check the archive URL, version
and destination that preparation prints. A failing chosen source is reported as a failure, with no
silent retry elsewhere, and changing the source keeps a healthy cached installation. Use
[network preparation](#make-network-preparation-practical) to tell a missing archive from a network
problem and to pick a route within the user's existing scope. Edited Endpoint settings apply to
the next Build; a Distribution change or inherited environment change has its own restart rules in
[when configuration takes effect](profile.md#know-when-a-change-takes-effect).
A prepared browser is no guarantee that every page or GPU path renders: when a capture fails, work
from that render's diagnostics, and never "fix" it by quietly switching browsers.

## Select local WhisperX explicitly

`@clipkin/whisperx@1#whisperx-alignment` is served by two Providers: local WhisperX and hosted
Scribe through the Clipkin account's `replicate.default`. The starter binds alignment to
`replicate.default`. Both return the same aligned transcript evidence. When
the user chooses local execution, merge this fragment, replacing the starter's alignment binding,
and keep the other services the production uses:

```json
{
  "endpoints": {
    "whisperx.local": {
      "use": "@clipkin/provider-whisperx-local",
      "config": {
        "expectedModel": "small",
        "expectedDevice": "cpu",
        "expectedCompute": "int8",
        "alignmentLanguages": ["ko"]
      }
    }
  },
  "bindings": {
    "@clipkin/whisperx@1#whisperx-alignment": "whisperx.local"
  }
}
```

This example aligns Korean on a CPU with the modest `small` model; pick the model and languages for
the real production. The binding is required whenever another alignment Endpoint is also declared,
which is the case in the starter Profile (`replicate.default`). Without it, `clipkin transcribe`
and Builds that align speech fail on the ambiguity instead of choosing one.

| Setting | What it selects |
| --- | --- |
| `expectedModel` | The speech-recognition model the service loads |
| `expectedDevice`, `expectedCompute`, `expectedBatchSize` | Inference hardware, numeric representation and batch budget |
| `alignmentLanguages` | Which language-specific aligners to prepare |
| `modelCacheDirectory` | Optional cache root with `huggingface/` and `torch/` subdirectories, relative to `dataRoot` |
| `baseUrl` | The service's loopback address (default `http://127.0.0.1:8765`); separate services need separate addresses |
| `serviceCommand` | Optional operator-managed command that installs and starts a compatible service |

The Provider README owns exact fields, defaults, device support and service identity. The packaged
backend is faster-whisper on CTranslate2, so Apple Silicon does not mean CUDA, and an `mps` setting
does not apply. The loopback service takes canonical 16 kHz speech evidence and returns measured
alignment; it knows nothing of the Script, Caption Cues or Semantic Segments. The language in the authored
request and the language list in the Profile do different jobs: `alignmentLanguages` decides what is
prepared, the request decides which language is used.

Choose the recognition model deliberately for the language, hardware and job. For multilingual work
where quality comes first and the hardware allows it, a large multilingual model such as `large-v3`
(for example on CUDA with `float16`) is a sensible starting point. A smaller model that is already
ready can handle a short, clear reference on a modest CPU, and being ready counts for more than
being able to start a bigger download. A larger recognizer improves the words fed to alignment but
does not bring a larger aligner. Weigh accuracy against setup and inference time, hosted option
included, and configure the chosen model before preparing it.

List this production's actual languages in `alignmentLanguages` and keep any others still in use.
To add English to the Korean example, change `["ko"]` to `["ko", "en"]`, then:

```bash
clipkin programs prepare --endpoint whisperx.local
clipkin programs up --endpoint whisperx.local
```

The first command prepares the Python environment, the selected recognition model, the requested
aligners and the sentence data, without starting anything. The second prepares whatever is still
missing and starts the helper. Use `clipkin runtime up --endpoint whisperx.local` when the Worker
should start too. Start-up and inference only read what preparation put in place.

The language list states what to prepare; it is not an allowlist, and supported languages already
in the cache stay usable. Leaving it out prepares recognition and sentence data only, not every
aligner. Cache reuse follows the chosen model and cache settings; Clipkin keeps no separate catalogue.

A healthy service does not mean a newly needed language is ready. Add the language to the Profile and
run `programs prepare`, even while the service is up, keeping its cache selection the same. A missing
aligner fails with an explicit preparation instruction; retrying inference will not download it.
Changing the running service's model, device, compute, batch size or cache needs an idle restart:
prepare the new resources, stop with a scoped `programs down`, start with a scoped `programs up`.
Restarting only the Worker leaves WhisperX untouched.

## Make network preparation practical

Preparation is part of delivering the video, so watch it like work. Read the running command's
progress: which dependency or weight file, which host it comes from, how much has arrived, and
whether it is downloading, unpacking or loading. Managed Program preparation writes `install.log`;
the running service writes `program.log`, with stderr in a separate `program.err.log` on Windows.
Download messages belong in `install.log`; model-loading and inference messages belong in the service
log. Some downloaders print no progress when they are not attached to a terminal.

`programs status` lists existing installation and service log paths, even before preparation has
started the service. Those files keep history, so their existence does not mean anything is active.
With `--json`, the final result goes to stdout and live preparation notices to stderr. WhisperX's
service log separates recognition-model loading, transcription, first-use loading of a prepared
aligner and word alignment; loading cached weights into memory is not a download.

Judge whether to keep waiting from transfer progress, cache growth and process activity, measured
against what this commission can afford; a quiet log alone does not prove a stall. A longer timeout
helps a healthy slow transfer finish but cannot rescue an unusable route. Decide from each
observation whether to wait, change the download route or recommend a different service, and tell the
user what that means for the piece. Let a known wait run while you advance independent work; reading
the same output again adds nothing.

Mainland China and other restricted networks can make specific hosts slow or unreachable. Choose a
reachable source from the user's actual network context and transfer evidence, never from the
language they write in. Keep useful downloads and caches and change only the part that is blocked.
Explain the changed outlook promptly, and when local preparation would dominate the production time,
recommend the practical alternative: hosted alignment through the starter's `replicate.default` removes the
speech-model download entirely, subject to the user's spending choice. Keep reference and
component work moving meanwhile.

A **mirror** is another server that hands out copies of the same packages or model files. It changes
where the bytes come from; the selected versions and model still decide what runs, it does not
replace a Provider, and it pays for nothing. A **cache** already holds downloaded files and may avoid
the transfer; a **proxy** forwards requests to their original destinations. Fix the resource that is
actually blocked.

Each download client has its own controls:

| Download | Controls and caveats |
| --- | --- |
| npm packages | `--registry` on the command or `npm_config_registry`. A mirror can lag behind new releases; check that it has the version you need |
| Python packages | pip reads `--index-url` / `PIP_INDEX_URL`; uv reads `--default-index` / `UV_DEFAULT_INDEX`. Managed services install with `uv sync --frozen`, whose locked artifact URLs an index setting does not rewrite; read the Provider README before relying on one |
| The Python runtime | `UV_PYTHON_INSTALL_MIRROR` points uv at a compatible Python-distribution mirror. A PyPI mirror does not supply Python, and a compatible installed Python may avoid the download |
| Hugging Face weights | `HF_ENDPOINT` points at a compatible Hub; `HF_HOME` / `HF_HUB_CACHE` choose reusable cache locations. Redirected weight hosts must be reachable too, and some alignment models come from torchaudio's hosts instead |
| NLTK sentence data | If preparation mentions `NLTK_ALLOW_PROXIED_URLOPEN`, the downloader wants an explicit trust decision about the configured proxy. For a trusted proxy, set it to `1` on the preparation command only; never turn it on by default or for inference |
| The render browser | The Provider owns its archive source; see [browser preparation](#prepare-the-local-rendering-browser) |
| FFmpeg and other binaries | The host package manager's own download settings, or an official prebuilt release. npm and PyPI mirrors do not redirect these; Homebrew bottles and GitHub release assets have their own sources |

Make any route change explicit: name the blocked download, the proposed source and the command or
service that will use it. Use a mirror the user or their organization trusts, with settings scoped to
the preparing command or session. A preparation choice the user has already settled covers this
work; an unsettled trust question or a machine-wide setting belongs to the user. Keep the selected
package versions, record the effective choices for the next session, and afterwards read the actual
download host to confirm the intended route was used.

For example, once local WhisperX and a trusted compatible Hugging Face mirror are chosen, pass the
mirror to preparation only (replace the placeholder with the real source):

```bash
HF_ENDPOINT=https://hf-mirror.example clipkin programs prepare --endpoint whisperx.local
```

In PowerShell, scope the change and restore the previous value afterwards:

```powershell
$previousClipkinHfEndpoint = $env:HF_ENDPOINT
try {
  $env:HF_ENDPOINT = 'https://hf-mirror.example'
  clipkin programs prepare --endpoint whisperx.local
} finally {
  $env:HF_ENDPOINT = $previousClipkinHfEndpoint
}
```

A new download source needs no restart of a running service that keeps the same cache: preparation
writes into that cache and inference reads from it. A changed cache variable or service setting does
need an idle restart so the process sees it. Confirm the host and progress in `install.log`; an environment
variable only asks one client, not proof that every weight came through the mirror. A Hugging
Face route does not redirect aligners fetched from other hosts, and it does not affect NLTK.

For npm, a read-only query such as
`npm view <package> versions --json --registry https://registry.npmmirror.com` shows which releases
that registry offers; pass the same `--registry` to the install command if it has the version you
need. The frozen uv URLs above need their own solution (a working network route, a pre-populated
compatible cache, or an operator-managed `serviceCommand`); no pip setting fixes a uv download.

Sources worth consulting include [uv's environment settings](https://docs.astral.sh/uv/reference/environment/),
[TUNA's PyPI mirror](https://mirrors.tuna.tsinghua.edu.cn/help/pypi/),
[TUNA's Homebrew guide](https://mirrors.tuna.tsinghua.edu.cn/help/homebrew/),
[npmmirror](https://npmmirror.com/) and [HF-Mirror](https://hf-mirror.com/). They are options to
evaluate, not defaults to switch on. A mirror that answers metadata requests can still redirect large
files elsewhere, so diagnose the transfer itself.

## Repair from the narrowest evidence

- An executable that cannot be found is a host-installation and `PATH` matter.
- An npm dependency of a selected adapter belongs to the package manager and lockfile of whichever
  Distribution or project installed that adapter. `programs prepare` and `programs up` handle only
  Provider-declared runtime materials, and `runtime up` adds starting the Worker.
- A down or mismatched Managed Program points to its Provider configuration, `programs status` and
  its service log.
- A healthy local Program that rejects a request points to the Provider's support check or request
  error, not to reinstallation.
- Remote failures — authentication, account, quota or model catalogue — belong to that remote Endpoint
  and [its service connection](model-and-provider.md#diagnose-the-actual-connection), even though the
  Worker runs locally.

Project component and Profile edits reach the next Build through its fresh execution context. Before
restarting the coordinator for a Distribution or inherited-environment change, read
[Build execution](../production/builds.md#build-with-the-current-project-implementation) so active
work is preserved.

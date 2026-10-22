# Choose and connect model services

Come here when the work needs model access, when the user brings a key or a deployment, when a
selected service cannot serve a request, or when you need to explain what the work will cost. This
page owns the service decision, the connection work, pricing and the project extension path.
[Profile](profile.md) owns configuration syntax, credential Stores and routing;
[local tools](local-tools.md) owns local preparation. The Craft pages own what generated or
transformed media should look and sound like.

Go to [the service decision](#choose-the-practical-capability-path-with-the-user),
[connecting a shipped vendor](#connect-a-vendor-account-on-a-self-managed-install),
[connecting the user's own service](#connect-a-service-the-user-brings),
[writing a project Provider](#implement-the-missing-capability-in-the-project),
[pricing](#price-quote-and-meter-the-work) or [diagnosis](#diagnose-the-actual-connection).

## Start from the capability the work needs

Name the next useful result and the material already in hand. Replacing a face or transferring
motion needs an implementation of that operation that accepts the actual references; it does not
by itself call for a transcript, an image step or a local render browser. A Run may be satisfied by an
existing Output with no model call at all, and once a Run exists,
[Build planning](../production/builds.md#plan-the-selected-run) lists the requests that remain.

| Part | What it decides |
| --- | --- |
| Model | What is being asked: the exact model, text and media inputs, reference roles, parameters and result type |
| Provider | How one service fulfils that capability, through an API or a local process |
| Endpoint | One configured Provider instance bound to a particular account, region or deployment |
| Runtime Profile | The selection of Endpoints and Credential Stores, plus bindings that settle overlaps |

A Model can be served by any Provider that implements its exact capability, and one Provider can
serve several Models. Installing a Model describes requests; it grants no access. A key grants
whatever its issuer allows; it does not implement that issuer's API.

## Choose the practical capability path with the user

### Where Clipkin runs decides who holds the accounts

| Setting | Accounts and keys | How the user pays | What you do |
| --- | --- | --- | --- |
| **Hosted Clipkin workspace** | The platform's vendor accounts are already connected to the workspace's Endpoints, and its Profile binds each shared capability to the vendor the platform prefers (Seedance 2.0 to `byteplus.default` when the platform offers BytePlus; the workspace notes say when to rebind) | In credits: `clipkin pricing` shows the customer price and the hold reserved before each Build; `clipkin usage` shows what was metered | Choose models per capability, agree the spend in credits, and never ask for vendor keys |
| **Own install with a Clipkin account** | One personal Clipkin API key, created on the user's Clipkin Account page under Local access; `replicate.default` points at the platform instead of Replicate | In Clipkin credits, charged as each generation is submitted and adjusted to the final cost; no reservation step | Connect it as in [Connect a Clipkin account](#connect-a-clipkin-account); then work as on a self-managed install |
| **Self-managed install** | The user stores their own keys with `clipkin auth login <vendor>.default`; the starter needs only a Replicate token, which covers images, video, voices, word timing and background removal; another vendor's key only once its Endpoint is declared | Directly to Replicate and each other vendor, on that vendor's account | Help choose which vendors to connect, then store, check and route each key |

On a self-managed install, the credit figures in the Run estimate still describe the platform price
policy, but the user's real bill comes from each vendor. Tell them which figure applies to them.

### Choose per capability, not per platform

A Profile can mix services freely: one vendor for video, another for images, local alignment and
hosted speech. Choose each capability on its merits — model quality for the Treatment, accepted
inputs, limits, price, and what is already connected.

The starter Profile declares one model Endpoint, `replicate.default`, which serves every generation
capability below with one Replicate API token (`replicate.api-key`), plus the local Endpoints:

| Endpoint | Package | Serves (capability keys) |
| --- | --- | --- |
| `replicate.default` | `@clipkin/provider-replicate` | Seedance video `@clipkin/seedance@1#seedance-2`, `#seedance-2-fast`, `#seedance-2-mini`; Seedream image `@clipkin/seedream@1#seedream-5-lite`; GPT Image `@clipkin/gpt-image@1#gpt-image-2`; Nano Banana `@clipkin/nano-banana@1#nano-banana-2`, `#nano-banana-pro`; Grok Imagine video `@clipkin/grok-imagine@1#grok-imagine-video`; MiniMax H3 `@clipkin/minimax-h3@1#minimax-h3`; Wan image `@clipkin/wan@1#wan-2.7-image`, `#wan-2.7-image-pro`; PixVerse `@clipkin/pixverse@1#pixverse-v6`; Qwen3 TTS voices `@clipkin/qwen3-speech@1#qwen3-tts-voice-design`, `#qwen3-tts-voice-clone`, `#qwen3-tts-custom-voice`; MiniMax speech `@clipkin/minimax-speech@1#speech-2.8-hd`, `#voice-cloning`, `#speech-02-hd`; BRIA background removal `@clipkin/bria-matting@1#video-remove-background`; hosted word timing `@clipkin/whisperx@1#whisperx-alignment` (Scribe v2; the starter binds alignment here) |

Replicate does not serve Seedance 2.5, PixVerse C1 or Grok Imagine 1.5, and it refuses some inputs
of the models it does serve (see [the refusals below](#inputs-some-providers-refuse-until-the-request-changes)).
The Distribution also ships direct vendor Providers. They are not in the starter; declare one as
`<vendor>.default` instead of, or next to, `replicate.default` when the work needs a model or input
only that vendor serves, or when the user already has that account. Next to Replicate, add a
binding for each capability both offer
([Profile routing](profile.md#connect-model-capability-need-and-endpoint)):

| Endpoint | Package | Serves (capability keys) |
| --- | --- | --- |
| `elevenlabs.default` | `@clipkin/provider-elevenlabs` | Voice Design `@clipkin/elevenlabs-speech@1#eleven_ttv_v3`; hosted word timing `@clipkin/whisperx@1#whisperx-alignment` (Scribe; shared with Replicate, so bind it) |
| `fishaudio.default` | `@clipkin/provider-fishaudio` | `@clipkin/fishaudio-speech@1#voice-design-1`, `#voice-clone` |
| `mimo.default` | `@clipkin/provider-mimo` | `@clipkin/mimo-speech@1#mimo-v2.5-tts-voicedesign`, `#mimo-v2.5-tts-voiceclone` |
| `volcengine.default` | `@clipkin/provider-volcengine` | Portrait matting `@clipkin/volcengine-matting@1#matte-portrait-video` (sources up to 20 minutes) |
| `byteplus.default` | `@clipkin/provider-byteplus` | Seedance video `@clipkin/seedance@1#seedance-2`, `#seedance-2-fast`, `#seedance-2-mini`, `#seedance-2.5`; Seedream image `@clipkin/seedream@1#seedream-5-lite` |
| `openai.default` | `@clipkin/provider-openai` | GPT Image `@clipkin/gpt-image@1#gpt-image-2` |
| `google.default` | `@clipkin/provider-google` | Nano Banana `@clipkin/nano-banana@1#nano-banana-2`, `#nano-banana-pro` |
| `xai.default` | `@clipkin/provider-xai` | Grok Imagine video `@clipkin/grok-imagine@1#grok-imagine-video`, `#grok-imagine-video-1.5-preview` |
| `minimax.default` | `@clipkin/provider-minimax` | MiniMax H3 video `@clipkin/minimax-h3@1#minimax-h3` |
| `alibaba.default` | `@clipkin/provider-alibaba` | Wan image `@clipkin/wan@1#wan-2.7-image`, `#wan-2.7-image-pro` |
| `pixverse.default` | `@clipkin/provider-pixverse` | PixVerse video `@clipkin/pixverse@1#pixverse-v6`, `#pixverse-c1` |

Local Providers need no account: `@clipkin/media-local` (`media.local`), `@clipkin/provider-html-local`
(`html.local`) and `@clipkin/provider-image-opencv-local` (`image.opencv.local`) are in the starter;
`@clipkin/provider-whisperx-local` ships with the Distribution and is added to a Profile when local
alignment is chosen. The GPT Image cleanup step is an image operation served locally, not by OpenAI.

The example projects under the Distribution's `examples/` (podcast, interview, ranking-football)
predate this starter: their Profiles still declare `elevenlabs.default`, `fishaudio.default`,
`mimo.default` and `volcengine.default`, and their Sources speak through `@clipkin/fishaudio-speech`.
Running one as it stands needs the Fish Audio key next to Replicate's (a declared Endpoint no request
uses needs no key); otherwise adapt its voice requests to `@clipkin/qwen3-speech` or
`@clipkin/minimax-speech`, and any cutout to `@clipkin/bria-matting` ([Voice and performance](../playbooks/craft/voice-and-performance.md#give-a-recurring-person-one-accepted-voice)).

### Weigh the routes

| Route | The user supplies | You do |
| --- | --- | --- |
| A shipped Provider (Replicate or a direct vendor) | A vendor account (or nothing, on a hosted workspace) | Store the key, check `plan` support for the requested inputs |
| Another API service | The service's identity, API documentation and secure key access | Reuse a compatible Provider or write a project Provider |
| A deployment the user runs | Its serving API, access, and the compute/account choice | Connect that API; deploy only if deploying is part of the commission |
| Local inference | A capable machine and agreement on the preparation effort | Assess tools, downloads and inference time, then prepare the local Provider |

Carry a suitable existing choice forward. Otherwise compare the remaining setup, capability fit,
hardware, download and inference time, and account costs. Alignment is the usual mixed case: a
ready local WhisperX can be the fastest route, a first-time large-model download often is not, and
hosted Scribe (about $0.22 per audio hour, through the starter's `replicate.default`, or through
`elevenlabs.default` once declared) removes local preparation entirely. Cached weights
shorten local setup but do not make the choice.

Explain consequential choices before a new account connection, heavy preparation or paid work, then
use the settled account, budget and preparation scope without re-asking for every command. Record
the decision in the Brief or continuation notes, and revisit it only when new evidence changes what
is practical. A failing service never authorizes moving the work to another account or billing route.

The Clipkin framework itself is free to use. Vendor accounts bill on their own terms, and an installed
Skill or executable comes with no generation credit. A consumer subscription to a vendor's app does
not necessarily include API access. Explain cost for the work that actually remains;
[Builds](../production/builds.md#work-within-the-agreed-paid-scope) owns estimates and submission.

## Connect a Clipkin account

When the user has a Clipkin account and wants generation billed to it rather than to their own vendor
accounts, their install sends Replicate requests to the platform, which uses its own accounts and
charges the user's credits. The agent and everything local still run on the user's machine.

1. **Get the address.** The user's Clipkin Account page, under Local access, shows the exact
   `replicate.default` block to use. Its shape:

   ```json
   "replicate.default": {
     "use": "@clipkin/provider-replicate",
     "config": {
       "baseUrl": "https://<their Clipkin address>/api/local/v1/vendor/replicate",
       "apiKey": { "store": "local", "key": "clipkin.account" }
     }
   }
   ```

   Replace only that Endpoint in `clipkin.runtime.json` (create the Profile with `clipkin runtime init`
   first if there is none); keep the `local` credential store, the local Endpoints and the bindings.
2. **Store the key.** The user creates a key on that page, then runs `clipkin auth login replicate.default`
   and pastes it into the terminal prompt. Never ask for the key in the conversation or put it in a file.
3. **Check it.** `clipkin doctor --endpoint replicate.default`.

What changes with a Clipkin account:
- **Credits, not vendor bills.** The credit figures in `clipkin pricing` are what the user pays. Each
  generation is charged when it is submitted and adjusted to the final cost; there is no reservation.
  A generation the balance can't cover is refused with a 402 that says so: tell the user to add credits.
- **Only what the platform offers.** Replicate's models (images, video, voices, word timing, background
  removal); another vendor still needs the user's own key. A model the platform has switched off is
  refused with a message naming it; choose another.
- **Voice rights.** Before a voice is cloned from a recording the user supplied, they confirm on their
  Account page (Local access) that it is their voice or that they have permission. The first attempt is
  refused with a message naming the recording; relay it, wait for the user to confirm, then run the
  clone again. Pass recordings as local files: a link to elsewhere can't be confirmed and is refused.
  Never work around a refusal with another file or vendor.
- **A 401** means the key is missing, revoked or mistyped, or the account can't generate right now:
  ask the user to check Local access and to log in again with `clipkin auth login replicate.default`.

## Connect a vendor account on a self-managed install

1. **Locate or create the Profile.** `clipkin paths` shows it; for a new project, `clipkin runtime init`
   writes the starter with `replicate.default` and the local Endpoints already declared.
   For a direct Provider the starter does not declare, or in an older Profile, merge the needed
   `<vendor>.default` entry (the shape is shown in
   [Profile credentials](profile.md#put-secrets-behind-credential-references)) and any binding the
   overlap with Replicate requires.
2. **Store the user's key.** `clipkin auth login <vendor>.default` prompts securely; the user types it
   into the terminal, never into the conversation. `--from <private-file>` imports a file instead.
3. **Check it.** `clipkin auth status <vendor>.default` confirms presence; `clipkin doctor --endpoint <vendor>.default`
   runs bounded diagnostics without generating anything.
4. **Check the Run.** `clipkin plan <run>` shows the Endpoint each request resolves to and any request
   the Provider refuses; `clipkin pricing <run>` reads its rates. None of these submit generation.

### Account and configuration notes per vendor

Read the Provider README before changing `config`; these are the keys and account facts that most
often matter.

| Endpoint | Keys beyond `apiKey` worth knowing | Account facts |
| --- | --- | --- |
| `replicate.default` | `pollIntervalMs` (default 5,000); `defaultConcurrency` and `actionLimits` (default 4) | One API token covers every model it serves; most rates are unverified list figures, corrected with `CLIPKIN_REPLICATE_PRICES` (see [pricing](#price-quote-and-meter-the-work)) |
| `byteplus.default` | `region`: `byteplus` (default, ModelArk international) or `volcengine` (Ark China); `models` overrides a capability's model id, e.g. an `ep-…` endpoint | The two regions have separate accounts, keys and model ids |
| `openai.default` | `organization`, `project` (sent as OpenAI headers) | GPT Image may require API Organization Verification; set `actionLimits.submit.rate` to the account tier |
| `google.default` | `maxRetries` | The key must come from a Google AI Studio project with billing enabled; the free tier lacks these models |
| `xai.default` | — | No regional host serves video |
| `minimax.default` | `region`: `international` (default) or `china`; `referenceTransport`: `upload` (default, MiniMax file API) or `inline` | H3 needs the pay-as-you-go API, not a Video Package; keys are region-bound |
| `alibaba.default` | `region`: `international` (Singapore) or `china` (Beijing); `workspaceId` for the workspace-dedicated domain | Keys only work in their own region (and workspace, when set) |
| `pixverse.default` | — | Concurrency depends on the plan |
| `elevenlabs.default` | `region`: `default`, or `eu`/`in`/`sg` for Enterprise data residency (each needs that workspace's key) | The key needs the Text to Voice and Speech to Text permissions |
| `fishaudio.default` | `ttsModel`: `s2.1-pro` (default) or `s2-pro` | Pay-as-you-go; concurrency grows with prepaid balance |
| `mimo.default` | `retryDelayMs` | Key from the Xiaomi MiMo open platform console |
| `volcengine.default` | `queueId` | An AI MediaKit key or an IAM general API key; AK/SK signing is not used |

Every Provider also accepts its own `baseUrl` (HTTPS or loopback), `defaultConcurrency`,
`actionLimits` and timeout keys; the README lists defaults.

### Inputs some Providers refuse until the request changes

`plan` reports these as unsupported before anything is paid for. Knowing them early lets you author a
request that will run.

**Replicate, the starter's route for every generation model**, refuses these inputs. Each
line names the request that runs instead; the direct Provider is an alternative only once it is
declared and bound:

| Model on Replicate | Refused | Request that runs |
| --- | --- | --- |
| Seedance 2.0 / fast / mini | `1080p` | `720p`, or `4k` once `CLIPKIN_REPLICATE_PRICES` sets `seedance-2.0.second.4k`; or `byteplus.default` for 1080p |
| Seedance 2.0 / fast / mini | Any `person-reference="true"` image or video (frames included) | A reference without a person, or another reference model such as MiniMax H3; BytePlus needs a `publicAssetUrl` hook for person references too (below) |
| Seedance 2.0 / fast / mini | Prompts over 4,000 characters; `web-search` on | A shorter prompt; web search off |
| Seedance 2.5, PixVerse C1, Grok Imagine 1.5 | Not served at all | `byteplus.default`, `pixverse.default` or `xai.default` |
| GPT Image 2 | Any resolution but `1K` (Replicate renders about one megapixel); ratios other than `auto`, `1:1`, `3:2`, `2:3` | `1K` at one of those ratios; Nano Banana 2 or Pro at `2K` or a portrait ratio such as `9:16`; or `openai.default` for GPT Image at 2K, 4K and other ratios |
| Seedream 5 Lite | `quality` `ultra` (4K); moderation off | `basic` (2K) or `high` (3K) |
| Nano Banana 2 | Ratios `1:4`, `4:1`, `1:8`, `8:1` | A listed ratio, or `google.default` |
| Grok Imagine | Any reference images; over 15 s; `1080p` | Prompt-only at 480p or 720p, or `xai.default` for references |
| MiniMax H3 | Prompt-only without an aspect ratio | Set the ratio |
| Wan 2.7 Image / Pro | `watermark` on; 4K with reference images or an image set; more than 4 pictures without an image set; thinking mode with references | Change the request, or `alibaba.default` |
| PixVerse V6 | Reference images and reference videos; prompt-only without a ratio or with `auto` | A first frame instead of references, or `pixverse.default` |
| Word timing (Scribe v2) | A language that is not an explicit two/three-letter code; evidence under 100 ms or over two hours | Name the language code |
| Qwen3 TTS | Empty text; a `language` outside its ten (unknown preset speakers fail at Replicate) | Name a listed language or `auto`; for other languages use MiniMax speech |
| MiniMax voice cloning | A sample that is not MP3, M4A or WAV, is 20 MB or more, or is shorter than 10 s or longer than 5 min | A 10 s to 5 min clean sample (a longer Qwen3 design line, or a cut of the supplied recording) |
| MiniMax speech | Text over 10,000 characters (unknown system voice ids fail at Replicate) | Split the passage |
| BRIA background removal | Sources over 60 s; containers other than MP4, MOV, WebM, AVI | Cut the source into parts of at most 60 s and matte each, or `volcengine.default` (up to 20 minutes) |

References travel through Replicate's files API, so each file is limited to 100 MB, and Replicate
caps Seedance reference videos and audio at 15 s in total. The Provider README has every field.

Across the direct Providers:

- **References that must be reachable by URL.** BytePlus Seedance accepts reference videos only as a
  public URL or `asset://` id, and any visual reference marked `personReference: true` needs an
  authorized portrait asset (`asset://…`); both are refused unless a `publicAssetUrl` hook is
  configured. `publicAssetUrl` is a programmatic
  option of the Provider factories (for example `createOpenAiProvider`, `createMinimaxProvider`),
  supplied by an embedding host; it is not a Profile key. BytePlus alone also takes a Profile key,
  `publicAssetService`, naming a service that publishes files at URLs: a hosted workspace has it when
  its platform can publish reference videos, and person references stay refused there. On a
  Profile-only install, choose a Provider whose README accepts the input by upload, or write a
  project Provider that supplies the hook.
- **Ratio and size rules.** MiniMax H3 and PixVerse need an explicit aspect ratio for prompt-only
  requests; PixVerse allows `auto` only with reference videos. GPT Image allows `auto` only at 1K.
  Wan 2.7 Pro renders 4K only from a prompt alone. Seedance 2.5 frame modes need `adaptive`.
- **Duration and resolution ceilings.** `grok-imagine-video` stops at 15 s and 720p, and with
  reference images at 7 images and 10 s; Grok Imagine 1.5 with references stops at 720p.
- **Sizes and formats.** Each README lists accepted media types and byte limits (for example 30 MB
  images and 15 MB audio inline for BytePlus; 20 MB per inline image for Wan).
- **Behaviour you cannot change.** Seedream moderation cannot be switched off; Nano Banana returns
  its own image encoding whatever output format was requested (with a warning).

## Connect a service the user brings

### Pin down the service and the operation

Start from what the user already said. If something essential is missing, ask for the service name,
its API documentation or base address, and the model or operation they want. Ask for the credential
only once the Endpoint is configured, and through `auth login`, never in chat. A key alone does not
tell you whether the service offers chat, images, reference-driven video, face replacement or
motion control.

You own the API research, any package implementation and the Profile wiring. Explain the remaining
connection work in terms of the result the user wants.

### Decide what actually needs to change

| Situation | Action |
| --- | --- |
| A key for a vendor the Profile already declares | `clipkin auth login <vendor>.default`; nothing else changes |
| A key for a shipped direct Provider the starter does not declare (e.g. BytePlus, OpenAI, ElevenLabs, Fish Audio, MiMo, Volcengine) | Declare `<vendor>.default`, bind each capability it shares with `replicate.default`, then `auth login` |
| A new key for an already configured account | Replace the Store value; keep the Endpoint's reference |
| A second account on the same service | A second Endpoint with the same `use` and a distinct credential key, plus a binding |
| The same protocol at another address or region | The Provider's own `region`, `workspaceId` or `baseUrl` option |
| The Model exists but the API is different | A project Provider for the existing capability |
| The model or operation is not described at all | A project Model and a Provider implementing it |
| An API that needs no credential | Configure the Endpoint as its Provider declares; no auth step |
| Compute but no serving API yet | Establish the chosen deployment before connecting inference |

Matching model names and "OpenAI-compatible" labels do not imply matching upload, reference, task,
result or authentication protocols. Changing `baseUrl` is only valid when the whole protocol matches.
Preserve the authored request: a narrower Provider reports its real support instead of silently
shortening a duration, dropping references or lowering resolution.

### Configure, authorize and route the implementation

Read the Provider's configuration and credential slots; names such as `apiKey` and `baseUrl` belong
to each Provider, not to the Profile. The Distribution's `examples/provider-package` contains image
and video Provider packages. After adapting the video package to the real service and installing it,
its Profile fragment looks like this:

```json
{
  "credentials": {
    "local": { "use": "@clipkin/credential-store-local" }
  },
  "endpoints": {
    "videos.personal": {
      "use": "@example/provider-videos",
      "config": {
        "baseUrl": "https://videos.example",
        "apiKey": { "store": "local", "key": "videos.personal" }
      }
    }
  },
  "bindings": {
    "@clipkin/seedance@1#seedance-2-mini": "videos.personal"
  }
}
```

The address and protocol are placeholders, not a working vendor: substitute the selected service's
real protocol and address and the installed package's name. The binding is needed because the
starter's `replicate.default` also offers this Seedance Mini capability; for another request, copy that
Model's complete capability key. Then:

```bash
clipkin auth login videos.personal
clipkin plan ./production.slate
clipkin pricing ./production.slate
```

The example declares a writable key slot and no browser flow, so `login` prompts securely. The
binding routes only this capability; every other capability keeps its route, and no key travels to
another service. `plan` checks support and cheap readiness, `pricing` reads the service's rates, and
neither proves a paid generation will succeed. Submit within the agreed scope.

## Implement the missing capability in the project

Study the Model's vocabulary and README alongside the service's API documentation. When a compatible
implementation already exists, reuse it; otherwise create `packages/provider-…` inside the production. A project extension uses
only public interfaces and needs no framework release. The repository's
[Models and Providers guide](https://github.com/clipkin-ai/clipkin/blob/main/docs/guide/providers.md) and
`examples/provider-package/README.md` (find it under the Distribution root from `clipkin paths`)
walk through the same path.

Follow one real request through:

1. **Pin the capability.** Identify the exact capability, input roles and result type. New authoring
   meaning needs a new Model; another API for an existing Model belongs in a Provider.
2. **Map every input.** Map text, scalar parameters and every supplied media role and item field to
   the real API. Declare the service's actual limits in `supports`, including what can be judged
   before Build-produced inputs exist. Use an account-visible catalogue when the service has one.
3. **Implement the lifecycle.** Either an immediate call, or `start`, `poll` and `collect`. Record an
   acknowledged task id through `checkpoint` before `start` returns; the Runtime owns scheduling from
   there. Report progress, keep public failure evidence, and never expose credentials or signed URLs.
   Report a transport failure after submission as an unknown outcome rather than retrying it.
4. **Return and price.** Store returned media through `context.resources` and return the declared
   result type. Declare capacity for the real resource. Name the service's price page in `pricing`
   and answer `readPricing` with the rates that apply to this request. A pricing document whose
   `data` follows the `clipkin.rate-quote@1` shape described under
   [pricing](#price-quote-and-meter-the-work) is totalled into the Run estimate; any other document
   is shown as the Provider's own material and the request counts as not yet priced.
5. **Install and route.** Compile, install with the project's package manager, declare the Endpoint
   with its `use`, add bindings, and exercise the requested path within the user's authorization.

Pick `provider-images` or `provider-videos` from the example according to the request shape. The
video package covers image, video and audio references, first and last frames, the required
person-reference classification and a separate collection step. Its mappings, limits and transport
are illustrations to adapt, not a shared API. Implement only what this production needs. `supports`
describes the service's real range without narrowing the shared Model or quietly altering the request.

## Use the public SDK

| Import | What it owns |
| --- | --- |
| `@clipkin/generation/model` | Model ports and Producer/Need construction |
| `@clipkin/generation` | Generated-media values and request-mapping helpers such as `compileWireRequest` |
| `@clipkin/clipkin/endpoint` | `defineEndpoint`, execution, resources, credentials, support, receipts and capacity |
| `@clipkin/runtime-local/extension` | Profile activation, diagnostics and Managed Programs for the local Runtime |
| `@clipkin/clipkin/author`, `/producer`, `/admission`, `/markup` | Author graphs, deterministic Producers, Type admission and Markup Surfaces |

Their READMEs ship with the Distribution and define the exact APIs. Use the installed `@clipkin/clipkin`
release as the extension's development dependency and ship compiled JavaScript with ordinary runtime
dependencies. The example's `workspace:*` development dependencies must be replaced with the
installed release when copied out, as its README explains.
[Component sharing](../production/component-sharing.md) covers later distribution by the owner.

## Use your own model deployment

A serving API the user already operates is connected through a Provider exactly like any vendor. When
they have compute and nothing serving on it yet, follow that platform's current deployment guidance and the model's serving instructions,
and explain persistence, hardware and cost for the actual deployment. Management access and
inference access can be different credentials, and the deployment's lifetime is separate from any
generation job.

Local inference uses the same boundary: a Provider may call a local process, and a Managed Program
declares its preparation and any persistent helper. [Local tools](local-tools.md) explains operating
those declarations. The implementation owns its service protocol.

## Price, quote and meter the work

Every shipped Provider transcribes its vendor's published prices into a **rate card** (the engine's
internal `@clipkin/pricing` package): an id such as `byteplus.seedance` or `replicate.minimax/h3`, the vendor, the source
pricing page, a `ratesAsOf` date and named rates in integer USD micros (millionths of a dollar). Its
`readPricing` answers each planned request with a `clipkin.rate-quote@1` document whose `basis` is:

| Basis | Meaning | Typical cases |
| --- | --- | --- |
| `exact` | All quantities are known | Seedream images, Wan single pictures, Grok Imagine seconds × rate, every Replicate video model (seconds × rate), Qwen3 or MiniMax speech with known text, a MiniMax voice clone, Fish Audio clone with known text |
| `estimate` | A range with stated `assumptions` | Seedance tokens, GPT Image and Nano Banana token counts, a Wan image set, BRIA matting (1 to 60 source seconds) |
| `unknown` | Depends on media produced during the Build; `lowMicros` is a floor | Scribe transcription before the audio exists, speech whose text an upstream step produces, a pending reference video, Volcengine matting (no published USD rate) |

`clipkin pricing <run>` shows these quotes per request group, then a **Run estimate**: vendor cost in
USD, the customer price in USD and credits, the credit hold reserved before the Build, and counts of
priced, local and not-yet-priced requests. `--json` carries the same as an `estimate` object of
format `clipkin.run-estimate@1`. The customer price comes from the platform price policy: by default a
1.5× markup on vendor cost, a $0.01 minimum per paid request, 1 credit = $0.01, and a hold of the high
estimate plus 15%. A hosted deployment sets its own policy through the `CLIPKIN_PRICING_POLICY` file
(`markup`, `agentMarkup`, `minimumPerRequestUsd`, `creditUsd`, `holdBuffer`). Local work is free.

After each request completes, its Provider writes the actual charge to the Build log as a
`clipkin.usage@1` diagnostic, priced from the final request and the vendor's reported usage (tokens,
seconds, characters, or the vendor's own cost figure). `clipkin usage <build-id>` totals vendor cost,
customer price and credits, and marks totals as partial while the Build runs. On a hosted workspace
the credit ledger reserves the hold before the Build, captures the metered charges when it ends and
releases the rest; usage the vendor already billed beyond the hold is still captured. The directing
agent's own model tokens are priced there too, with their own markup.

Know where a quote is weaker than it looks:

- **Unverified Replicate rates** — most Replicate cards are third-party or vendor list figures, not
  read from Replicate, and say so in their first note; only MiniMax H3 and PixVerse V6 were verified.
  `CLIPKIN_REPLICATE_PRICES` (a JSON object of rate name to USD, e.g.
  `{"nano-banana-pro.image.2k": 0.139}`) corrects a rate for every quote and charge. Replicate's GPT
  Image at `3:2`, `2:3` or `auto` is an estimate at an upper bound.
- **Placeholder Replicate rates** — no public price exists for Qwen3 TTS, MiniMax speech or BRIA
  matting on Replicate, so their cards carry conservative placeholders (USD 0.10 per 1,000 characters
  of speech, USD 3.00 per MiniMax clone, USD 0.10 per source second of matting) in billing units the
  Provider chose. Say so when quoting voices or cutouts, and correct them with
  `CLIPKIN_REPLICATE_PRICES` once the real figure is known. On a hosted workspace, BRIA is charged at
  its 60 s bound because the platform cannot see the source length.

- **Foreign-currency regions** — Volcengine Ark (`byteplus` with `region: "volcengine"`) and MiniMax
  `china` bill in CNY, but are quoted from the USD card with an assumption saying so.
- **Vendor credits** — PixVerse bills Credits, converted at the published 225 Credits = USD 1.
- **Promotions** — MiMo speech (when `mimo.default` is declared) is currently quoted at zero as a
  limited-time free offer.
- **Not metered** — Volcengine matting (when `volcengine.default` is declared) reports measured output but cannot be priced without a USD rate.
  Matting accepts sources up to 20 minutes; trim or split a longer source before the Build.
- **Charged anyway** — a Grok Imagine job that ends moderated is still billed and metered.

For requests that are not yet measurable, finish the estimate yourself from the stated unit rate and
an explicit quantity from the production plan, label that figure as your estimate, and tell the user
which account pays, what the work should cost and where uncertainty remains.
[Builds](../production/builds.md#price-the-same-requests) shows the report format;
[the paid scope](../production/builds.md#work-within-the-agreed-paid-scope) governs authorization.
A connected account and a positive balance grant access; only the user's agreement grants spending.

## Diagnose the actual connection

A missing adapter, a rejected key, an unavailable model, an unsupported input and an exhausted quota
need different responses. Keep the Endpoint, the model or operation and the returned status, code
and reason together as evidence. Vendor codes are preserved, for example:

| Code family | Read it as |
| --- | --- |
| `invalid_api_key`, `authorized_error`, `FISHAUDIO_UNAUTHORIZED` | The stored key is wrong, revoked, or from another region or workspace |
| `insufficient_quota`, `insufficient_balance_error`, `FISHAUDIO_PAYMENT_REQUIRED` | The vendor account needs funds or a plan change; the user decides |
| `rate_limit_exceeded`, `RESOURCE_EXHAUSTED`, `rate_limit_error` | Capacity; adjust `actionLimits` or wait, do not switch accounts |
| `moderation_blocked`, `GOOGLE_PROMPT_BLOCKED`, `XAI_VIDEO_MODERATED`, `PIXVERSE_TASK_MODERATION_FAILED` | Content policy; revise the prompt or references |
| `…_SUBMISSION_UNKNOWN` | The submission's fate is unknown and may have been billed; check before any resubmission |
| `…_OPERATION_TIMEOUT` | The remote task outlived `operationTimeoutMs`; the receipt is kept |

A lone `401` or "model not found" does not prove that paying or logging in again will help; read
account-visible service information when availability is in doubt. Each README's "Open questions"
section records what its author could not verify against the vendor, which is often where a
surprising failure comes from.

Pursue a proportionate fix using current API documentation and the installed implementation: a
[release update](distribution.md#check-and-update-the-relevant-installation), a configuration change
or a repair to a project adapter. Report what changed and what you verified; a repaired installation
succeeding is a different fact from the original release behaving well. Framework maintenance follows
the repository's own instructions; this Skill covers production and public package extensions.

When a capability is unavailable, keep independent work moving and say which deliverable is waiting
on it. Keep the user's chosen service and intended result while you close the gap.

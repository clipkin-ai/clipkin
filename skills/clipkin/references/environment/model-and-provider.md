# Choose and connect model services

Come here when the work needs model access, when a request is refused, or when you need to explain
what the work will cost. This page owns the model choice, the Clipkin account connection and pricing.
[Profile](profile.md) owns configuration syntax and routing; [local tools](local-tools.md) owns local
preparation. The Craft pages own what generated or transformed media should look and sound like.

Every generation model runs through the user's Clipkin account and is paid with their credits. There
are no vendor accounts or keys to connect: don't offer them, ask for them or configure them. If the
user asks to use their own model account, explain that Clipkin generates through their Clipkin
account only.

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

| Setting | What is connected | How the user pays | What you do |
| --- | --- | --- | --- |
| **Hosted Clipkin workspace** | Every model, already connected | In credits: `clipkin pricing` shows the price and the hold reserved before each Build | Choose models per capability and agree the spend in credits |
| **The user's own install** | `clipkin.default`, connected to their Clipkin account with one personal key ([below](#connect-a-clipkin-account)) | In credits, charged as each generation is submitted and adjusted to the final cost; no reservation step | Connect the account once, then choose models and agree the spend |

The starter Profile declares one model Endpoint, `clipkin.default`, which serves every generation
capability through the Clipkin account, plus the local Endpoints:

| Endpoint | Package | Serves (capability keys) |
| --- | --- | --- |
| `clipkin.default` | `@clipkin/provider-clipkin` | Seedance video `@clipkin/seedance@1#seedance-2`, `#seedance-2-fast`, `#seedance-2-mini`; Seedream image `@clipkin/seedream@1#seedream-5-lite`; GPT Image `@clipkin/gpt-image@1#gpt-image-2`; Nano Banana `@clipkin/nano-banana@1#nano-banana-2`, `#nano-banana-pro`; Grok Imagine video `@clipkin/grok-imagine@1#grok-imagine-video`; MiniMax H3 `@clipkin/minimax-h3@1#minimax-h3`; Wan image `@clipkin/wan@1#wan-2.7-image`, `#wan-2.7-image-pro`; PixVerse `@clipkin/pixverse@1#pixverse-v6`; Qwen3 TTS voices `@clipkin/qwen3-speech@1#qwen3-tts-voice-design`, `#qwen3-tts-voice-clone`, `#qwen3-tts-custom-voice`; MiniMax speech `@clipkin/minimax-speech@1#speech-2.8-hd`, `#voice-cloning`, `#speech-02-hd`; BRIA background removal `@clipkin/bria-matting@1#video-remove-background`; hosted word timing `@clipkin/whisperx@1#whisperx-alignment` (Scribe v2; the starter binds alignment here) |

Seedance 2.5, PixVerse C1 and Grok Imagine 1.5 are not offered, and some inputs of the models that
are offered are refused (see [the refusals below](#inputs-some-providers-refuse-until-the-request-changes)).
Choose each capability on its merits: model quality for the Treatment, accepted inputs, limits and
price.

Local Providers need no account: `@clipkin/media-local` (`media.local`), `@clipkin/provider-html-local`
(`html.local`) and `@clipkin/provider-image-opencv-local` (`image.opencv.local`) are in the starter;
`@clipkin/provider-whisperx-local` is added to a Profile when local alignment is chosen. Alignment is
the one real route choice: a ready local WhisperX can be the fastest, a first-time large-model download
often is not, and hosted Scribe through the account removes local preparation entirely.

Explain consequential choices before heavy preparation or paid work, then use the settled budget and
preparation scope without re-asking for every command. Record the decision in the Brief or
continuation notes. An installed Skill or executable comes with no generation credit;
[Builds](../production/builds.md#work-within-the-agreed-paid-scope) owns estimates and submission.

## Connect a Clipkin account

On the user's own install, generation goes to Clipkin, which charges the user's credits. The agent and
everything local still run on the user's machine. `clipkin runtime init` writes the Profile with
`clipkin.default` already pointed at Clipkin:

```json
"clipkin.default": {
  "use": "@clipkin/provider-clipkin",
  "config": {
    "apiKey": { "store": "local", "key": "clipkin.account" }
  }
}
```

It only connects to Clipkin. A Profile made by an earlier release names the same connection
`replicate.default` (`@clipkin/provider-replicate`) and keeps working with the same key; to use the
current name, replace that Endpoint with the block above, change any binding that names it, and keep
the local credential store and the local Endpoints. A Profile that points that older Endpoint at
another address fails `doctor` with `RUNTIME_ENDPOINT_CONFIG_INVALID`.

1. **Sign in.** The user runs `clipkin auth login clipkin.default --clipkin https://clipkin.com`: it
   opens their browser at a short code to approve, and stores the key it is given (the tool then shows
   under Authorized apps on their Account page). Or they create a key on their Account page under Local
   access, run `clipkin auth login clipkin.default` and paste it into the terminal prompt. Never ask
   for the key in the conversation or put it in a file.
2. **Check it.** `clipkin doctor --endpoint clipkin.default`.
3. **Check the Run.** `clipkin plan <run>` shows any request that would be refused; `clipkin pricing
   <run>` shows the credits. Neither submits generation.

What to know:
- **Credits.** The credit figures in `clipkin pricing` are what the user pays. Each generation is
  charged when it is submitted and adjusted to the final cost. A generation the balance can't cover is
  refused with a 402 that says so: tell the user to add credits.
- **Only what the platform offers.** A model the platform has switched off is refused with a message
  naming it; choose another.
- **Voices.** Cloning a voice from a recording needs no confirmation. Only clone a voice that is the
  user's own or one they have permission to use, as the Terms require. A recording Clipkin has blocked
  is refused with a message that says so: relay it and never work around it with another file or model.
- **A 401** means the key is missing, revoked, expired or mistyped, or the account can't generate right
  now: ask the user to check Account → API keys and to sign in again.

### Inputs some Providers refuse until the request changes

`plan` reports these as unsupported before anything is paid for. Knowing them early lets you author a
request that will run. Each line names the request that runs instead:

| Model | Refused | Request that runs |
| --- | --- | --- |
| Seedance 2.0 / fast / mini | `1080p` | `720p` |
| Seedance 2.0 / fast / mini | Any `person-reference="true"` image or video (frames included); realistic faces it detects, generated ones included | A reference without a person; for people, MiniMax H3 |
| Seedance 2.0 / fast / mini | Prompts over 4,000 characters; `web-search` on | A shorter prompt; web search off |
| Seedance 2.5, PixVerse C1, Grok Imagine 1.5 | Not offered | Seedance 2.0, PixVerse V6, Grok Imagine |
| GPT Image 2 | Any resolution but `1K` (about one megapixel); ratios other than `auto`, `1:1`, `3:2`, `2:3` | `1K` at one of those ratios; Nano Banana 2 or Pro at `2K` or a portrait ratio such as `9:16` |
| Seedream 5 Lite | `quality` `ultra` (4K); moderation off | `basic` (2K) or `high` (3K) |
| Nano Banana 2 | Ratios `1:4`, `4:1`, `1:8`, `8:1` | A listed ratio |
| Grok Imagine | Any reference images; over 15 s; `1080p` | Prompt-only at 480p or 720p |
| MiniMax H3 | Prompt-only without an aspect ratio | Set the ratio |
| Wan 2.7 Image / Pro | `watermark` on; 4K with reference images or an image set; more than 4 pictures without an image set; thinking mode with references | Change the request |
| PixVerse V6 | Reference images and reference videos; prompt-only without a ratio or with `auto` | A first frame instead of references |
| Word timing (Scribe v2) | A language that is not an explicit two/three-letter code; evidence under 100 ms or over two hours | Name the language code |
| Qwen3 TTS | Empty text; a `language` outside its ten (unknown preset speakers fail) | Name a listed language or `auto`; for other languages use MiniMax speech |
| MiniMax voice cloning | A sample that is not MP3, M4A or WAV, is 20 MB or more, or is shorter than 10 s or longer than 5 min | A 10 s to 5 min clean sample (a longer Qwen3 design line, or a cut of the supplied recording) |
| MiniMax speech | Text over 10,000 characters (unknown system voice ids fail) | Split the passage |
| BRIA background removal | Sources over 60 s; containers other than MP4, MOV, WebM, AVI | Cut the source into parts of at most 60 s and matte each |

Each reference file is limited to 100 MB, and Seedance reference videos and audio to 15 s in total.
Seedream moderation cannot be switched off; Nano Banana returns its own image encoding whatever output
format was requested (with a warning). The Provider README has every field.

## Price, quote and meter the work

Each planned request is quoted with a `basis`:

| Basis | Meaning | Typical cases |
| --- | --- | --- |
| `exact` | All quantities are known | Seedream images, Wan single pictures, video priced by seconds, Qwen3 or MiniMax speech with known text, a MiniMax voice clone |
| `estimate` | A range with stated `assumptions` | Seedance tokens, GPT Image and Nano Banana token counts, a Wan image set, BRIA matting (1 to 60 source seconds) |
| `unknown` | Depends on media produced during the Build; the low figure is a floor | Transcription before the audio exists, speech whose text an upstream step produces, a pending reference video |

`clipkin pricing <run>` shows these quotes per request group, then a **Run estimate**: the price in
credits and counts of priced, local and not-yet-priced requests. `--json` carries the same as an
`estimate` object of format `clipkin.run-estimate@1`. Local work is free. The user's Account page shows
what each request actually charged; a Grok Imagine job that ends moderated is still charged.

For requests that are not yet measurable, finish the estimate yourself from the stated unit rate and
an explicit quantity from the production plan, label that figure as your estimate, and tell the user
what the work should cost and where uncertainty remains.
[Builds](../production/builds.md#price-the-same-requests) shows the report format;
[the paid scope](../production/builds.md#work-within-the-agreed-paid-scope) governs authorization.
A connected account and a positive balance grant access; only the user's agreement grants spending.

## Diagnose the actual connection

A missing adapter, a rejected key, an unavailable model, an unsupported input and an exhausted quota
need different responses. Keep the Endpoint, the model or operation and the returned status, code
and reason together as evidence. Service codes are preserved, for example:

| Code family | Read it as |
| --- | --- |
| `401` | The Clipkin key is wrong, revoked or expired; the user signs in again |
| `402` | The balance can't cover the request; the user decides whether to add credits |
| `429`, `rate_limit_exceeded` | Capacity; wait, or lower `actionLimits` |
| `moderation_blocked`, `E005`, a "sensitive" refusal | Content policy; revise the prompt or references (for a person, MiniMax H3) |
| `…_SUBMISSION_UNKNOWN` | The submission's fate is unknown and may have been billed; check before any resubmission |
| `…_OPERATION_TIMEOUT` | The remote task outlived `operationTimeoutMs`; the receipt is kept |

A lone `401` or "model not found" does not prove that paying or logging in again will help; read
account-visible service information when availability is in doubt. Each README's "Open questions"
section records what its author could not verify against the vendor, which is often where a
surprising failure comes from.

Pursue a proportionate fix using current API documentation and the installed implementation: a
[release update](distribution.md#check-and-update-the-relevant-installation) or a configuration
change. Report what changed and what you verified; a repaired installation
succeeding is a different fact from the original release behaving well. Framework maintenance follows
the repository's own instructions; this Skill covers production.

When a capability is unavailable, keep independent work moving and say which deliverable is waiting
on it. Keep the user's intended result while you close the gap.

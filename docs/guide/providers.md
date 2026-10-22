---
title: Models and Providers
description: How a model request reaches a real service, how to point it somewhere else, and how to add a new model or service.
---

Two kinds of package work together to generate anything:

- **A Model** describes one generation model exactly: what you can send it, which settings it
  accepts, and what comes back. `@clipkin/seedance` is a Model package.
- **A Provider** knows how to send those requests to one real service, such as Replicate, BytePlus or
  your own server. `@clipkin/provider-replicate` is a Provider.

An **Endpoint** is one configured use of a Provider in your [Runtime Profile](./runtime.md): its
address, which key it uses, and how many jobs it runs at once. The Profile decides which Endpoint
handles each kind of request.

A video only ever names Models. Moving it from one service to another changes the Profile, never the
`.reel` file.

## What's included

Every Provider below comes with Clipkin. The starter Profile uses only the first row; the rest are
added to a Profile when a project needs them:

| Provider | Serves | In the starter Profile |
|---|---|---|
| `provider-replicate` | Most models: Seedance 2.0, Seedream, GPT Image, Nano Banana, Grok Imagine, MiniMax H3, Wan, PixVerse V6, Qwen3 TTS, MiniMax speech, BRIA background removal and Scribe word timing | Yes, as `replicate.default` |
| `media-local`, `provider-html-local`, `provider-image-opencv-local` | Media preparation, rendering and image operations on your computer | Yes |
| `provider-whisperx-local` | Word timing on your computer | No |
| BytePlus, OpenAI, Google, xAI, MiniMax, Alibaba, PixVerse, ElevenLabs, Fish Audio, Xiaomi MiMo, Volcengine | Each vendor's own API, including models and options Replicate doesn't offer | No |

[Model and deployment services](./service-partners.md) lists what each one serves.

**A Clipkin account** uses the same Replicate Provider, pointed at Clipkin instead of Replicate, with
your Clipkin key. Generation is then billed to your credits, and only the Replicate models are
covered ([how to connect](../quickstart/run.md#with-a-clipkin-account)).

## Choose the smallest change

| You want to… | Change |
|---|---|
| Use a different key or account | The key the Endpoint refers to. For two accounts side by side, add a second Endpoint and a binding |
| Use another address that speaks the same API | The Endpoint's `baseUrl`. Every vendor Provider and local WhisperX accept one |
| Run a model on your own server | Deploy it, then use a matching Provider or write one for its API (below) |
| Reach the same model through a different API | Install or write a Provider for that API, and point the Profile at it |
| Use a model Clipkin doesn't describe yet | Add a Model package and a Provider that serves it |

The same model can behave differently on different services: other limits, other settings, other
refusals. The Provider checks each request against what its service supports and explains any
mismatch. The Profile picks the route; if a request fails there, Clipkin never quietly retries it
through another account.

To see what a project uses now, run `clipkin paths` and `clipkin auth status <endpoint>`.
[Run Source & Builds](../quickstart/run.md) covers the commands.

## Your own deployment

You can run a model on servers you control and connect it like any hosted service: the Model
describes the request, the Provider speaks your server's API, and the Endpoint holds its address and
key.

If your server speaks an API a Provider already supports, set that Provider's `baseUrl`. Otherwise,
write a small Provider for it in your project's `packages/` folder. If the model itself is new to
Clipkin, add its Model package too.

Setting up a deployment (model files, machines, a serving process) is separate from making videos.
Your agent can help with it using the platform's and model's own documentation. Once it's running,
it receives ordinary requests through its Endpoint. Its compute is billed by your cloud provider, not
by Clipkin.

## Add a Model

A Model package is built with `defineExactModelModule` from `@clipkin/generation/model`, along with
`@clipkin/generation` and Clipkin's `author`, `producer`, `admission` and `markup` entry points. It
declares, for each model variant:

- **an id,** which becomes its capability key, such as `@clipkin/seedance@1#seedance-2-mini`;
- **its inputs:** text, media (with how many of each), choices, numbers and on/off settings, plus
  rules about which combinations are required;
- **what it returns:** an image, a video or audio;
- **optional checks** on inputs and on the complete request.

Its authored element (the Surface) turns a prompt and reference media into that request, and the
result comes back as an ordinary output of the video. `packages/seedance/src/index.ts` is a complete
example to follow. A Model never chooses a service, reads a key or makes a web request; that's the
Provider's job.

## Add a Provider

A Provider is a package whose activation registers an Endpoint factory: it checks the Endpoint's
settings from the Profile and returns `defineEndpoint(…)` from `@clipkin/clipkin/endpoint`. The
activation helpers (`createRuntimeEndpointAdapterFacet` and the `runtimeConfig…` validators) come
from `@clipkin/runtime-local/extension`.

For each capability it offers, a Provider says:

- **whether it supports a request:** `supports(request)` returns supported, or unsupported with a
  reason. Use this when your service accepts less than the Model allows (fewer resolutions, shorter
  durations), so `clipkin plan` refuses with a clear reason instead of failing mid-build;
- **how to run it,** either immediately (the handler returns the result) or as a remote task (below);
- **how much can run at once:** `defaultConcurrency` for the Endpoint, `maxConcurrency` per
  capability, and `actionLimits` for submitting, polling and collecting;
- **its price:** `pricing` points at the service's price page (or says the work is local and free),
  and `readPricing` can return current rates.

Keys are declared as credential references and resolved for you. Errors use `EndpointServiceError`
with a code, and secrets never appear in messages.

`examples/provider-package` holds two complete project Providers to copy: `provider-images`
serves GPT Image and `provider-videos` serves Seedance 2.0 mini, both against an example API. They
show reference uploads, a narrower supported range, checkpoints, a separate download step,
concurrency limits, pricing and redacted errors, and each has tests.

### Remote tasks

Most video services take a job, run it for a while, and let you download the result. A remote-task
Endpoint has three steps:

- **`start`** sends the request and returns `pending` with the service's job id. Call
  `context.checkpoint({ handle })` with that id before returning, so an interrupted build still knows
  which job it started.
- **`poll`** checks the job. It returns `wakeAfter(handle, delayMs)` to check again later,
  `ready` when it's done, or `failed` with the service's error.
- **`collect`** (optional) downloads the result, stores it through `context.resources`, and returns
  `completed` with the Model's declared result. Keeping it separate lets downloads have their own
  concurrency (the `collect` action limit). An Endpoint can also return `completed` straight from
  `poll`.

Inputs that don't exist until an earlier step runs, such as a generated image used as a reference,
are ordinary inputs. When building the service request, `compileWireRequest` from
`@clipkin/generation` takes a resolver that your Provider uses to upload each reference and return its
URL, so only your Provider knows how the service accepts uploads.

A failed attempt ends that build. Results already completed are kept and can be reused in the next
build ([reusing results](../quickstart/run.md#reusing-results)).

## Prices and spending

`clipkin pricing` collects each Provider's rates for the planned requests and estimates the total
before anything runs. Shipped Providers carry their rate tables with them; a project Provider's
`readPricing` is included when it returns Clipkin's rate-quote format. Some costs are only known once
the work runs, such as word timing priced by audio length.

After a build, `clipkin usage <build-id>` totals what the services reported charging.

A price explains the cost; it isn't permission to spend. A stored key or a positive balance doesn't
mean the user agreed to a build. The agent agrees the scope and budget with the user before paid
work. On a Clipkin account, the balance limits what can run.

---
title: Model and deployment services
description: Every service Clipkin can generate through, what each one offers, and how to use your own.
---

Choose the service that supplies the material your video needs. This choice is separate from
[the agent you use](./agents.md), and a project can mix services: one for video, another for voices.

## Three ways to pay

- **A Clipkin account.** No model accounts needed. Generation goes through Clipkin, paid with your
  credits ([how to connect](../quickstart/run.md#with-a-clipkin-account)). It covers the models
  Replicate serves.
- **Replicate.** One Replicate token covers most models. It's what the starter Profile uses.
- **A vendor's own service,** with your own key, for what only that vendor offers.

The starter Profile declares one model service, `replicate.default`, plus the local tools for media
preparation, rendering and image operations, which need no key.

## What each service offers

| Service | Endpoint | Offers |
|---|---|---|
| Replicate | `replicate.default` | Seedance 2.0 (standard, fast, mini), Seedream 5 lite, GPT Image 2, Nano Banana 2 and Pro, Grok Imagine video, MiniMax H3, Wan 2.7 image and Pro, PixVerse V6, Qwen3 TTS (design, clone and preset voices), MiniMax speech and voice cloning, BRIA background removal, Scribe word timing |
| BytePlus or Volcengine Ark | `byteplus.default` | Seedance 2.0 (standard, fast, mini) and 2.5, Seedream 5 lite |
| OpenAI | `openai.default` | GPT Image 2 at 1K, 2K and 4K |
| Google | `google.default` | Nano Banana 2 and Pro |
| xAI | `xai.default` | Grok Imagine video, and the 1.5 preview |
| MiniMax | `minimax.default` | MiniMax H3 video |
| Alibaba Model Studio | `alibaba.default` | Wan 2.7 image and Pro |
| PixVerse | `pixverse.default` | PixVerse V6 and C1 |
| ElevenLabs | `elevenlabs.default` | Voice design (Eleven v3) and Scribe word timing |
| Fish Audio | `fishaudio.default` | Voice design and voice cloning |
| Xiaomi MiMo | `mimo.default` | MiMo v2.5 voice design and cloning |
| Volcengine AI MediaKit | `volcengine.default` | Portrait cutout from video, for sources up to 20 minutes |

On your computer, with no service at all:

| Tool | Endpoint | Offers |
|---|---|---|
| WhisperX | `whisperx.local` | Word timing, instead of Scribe |
| OpenCV | `image.opencv.local` | Image operations |
| Chrome renderer | `html.local` | Rendering the video |
| FFmpeg | `media.local` | Preparing, trimming and mixing media |

To use a vendor, add its Endpoint to the Profile and store its key:

```bash
clipkin auth login byteplus.default
```

Keys are stored as `<vendor>.api-key`. When both Replicate and a vendor offer the same model, a
binding in the Profile says which one to use ([Runtime](./runtime.md)). Each Provider's README lists
its exact models, limits and settings.

**A note on Replicate prices.** The rates shipped with the Replicate Provider are estimates, and only
some are confirmed against Replicate's price pages. Check `clipkin pricing` against Replicate's own
pages before relying on them. Operators can override them with `CLIPKIN_REPLICATE_PRICES`.

## Your own deployment

If you run a model on your own servers, it connects the same way as any hosted service: the Model
describes the request, a Provider speaks your server's API, and an Endpoint holds its address and key.

- **If your server speaks the same API** as one of the services above, use that Provider and set its
  `baseUrl`. BytePlus, MiniMax, Alibaba and ElevenLabs also take a `region`.
- **If it speaks a different API,** write a small Provider for it in your project
  ([Models and Providers](./providers.md#add-a-provider)).

Your cloud account pays for that compute. Clipkin credits don't cover it.

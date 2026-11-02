---
title: Models and Providers
description: How a model request in your video reaches your Clipkin account, and what runs on your computer.
---

Two kinds of package work together to generate anything:

- **A Model** describes one generation model exactly: what you can send it, which settings it
  accepts, and what comes back. `@clipkin/seedance` is a Model package.
- **A Provider** knows how to send those requests somewhere. `@clipkin/provider-clipkin` sends
  them to your Clipkin account; local Providers run tools on your computer.

An **Endpoint** is one configured use of a Provider in your [Runtime Profile](./runtime.md): its
address, which key it uses, and how many jobs it runs at once. The Profile decides which Endpoint
handles each kind of request. A video only ever names Models, never an Endpoint.

## What's included

| Endpoint | Serves |
|---|---|
| `clipkin.default` | Every generation model, through your Clipkin account: Seedance 2.0, Seedream, GPT Image, Nano Banana, Grok Imagine, MiniMax H3, Wan, PixVerse V6, Qwen3 TTS, MiniMax speech, BRIA background removal and word timing |
| `media.local`, `html.local`, `image.opencv.local` | Media preparation, rendering and image operations on your computer |
| WhisperX (optional) | Word timing on your computer, instead of through your account |

`clipkin.default` only connects to Clipkin, with your Clipkin key, and generation is paid with your
credits ([how to connect](../quickstart/run.md#connect-your-clipkin-account)).

Each Provider checks a request against what it supports and explains any mismatch, so `clipkin plan`
refuses with a clear reason instead of failing mid-build. If a request fails, Clipkin never quietly
retries it somewhere else.

To see what a project uses now, run `clipkin paths` and `clipkin auth status clipkin.default`.
[Run Source & Builds](../quickstart/run.md) covers the commands.

## Prices and spending

`clipkin pricing` estimates the credits for the planned requests before anything runs. Some costs
are only known once the work runs, such as word timing priced by audio length. The Account page
shows what was actually charged.

A price explains the cost; it isn't permission to spend. A stored key or a positive balance doesn't
mean the user agreed to a build. The agent agrees the scope and budget with the user before paid
work, and the balance limits what can run.

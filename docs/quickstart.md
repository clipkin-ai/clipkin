---
title: Quickstart for Agent users
description: Install Clipkin in your coding agent, point it at a video you like, and get back an editable video of your own.
---

Clipkin works inside the coding agent you already use, such as Claude Code or Codex. Show it a video
you like and say what should change: your product, your presenter, another language, a new audience.
The agent works out why the original works, writes the script, generates the shots and voices,
and edits them together. You get the finished video and a project you can keep changing.

## What you need

- A coding agent that can use skills, such as Claude Code or Codex.
- A video to start from, or a description of the one you want.
- A Clipkin account with credits, which pays for generation (step 3).

[Use Clipkin in your Agent](./guide/agents.md) covers the agents that work with it.

## 1. Install the Clipkin skill

```bash
npx skills add clipkin-ai/clipkin -g
```

The skill teaches your agent how to make videos. The first time you use it, the agent checks for the
`clipkin` command-line tool and helps you set up anything missing. To install the tool yourself
instead (it needs [Node.js](https://nodejs.org) 22.15 or newer and FFmpeg):

```bash
npm install -g github:clipkin-ai/clipkin
```

To update later, run both commands again, or ask your agent to. See the
[release notes](https://github.com/clipkin-ai/clipkin/releases). The skill and the tool update separately,
and updating doesn't touch your projects.

## 2. Show it a video and say what to change

Open a project folder in your agent and give it the video, plus any photos of your product, logo or
presenter:

```prompt
/clipkin Use ./reference/launch-ad.mp4 as the reference.
Make the same video for Acme Notes (acme.example): keep the fast opening and the top-5 format.
```

The agent studies what makes the original work: its structure, its pacing, and how captions and
graphics land on particular words. Then it adapts the script and look to your goal and explains its
plan as it goes. Everything it decides is saved in the project, so you can pick up later.

## 3. Connect your Clipkin account

Your agent's own subscription covers the agent. Generating video, images and voices runs through
your Clipkin account and is paid with your credits. On your Clipkin [Account page](/account), under
**Local access**, create a key, then ask your agent to connect your Clipkin account. It asks you to
store the key. Paste it into the terminal when asked, never into the chat:

```bash
clipkin auth login clipkin.default
```

Generation is then charged to your credits as each request is made, and the Account page shows what
each key has spent. Your agent, your files and Studio still run on your computer. A presenter made
from a real person's photo uses MiniMax H3, because Seedance refuses photos of people
([details](./quickstart/generation.md#references-that-show-a-person)).

Word timing (needed for captions) runs through your Clipkin account by default. The agent can set up
WhisperX on your computer instead, if you prefer.

## 4. Agree on the cost, then let it work

Before anything is paid for, the agent runs `clipkin pricing` and tells you what it plans to
generate, which models it'll use and what it'll cost in credits. Agree on the scope and budget, and
the agent goes ahead within it. If the plan or budget changes, it asks again.

```prompt
That plan looks good. Go ahead within that budget.
```

While the shots and voices generate, the agent builds the captions and graphics. Every result is
kept in the project, so nothing paid for is lost, and your Account page shows what was charged.

## 5. Watch it and make it yours

Once the real footage is in, the agent checks that captions, graphics and B-roll are clear and land
at the right moments, then hands you the video. It can open [Studio](./quickstart/preview.md) so
you can watch, scrub through the timeline, leave notes and adjust things yourself.

Keep talking to change it or make variations. The agent reuses what's still right and changes only
what needs changing, so you don't pay twice for the same shot. The project stays as ordinary files
you can edit.

More detail: [Making videos with an Agent](./guide/skill.md),
[Run Source & Builds](./quickstart/run.md) and [Studio](./quickstart/preview.md).

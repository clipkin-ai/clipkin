---
title: Making videos with an Agent
description: How the agent reads a reference, plans the new video, makes it and keeps everything editable in your project folder.
---

You give the agent something to start from: a video you like, a written brief, or both, plus any
photos, logos or footage of your own. You tell it what the new video is for. The agent works out why
the reference works, designs the new piece, generates what's missing and edits it together. This page
explains how it goes about that, and what it leaves in your project.

## Install

```bash
npx skills add clipkin-ai/clipkin -g
```

The skill gives the agent the know-how. The `clipkin` command-line tool does the work: checking,
building, rendering and Studio. The agent finds the tool if it's already installed, or helps you set
it up. The skill, the tool and your video projects live in separate places and update separately.
[Use Clipkin in your Agent](./agents.md) covers which agents work with it.

A reference can be a file, or a link to a video site: the agent downloads it into the project with
`clipkin download`, which uses yt-dlp. It's set up once with `clipkin download prepare` (this needs
[uv](https://docs.astral.sh/uv/)), and which sites work depends on yt-dlp and the site.

## How the agent works

### It studies the reference first

The agent looks at the reference as a whole and in detail: why the opening grabs attention, how the
performance carries the message, and what the pictures, captions, graphics and sound each add. To
pin down details, it uses a word-by-word transcript and individual frames: what appears, how it
moves, and which words it answers. It writes down both the overall reading and the specific
observations, so later decisions can point back to them.

### Then it designs the new video

Changing one thing usually changes others. A new presenter or product can mean a different script,
performance, setting or payoff, not just different reference photos. The agent works those
consequences through against your goal. Then it writes the look, the references, pronunciation and
performance direction into the image prompts, the Script and the video prompts before anything is
generated.

While media generates, it builds the captions and graphics. Once the real footage is in, it reviews
the cut as a whole: what draws the eye first, where things sit, how they enter and leave, and whether
the timing lands.

### You stay in charge of what matters

You decide the goal, the facts only you know (prices, claims, names), which accounts to use and how
much to spend. The agent checks what's already set up and explains the options when something is
missing. For example, word timing can run through Replicate or on your computer with WhisperX.

By default every model goes through one connection, Replicate or your Clipkin account
([Quickstart, step 3](../quickstart.md#_3-choose-how-to-pay-for-generation)). Other vendors are added,
with their own keys, only when the work needs them.

Before anything is paid for, the agent shows you the plan and its estimated cost from
`clipkin pricing`, and you agree on scope and budget. Within that, it makes the ordinary creative and
technical decisions itself, tells you what it finds, and comes back to you if the scope or cost needs
to change. Afterwards, `clipkin usage <build-id>` shows what the services actually charged.

## What it leaves in your project

Everything is kept as ordinary files, so the work survives between conversations and you or another
agent can pick it up:

```text
project/
├── references/<name>/     the reference video, a transcript, and notes on how it works
├── productions/<name>/
│   ├── BRIEF.md           what you asked for, your facts and limits, the agreed budget
│   ├── TREATMENT.md       the agent's creative answer to the brief
│   ├── PROGRESS.md        where things stand and what's next
│   ├── authors/           the .reel files: Script, media, components, composition
│   ├── recipes/           the .grade stylesheets
│   └── runs/              the .slate Run files
├── clipkin.runtime.json    which services do which jobs
└── package.json
```

One reference can feed several videos, and one video can draw on several references. Build results,
the generated media and finished videos, are kept in `.clipkin/results/`.

### Custom components

When a video needs something the standard components don't do, such as a new kind of graphic, an
unusual caption style or a scene where several elements move together, the agent writes a component
for the project. It lives with the project. Spoken videos can tie it to moments in the Script; pure
animation can run on its own timeline. A component worth reusing elsewhere can be published as a
package. [Adding an Author Package](./author-packages.md) shows how.

### Revisions don't start over

When you ask for changes, the agent reuses everything that's still right, including usable media
from a build that failed partway, and regenerates only what has to change
([reusing results](../quickstart/run.md#reusing-results)). Edits you make in
[Studio](../quickstart/preview.md) are written back into the same files, and the agent reviews the
finished video against what you asked for.

---
title: Use Clipkin in your Agent
description: The ways to work with Clipkin, from the hosted app to your own coding agent, and what an agent environment needs.
---

Clipkin gives an AI agent the know-how and the tools to make videos. The agent reads and edits your
project, generates material and builds the video. Generation runs through your Clipkin account,
whichever agent you use.

## Two ways to work

**In the Clipkin app.** Sign in on the Clipkin website and describe the video in a chat. Each
conversation gets its own workspace with Clipkin and the agent already set up, model accounts already
connected, and generation paid with your credits. Finished videos are delivered in the chat. Nothing
to install.

**In your own coding agent.** Install the Clipkin skill in Claude Code or Codex on your computer, and
work in a project folder you own. Generation is paid with your Clipkin credits
([Quickstart](../quickstart.md)). This way you also get [Studio](../quickstart/preview.md)
for watching and editing on a timeline.

## Set up your own agent

```bash
npx skills add clipkin-ai/clipkin -g
```

This installs the skill for your agents with the open `skills` command-line tool. `-g` installs it
for every project on your computer; `-p` installs it for one project only.
`npx skills list -g` shows what's installed and `npx skills update clipkin -g` updates it.

The skill teaches the agent how to make videos. It doesn't include the `clipkin` command-line tool:
the agent uses it if it's installed, or installs it the first time you ask for a video. Your projects
are kept separately, so updating either doesn't touch them.

Then open a project folder in the agent and give it a reference video or a description of what you
want. The [Quickstart](../quickstart.md) covers the rest.

## What an agent environment needs

A terminal, a desktop app or a browser tab can all be the way in. What matters is the environment
behind it:

- **Access to your project files,** to read references and write the video project.
- **A place to run the `clipkin` tool,** with FFmpeg, and uv for the local Python tools.
- **A way to show you results:** a file the agent can hand you, or a preview address you can open.

With an agent running on a remote machine, upload or connect your material to that machine, and use
its own way of forwarding previews or delivering files. A `localhost` address there is not a preview
on your computer.

Keep the project somewhere that outlasts the conversation, so the material you paid for and the
project files are still there next time. The agent can tell you where things are saved, open Studio
for timeline editing, and open Review notes for feedback at specific moments. Reviewing a video and
exporting it are separate steps.

## Connecting another agent

Clipkin isn't tied to one agent. Another agent environment can use it if it can:

- make the skill available to the agent;
- give the agent the project files and a way to run commands;
- get previews and finished files back to the person.

The video files, the components and the Providers are the same for every agent. Start from what your
environment actually offers, and make clear to the person where their work is kept and for how long.

For generating material, see [Models and Providers](./providers.md).

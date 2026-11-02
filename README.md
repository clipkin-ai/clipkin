# Clipkin

Make videos with your AI coding agent. Clipkin gives Claude Code, Codex and other agents a Skill
that directs a production (script, generated images, video and voices, captions, motion graphics)
and a `clipkin` tool that builds it, with Studio to review and edit the result on your own computer.

This repository is the installable release: the compiled tool, Studio and the Skill.
Documentation: <https://clipkin.com/docs>.

## Install

You need [Node.js](https://nodejs.org) 22.15 or newer and [FFmpeg](https://ffmpeg.org/download.html)
on your `PATH` (on Linux, also `unzip`, used to set up the browser Clipkin renders with).

```bash
npx skills add clipkin-ai/clipkin -g
```

That installs the Skill for every agent on this computer. The first time you ask your agent for a
video, it installs the `clipkin` tool it works with.

To update, ask your agent to update Clipkin. Release notes are on the
[releases page](https://github.com/clipkin-ai/clipkin/releases).

## Paying for generation

Your agent's own subscription covers the agent. Generating images, video and voices runs through
your [Clipkin account](https://clipkin.com/account) and is paid with its credits: create a **Local
access** key there, then run `clipkin auth login clipkin.default`. The
[Quickstart](https://clipkin.com/docs/quickstart) walks through it.

## Help

Questions and problems: support@clipkin.com.

## License

Proprietary: free to install and use to make your own videos, not to redistribute or resell.
See [LICENSE](LICENSE).

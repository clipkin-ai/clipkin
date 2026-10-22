---
title: Clipkin Studio
description: Open a video project in your browser to watch it, scrub through it, leave timed notes and adjust it by hand.
---

Studio opens your video project in the browser. You can play it, step through it frame by frame,
see every layer on a timeline, change a component's settings, and leave notes pinned to moments.
It shows the video as it will look, before you render or pay for anything.

Studio is part of the `clipkin` tool on your computer, alongside your agent. It works on the files in
your project folder.

## Open your project

```bash
cd /path/to/my-video
clipkin studio --run build.slate
```

Open the address it prints, normally `http://localhost:5179/`. If that port is taken, it picks
another, so read the printed address.

| Option | What it does |
|---|---|
| `--run <file.slate>` | Required. The [Run file](./run.md) whose video to open |
| `--runtime <profile.json>` | Use a different Runtime Profile for this session. Without it, Studio uses the project's selected one (`clipkin runtime use`) |
| `--project <folder>` | The project folder, when Studio can't find it from where you are. `--run` and `--runtime` paths are still read from your current folder |
| `--port <number>` | Ask for a different port than 5179 |
| `--locale-pack <file>` | Add an interface translation (repeatable) |

**What it needs:** the Run must lead to one Film. Anything the picture needs has to exist already:
generated takes from an earlier build, selected in the Run file (see
[reusing results](./run.md#reusing-results)), or things Clipkin can work out on your computer. Local
steps such as preparing media need a Runtime selected (`clipkin runtime use`, or `--runtime`).

**What it never does:** generate anything, call a paid service, or render the final file. Opening
Studio and working in it costs nothing. When something can't be made inside Studio, it names the
missing step instead of making it.

## Find your way around

The top bar has a language menu (English and Simplified Chinese), a light and dark toggle, and two
tabs: **Studio** for working on the video and **Review notes** for feedback.

In **Studio**:

- **The Viewer** in the middle plays the video exactly as the render will look: the same layout,
  motion and timing. Use it to judge caption placement, graphics and framing.
- **The Timeline** below shows every Track as rows of items, plus rows for the Script and for named
  moments. Click an item to jump to it and select it. Play, step a frame at a time, zoom and scroll to
  look closely at a transition.
- **The Inspector** on the right shows what's selected and lets you change its settings. With
  nothing selected it shows facts about the project.
- **The library** on the left has three tabs:
  - **Source**: the Run file, the `.reel` files and stylesheets. Files open read-only. Press
    **Change source** to edit them.
  - **Tasks**: your builds, whether finished, failed or cancelled, plus ones in progress when a
    Runtime is selected.
  - **Outputs**: the images, videos and audio your builds produced. Opening one only shows it; to use
    it in the video, select it in the Run file.

## Leave notes

**Review notes** (also at the printed address ending `#comments`) shows a larger picture with a
column of notes beside it. Click the picture to play or pause, then write a note: it's pinned to that
exact moment. Clicking a note jumps back to its moment.

- **Notes are saved** in `FEEDBACK.json` in your project folder, so your agent can read them. You can
  edit, resolve, reopen and delete them.
- **Your agent isn't told automatically.** When you've finished, ask it to work through the notes.
- **They're listed in time order,** and numbered in the order you wrote them.

## Make changes

There are two ways to edit in Studio:

- **In the Inspector and on the Timeline.** Change a setting or drag an item's edge, and Studio writes
  the change into the right file (the `.reel`, including its Script, or a `.grade` stylesheet) and
  updates the video. Moving a Script Selection or Moment edits the Script, and everything that uses
  that mark moves with it. Changing a shared stylesheet Recipe
  changes every item that uses it. If the change doesn't work, Studio puts the files back as they were
  and shows the error.
- **In the Source tab.** Edit the file text directly. It saves about half a second after you stop
  typing (or press Ctrl/Cmd+S). If the result has an error, the file is still saved and Studio shows
  the error, so fix it there or undo.

What you can change in the Inspector depends on each component: it shows the settings its makers made
editable.

Studio notices when files change on disk, for example when your agent edits them, and reloads.
If a file changed after you started an edit, Studio refuses the stale edit rather than overwrite the
newer version. Restart Studio after installing or changing packages or component code, switching
Runtime, or adding imports of new packages: refreshing the browser doesn't reload those.

## Sound and the finished video

The Viewer plays the Film's sound Tracks: voices, music and effects. Scrubbing is silent.

Studio doesn't make the final file. When the video's ready, build it and download the result
(both covered in [Run Source & Builds](./run.md)):

```bash
clipkin build build.slate --follow
```

To save still frames without building, point `clipkin snapshot` at Studio's address. It needs a
Runtime selected. Frames count from 0:

```bash
clipkin snapshot --studio http://localhost:5179/ --at-frame 0,90,180 --to ./stills
```

## For component makers

A component chooses what Studio shows and allows for its items through a companion description.
See [Studio Companions](../guide/studio-companion-architecture.md) and
[Timing edits in Studio](../guide/studio-temporal-windows.md).

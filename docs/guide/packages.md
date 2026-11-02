---
title: Packages and Extension
description: How components, models and services arrive as packages, how a project picks them, and how to make and share your own.
---

Everything Clipkin can do comes from a package: each caption style, each model, each connection to a
service. A video asks for what it needs, and packages supply it. So adding a new kind of graphic, a
new model or a new service never means changing Clipkin itself. You install or write a package, and
the project uses it.

## The kinds of package

| Kind | What it does | Chosen in |
|---|---|---|
| Component | Turns what you write in a video into graphics, timing or requests for media. Captions, ranking boards and Tracks are components | The `.reel` file's `<import>` lines |
| Model | Describes one generation model: what you can ask it for and what it returns. Seedance, MiniMax H3, Qwen3 TTS | The `.reel` file's `<import>` lines |
| Provider | Sends a model's requests to a real service or a tool on your computer. Your Clipkin account, the local renderer | The [Runtime Profile](../quickstart/run.md#the-runtime-profile) |
| Credential store | Looks up the keys a Provider needs | The Runtime Profile |
| Results store | Keeps each build's record and files | The Runtime; on your computer, in `.clipkin/results/` |
| Distribution | The `clipkin` tool itself, plus the standard set of packages | The installed `@clipkin/clipkin` release |

The split between model and Provider is what lets one video run anywhere. `seedance:ReferenceVideo`
says *what* is wanted. Which Endpoint delivers it is decided by the Profile, without touching the video. In the same way, a ranking component says how its board
behaves, and the renderer draws it. Every piece connects through named inputs and outputs, so
nothing is hidden.

## What comes with Clipkin, and what you add

The Distribution brings the standard set: Script, captions, Tracks, the Film and renderer, media
preparation, image operations, the Seedance and other model packages, the Replicate Provider and the
local tools. Some packages are installed separately into the video project when a video needs them,
such as ranking boards (`@clipkin/ranking`), card decks (`@clipkin/depth-stack`) and comment
stickers (`@clipkin/comment-sticker`).

A `.reel` file names a package by its address and interface version:

```reel
<import as="board" from="@your-studio/scoreboard@1"/>
```

The `@1` is the version of the component's *interface*: what you can write. The installed package
version (`1.4.2`, say) is the implementation, chosen by your package manager and fixed by your
lockfile like any other dependency. A build always uses what's installed, and a missing package is
reported with what to install.

The skill, the `clipkin` tool and each video project are installed and updated separately. Each
package's own dependencies are installed with whatever owns it: the Distribution's with the
Distribution, and a project component's with the project. `clipkin runtime up` prepares the programs
the Profile's Providers run, such as the browser or Python tools. It doesn't install packages.

## Components belong to the video

A component groups whatever moves and lays out together. A plain clip or picture doesn't need one:
a Visual Track shows it. But a scene where a video window, labels and a diagram move as one unit is
a component, while captions and other overlays stay separate layers.

In a spoken video, components take their timing from the Script: its Selections and Moments become
Windows and Instants ([Timing & Assembly](../quickstart/timing.md#_4-turn-script-marks-into-times)).
An animation can use times in seconds or frames instead. [Film & Rendering](../quickstart/composition.md)
shows how the pieces come together.

A new component starts life in the video project's `packages/` folder, under your own package scope,
and the project lists it as a dependency like any other. To reuse it in other projects, publish it as
a versioned package to npm or a private registry. Each project then installs the version it wants,
pinned by its own lockfile.

## Build your own

An extension is an ordinary npm package:

- **Depend on `@clipkin/clipkin`** as a development dependency and a peer dependency, so it builds
  against the same release that will load it.
- **Use the narrow public entry points** it needs: for example `@clipkin/clipkin/author` for
  components, `@clipkin/clipkin/producer` and `@clipkin/clipkin/admission` for producing results, and
  `@clipkin/clipkin/markup` for the authoring language.
- **Compile it to JavaScript** and ship its code, assets and a README.
- **Name its activation entry** in `package.json` under `"clipkin": { "activation": "…" }`. That entry
  tells Clipkin what the package provides, and Clipkin supplies its own APIs when it loads it.

Where to go next:

- [Adding an Author Package](./author-packages.md) starts from a working example component.
- [Component Anatomy](./component-anatomy.md) explains the parts of a component.
- [Models and Providers](./providers.md) covers how generation reaches your Clipkin account.
- [Runtime](./runtime.md) covers Profiles and how Providers are configured.

Each package's README documents its exact types and usage, and the installed package carries its
own type definitions.

---
title: Adding an Author Package
description: Make a new component for your video from the included example, give it a good interface, check it, and share it.
---

A component is worth making when a scene has its own behavior: things that stay together, change
together and react to the same moments. A plain clip shown on screen doesn't need one; a Visual Track
handles it. But a video window that slides aside as a diagram builds up next to it is one scene, and
one component, while the captions over it stay a separate layer.

Your agent often writes components like this while making a video. This page shows how it's done.

## Start from the example

Clipkin includes a small, complete component to copy:
`examples/minimal-author-package/packages/example-component`. It ships with the Distribution, so
it's in your installed copy of Clipkin.

1. **Copy the folder** into your video project's `packages/` folder.
2. **Rename it:** give the package your own scope and name in `package.json`
   (`@your-studio/scoreboard`), and the component's Module the same.
3. **Replace the `workspace:` versions** with released ones. They only work inside Clipkin's own
   source tree. Then build it:

```bash
npm install --save-dev @clipkin/clipkin@<release>
npm install @clipkin/composition@<version> @clipkin/media@<version> @clipkin/spatial@<version> \
  @clipkin/temporal@<version> @clipkin/timeline@<version>
npm run build
```

Use the release of `@clipkin/clipkin` your project runs, and the matching versions of the others. If
your Clipkin came as a tarball, install from its path.

The example has everything a component needs: the TypeScript build setup, the Manifest, the
Surface, the Fragment, the Producers, the activation entry and a small preview video. Its README
walks through each file. Add the package to your project as a workspace package or a local
dependency, whichever your package manager supports.

## Design what authors can change

The interface is the part other people use, so decide it first. Expose the choices someone making a
different video would want: the content, the pictures, where it sits, how it looks, and the moments
that drive it.

- **Take timing as Windows and Instants.** "When the scene is on" and "when the next item appears"
  should be inputs. The video can produce them from the Script
  ([Timing & Assembly](../quickstart/timing.md#_4-turn-script-marks-into-times)) or from plain times
  on a timeline, and your component works the same either way.
- **Take video as prepared media.** For footage, accept the normalized media, the Window it plays in
  and any change to its timing as separate inputs. A raw video file doesn't say which frames to show
  when.
- **Name outputs clearly.** A style-like element publishes its value under its own id (so it's used
  as `style={board-style}`). Other outputs get suffixes that say what they are: `.visual`, `.audio`,
  `.schedule`.

Write the names and accepted values into the component's vocabulary and its README.

The `examples/semantic-composition` project has two components worth reading. In
`responsive-explainer`, a continuously playing video moves from full screen to a side portrait while
other content appears. `chat-scene` animates a chat conversation and accepts its moments from either
plain times or the Script.

## Build and check the scene

A component imports only the public entry points it needs: `@clipkin/clipkin/author`, `producer`,
`admission` and `markup`, plus the packages for the values it uses, such as `@clipkin/composition`
and `@clipkin/temporal`. [Component Anatomy](./component-anatomy.md) explains how the Manifest,
Surface, Fragment and Producers fit together.

Keep the content (the copy, the pictures) as inputs. Draw the component's own panels, frames and
decoration in its code.

**The preview video** is a small example anyone can open or render. Make it show what matters about
the behavior: how it enters, the meaningful changes, how it holds, and how it leaves. Then check the
component in a real video too, where its content, size and timing have a purpose.

**For editing in Studio,** add a Studio Companion. It tells Studio which timeline items and controls
the component offers. It lives in the same package, next to the rendering code.
[Studio Companions](./studio-companion-architecture.md) explains how.

## Use it and share it

Import it in a video by its Module address:

```reel
<import as="board" from="@your-studio/scoreboard@1"/>
```

`clipkin vocabulary @your-studio/scoreboard` shows the interface it offers, and `clipkin check`
confirms a video uses it correctly. Give the README a copyable example, the outputs, the creative
choices that matter, and a picture of the result.

While it serves one project, the package stays in that project's `packages/` folder. To share it:

1. Choose a release version.
2. Build it, and run `npm pack` to make a tarball, or publish it under your scope to npm or a private
   registry. Remove `"private": true` before publishing, and fill in the usual package details.
3. Other projects install the version they want and commit their lockfile.

Nobody needs a copy of Clipkin's source code, or a change to Clipkin, to use your component.

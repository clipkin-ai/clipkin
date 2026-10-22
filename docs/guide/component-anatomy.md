---
title: Component Anatomy
description: The parts a component is made of, how they work together, and how to shape one that other people can use.
---

A component takes an idea someone writes in a video and makes it happen. For a ranking board, the
idea is something like "bring in each contender on its own row, then move its picture to its final
place." The component's inputs describe that: the entries, their ranks, the moments they appear.
Its code does the drawing and the motion.

[Adding an Author Package](./author-packages.md) starts you from a working example. The
`@clipkin/ranking` package is a fuller one to study, with timing from the Script, state that
carries across frames, and Studio editing.

## The parts

| Part | Its job | In the example |
|---|---|---|
| Manifest and Types | Declares what the package provides: its value types, its Producers, and their inputs and outputs | `manifest.ts` |
| Surface | Reads the element someone wrote in a `.reel` file and resolves its references | `surface.ts`, `temporal.ts` |
| Fragment | Describes the steps that turn those inputs into outputs, and how they connect | `fragment.ts` |
| Producer | Does each step's actual work | `component.ts` |
| Values and styles | Checks inputs, fills in documented defaults, and reads the stylesheet Recipe | `style.ts` |
| Scheduling and drawing | Works out what happens when, and draws each frame | `render.ts`, `schedule.ts` in Ranking |
| Activation | Tells Clipkin what the package contributes | `activation.ts` |
| Studio Companion | Tells Studio which timeline items and controls to show | `studio.ts` in Ranking |

How you split these into files is up to you. A small component can keep several parts in one file.
A bigger one is easier to work on with scheduling, styling and drawing kept apart.

The activation entry brings the parts together. In the example it registers the Manifest and three
contributions: the Producers, the checks Clipkin runs on their inputs (admission), and the Surfaces
that read the authored elements.

## Shape the inputs around what changes

**Timing comes in as Windows and Instants.** In a spoken video, the Script's Selections and Moments
become times on the timeline once the voice exists, and the component receives those. In an
animation, plain times on a timeline produce the same kinds of value. Either way the component
works unchanged. Durations that belong to the component itself, such as how long a transition
takes (`12f`), can still be its own settings.

**Picture, position and time are separate inputs.** Prepared media says what can be shown. A Window
says when it's on screen. A separate timing relation says which part of a moving source plays. A
Frame says where the scene sits, and inside it the component can arrange video, text, masks and
graphics however it likes. Group what moves together in one component, and leave independent
things as their own Tracks with their own stacking.

**Captions don't need starting from scratch.** The Script already produces a caption document,
word timing and per-speaker style choices. A new caption style can read those same inputs and draw
them differently, like the Fine caption style does.

## Make it useful to someone else

- **Name inputs after the creative decision:** the reveal moment, the content, the placement, the
  look. Not after how the code uses them.
- **Document every default,** and what changing it does.
- **Read styles from Recipes.** A style decoder receives the stylesheet Recipe as
  `{ path, properties }`, plus the exact fonts passed to it. Authors then refer to the style by its
  id.
- **Keep the video's own copy and media as inputs.** The component draws its own structure: panels,
  frames, decoration. It can ship reusable assets of its own, such as icons or fonts.
- **Make the preview show what matters,** including how it copes with different content and a moved
  moment.

The README and vocabulary should tell an author enough to choose the component and use it. A Studio
Companion can add editing handles for settings with a clear meaning. New visual behavior belongs in
the component. Calling an outside service belongs in a Provider
([Models and Providers](./providers.md)).

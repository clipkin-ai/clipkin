---
title: Studio Companions
description: Give your component useful items on Studio's timeline and controls in its Inspector.
---

A component draws the video. Its **Studio Companion** explains the component to
[Studio](../quickstart/preview.md): what appears on the timeline, what the labels mean, and which
settings can be edited. This lets your component offer real editing controls while its drawing
code stays its own business.

## Ship it with the component

A Companion is part of the same package as the component, added to the same activation entry (the
module named by `"clipkin": { "activation": … }` in `package.json`). All of Clipkin's own components
work this way: the ranking board, captions, Tracks, the Film and the Script each carry their own.

```ts
import { createStudioTrackCompanionFacet } from "@clipkin/studio-companion";

export const clipkinPackage = {
  format: "clipkin.package@1",
  modules: [{ manifest: scoreboardManifest }],
  facets: [
    // …the component's producer, admission and markup facets…
    createStudioTrackCompanionFacet(scoreboardCompanions),
  ],
};
export default clipkinPackage;
```

Keep the component's facets in that list. A package that registers only a Companion has no
component. The package depends on `@clipkin/studio-companion` and `@clipkin/clipkin` as peer
dependencies. Many packages also export their Companion as `./studio`, but that's only for tests and
direct imports; Studio finds Companions through the activation entry.

Studio loads the Companions of the packages the current Run uses when it starts. Restart Studio after
changing the package's code, activation or installed version.

## Describe what authors see

A **Track Companion** matches the component's output and its authored element, and describes:

- **Timeline items,** with a label, icon, color, a preview picture, and the lane they sit in;
- **Attached items:** smaller rows under the main one, such as each reveal of a ranking board;
- **Inspector fields** for the item's settings, grouped into pages and sections;
- **Bindings:** which authored value each field reads and writes.

Expose what an author would change, such as the look, the content, the placement and the timing of
events, not every internal drawing value.

Studio supplies the controls. A field picks one: `text`, `number`, `boolean`, `select`, `color`,
`list` or `record`.

Other kinds of Companion cover other parts of the editor:

| Companion | Describes |
|---|---|
| Track | A component's timeline items and Inspector fields |
| Parameter | A setting shared by several items, such as a style |
| Film | The Film's timeline and Tracks |
| Temporal domain | Rows that show how a take's own time maps onto the timeline |
| Temporal declaration | Read-only rows for named Instants |
| Temporal relation | How a step's timing traces back to what the author wrote, and how an edit changes it |

Rules that belong to a whole Track, not one item, go in the Inspector rather than on the timeline.
Caption `Use` rules, for example, can be edited there without becoming draggable items.

`packages/ranking/src/studio.ts` is a complete Track Companion to learn from, including attached
reveal rows and an Inspector with item fields.

## Make edits mean something

Dragging on the timeline follows the timing the author declared. Studio works backwards through the
build's steps to find what the author wrote, and changes exactly those values together. If something
shared changes, everything that uses it follows after the rebuild. A value that has no single clear
place to write it back can be looked at but not edited.

Inspector fields change the authored values they're bound to. Changing a shared Recipe or Frame can
affect several items, so the field represents that shared decision. Studio writes the change into the
right file, rebuilds the same Run, and if the change doesn't build, or the item doesn't land where it
was dragged, puts the files back as they were and shows the error.

[Timing edits in Studio](./studio-temporal-windows.md) explains how timing edits find what to change.

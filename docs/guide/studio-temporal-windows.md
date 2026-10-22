---
title: Timing edits in Studio
description: What changes in your files when you drag or trim something on Studio's timeline, and what can't be dragged.
---

Components only receive finished times: a Window in `during={…}` or an Instant in `at={…}`. They
don't accept times written in seconds or frames. So when you drag an item in Studio, Studio doesn't
ask the component anything. It follows the item's time back to where the author declared it, and
edits that declaration.

## Timeline declarations

Windows and Instants are declared inside `<time:Timeline>`, or on their own with
`<time:Window timeline=…>` and `<time:Instant timeline=…>`. A Window is written with two of `from`,
`until` and `for`. Here's what each gesture changes:

| Declared as | Moving it changes | Trimming it changes |
|---|---|---|
| `from="2s" for="8f"` | `from`; the length stays 8 frames | Start: `from` and `for`. End: `for` |
| `until="3s" for="8f"` | `until`; the length stays 8 frames | Start: `for`. End: `until` and `for` |
| `from="1s" until="3s"` | Both, by the same amount | The edge you drag |
| `from="claim"` (another named point) | That named point's declaration | The value that edge comes from |
| A component's `during={window}` | The declaration of `window` | The declaration of `window` |

An Instant can only be moved, and `at={claim}` on a component follows back to where `claim` is
declared in the same way. Each drag is solved as one change: trimming the start keeps the end where
it was, trimming the end keeps the start, and moving keeps the length.

### What gets written

Studio writes each changed value in frames. If you move a Window declared `from="10f" for="2s"`, it
becomes `from="15f" for="20f"` at 30 frames per second. Values Studio doesn't need to touch keep
their original form, and new values always land on whole frames.

### What can't be dragged

Some times have no single clear place to write a change, so Studio shows them but refuses the drag
with an error:

- **`earliest(…)` and `latest(…)`:** changing them would mean choosing one branch for you.
- **Lengths taken from a take,** such as `for={voice.extent}`: the length is the take's, not a
  number you wrote.
- **The start of the timeline.**
- **A drag with more than one possible answer.**

## Times from the Script

In a spoken video, a component's Windows and Instants usually come from the Script, through a
projection ([Timing & Assembly](../quickstart/timing.md#_4-turn-script-marks-into-times)):

```reel
<semantic:Projection id="story-time" narrative={story} timeline={speech.timeline}>
  <semantic:Map alignment={opening-words.alignment} domain={opening-media.domain}
    window={speech.opening}/>
</semantic:Projection>
<semantic:Window id="proof" projection={story-time} during={story.selection.proof}/>
<semantic:Instant id="reveal" projection={story-time} at={story.moment.reveal}/>

<visual:Clip during={proof} … />
<deck:Card at={reveal} … />
```

Dragging the clip or the card moves the **Selection or Moment marker in the Script**:
`@{proof}…@{/proof}` or `@{reveal!}`. Markers snap to the start or end of a word or Segment, because
those are the points the voice actually has. After the rebuild, everything that uses `proof` or
`reveal` follows. The `semantic:` declarations themselves aren't changed.

Only Selections and Moments can be moved this way. Segments and word timing come from the recording
and are read-only, and a Selection's end can't be dragged before its start. If a move would change
the Script's words or lose a marker, Studio refuses it.

## When an edit fails

Before writing, Studio checks that the file still says what it expects. If your agent or an editor
changed it in the meantime, the edit is refused rather than overwriting the newer version. After
writing, Studio rebuilds the Run and checks that the item landed exactly where you dragged it. If not,
it puts the files back and shows why.

[Studio](../quickstart/preview.md) covers the editor itself, and
[Studio Companions](./studio-companion-architecture.md) explains how a component offers its own items
and controls.

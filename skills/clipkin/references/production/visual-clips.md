# Place pictures through Visual Track

Use this page when an image, a normalized video or a compositable Surface has to show up in the
finished picture. Neighbouring owners: [media preparation](media.md) for source facts,
[spatial layout](spatial.md) for destination Frames, and [timing](timing.md) for absolute and
projected time.

## Place one ordinary Clip occurrence

The model is small:

```text
Visual Clip  = one picture source + absolute Window + Frame
             + z + spatial mapping + source-time + optional treatment + optional Motion
Visual Track = a set of Visual Clips on one completed Timeline
```

```reel
<import as="visual" from="@clipkin/visual-track@1"/>

<visual:Motion id="photo-push">
  <visual:Pose at="start" scale="1.08" easing="ease-out"/>
  <visual:Pose at="end" scale="1"/>
</visual:Motion>

<visual:Track id="picture" timeline={program.timeline}>
  <visual:Clip id="speaker" media={speaker-media.media}
    during={program.speaker} frame={layout.full} z="10" fit="cover"/>
  <visual:Clip id="photo" image={product} extent={product-extent}
    during={example} frame={layout.detail} z="20" fit="contain"
    treatment={look.visual.still} motion={photo-push}/>
</visual:Track>
```

A-roll, a B-roll insert, a generated shot and an imported graphic are all the same kind of
occurrence. Even if a source earlier contributed Timeline length or semantic evidence, the Clip is
what decides, explicitly, that it becomes visible.

Each Clip names exactly one source form:

| Attribute | Use it for | Notes |
| --- | --- | --- |
| `image` + `extent` | a still | `extent` is required here and refused for the other forms; its width-to-height ratio must be the picture's |
| `media` | timed picture | normalized `SynchronizedMedia` |
| `surface` | compositable pixels | a typed, alpha-aware still or timed Surface |

For a generated still whose exact pixel size you cannot know while writing the Source, give `extent`
the aspect ratio you asked the generator for; `fit` only needs the shape.

`during` takes a Window that is already resolved, including the whole `timeline.window`. Any direct
clock range must first exist as a named Timeline child or a standalone `time:Window`.

Fit and alignment attributes derive the source-to-picture `SpatialMap2D`. When the production already
owns the exact relation, pass an authored `space:Map` through `mapping` instead (it excludes every fit
attribute). An authored `space:Path` passed as `clip={path}` replaces the rectangular treatment clip.
The Clip Frame stays the boundary for treatment and clipping;
[spatial layout](spatial.md#map-a-source-plane-and-treat-its-frame) explains how the pieces relate.

## Keep destination time and source sampling distinct

The Window says *when* the occurrence contributes. Which source frame appears at each moment is a
separate question.

- **No Map:** bounded native playback from the start of the source. If the source runs out before the
  Window ends, the rest of the Window shows nothing from this Clip. There is no implicit hold, loop
  or stretch.
- **`visual:Map` children:** write another relation. Target bounds (`target-from`, `target-until`)
  select Clip-local time; source bounds (`source-from`, `source-until`) select source frames; a pair
  of anchors (`target-at`, `source-at`) plus an exact `rate` ties the two clocks together.
  `wrap-from`/`wrap-until` repeat a source interval periodically.
- **Several Maps** that do not overlap form one piecewise relation; target frames none of them cover
  stay transparent.
- **`rate="0"`** holds a frame; a **negative rate** plays backwards.
- **A fit Map** (source and target bounds, but no rate, anchors or wrap) stretches the chosen source
  interval across its target interval.

This ends the shot on its own last frame, however long the Window is:

```reel
<visual:Clip media={shot.media} during={story.outro} frame={layout.full} z="10">
  <visual:Map target-at="end" source-at="end" rate="1"/>
</visual:Clip>
```

A reusable relation can be declared once as `visual:SourceTime` and passed with `source-time`.
Stills have no source clock, so they refuse Map. Keep the two "map" ideas apart: `space:Map` answers
*where* source pixels land; `visual:Map` answers *which* source frame is sampled.

Give Clips distinct `z` values whenever their relative paint order matters. Equal `z` is allowed and
falls back to stable declaration and identity order. Three kinds of movement are available and
distinct: Map changes the source frame, `Sampling` moves the picture inside the Frame, and `Pose` (or
`motion`) moves the whole framed occurrence.

## Put shared behavior in a component

A continuing presenter, a crossfade, a slideshow or a coordinated reveal is behavior that spans
several occurrences. Visual Track deliberately has no generic sequence or handoff element. Build
that relationship as a project or reusable component; it can use Visual Track's builders internally
and must publish a `VisualTrack` for Film.

Such components may define their own local vocabulary for their content. Caption, for instance, uses
a persistent document and timed Uses; a presenter component might expose its own roles and
treatments. None of that is required of an ordinary Clip.

Film consumes a Visual Track's `.visual` port; declared tooling such as Studio reads `.program`. It
emits picture only, never sound, even from synchronized media; author the sound separately through
[Audio Track](audio-clips.md). [Track authoring](track-authoring.md) shows how a component publishes
its visual contribution.

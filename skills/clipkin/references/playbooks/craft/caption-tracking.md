# Caption above a moving head

Use this page only when the user's reference clearly shows captions riding along with a speaker's
moving head, or the user explicitly asks for that look. Otherwise Caption takes its position from the
family's layout and Style; a visible face is not, by itself, a reason to measure head boxes. The
measured or hand-authored regions described here answer one narrow question: where in the final picture
should this particular speaker's words sit, frame by frame?

## Resolve who, where and when

Three separate sources settle three separate questions:

| Question | Settled by | Not settled by |
| --- | --- | --- |
| Who says this Cue? | The Script Role | A detector's face-track id |
| Where does the Cue follow them? | The intended view of that person in the final composition | Whichever face is largest or first |
| When does it show? | The speech and the directed Caption treatment | Whether the face is still on screen |

In normal turn-taking, a speaker's Caption hands off when the next speaker begins. Their face staying
in shot is no reason to leave their old words up.

Measure from whichever picture lets you map these relationships accurately:

- **A supplied or prepared clip** gives positions in that clip's own coordinates and clock. They must
  then be transformed by how the clip is placed, played back and cropped, and by any moving view.
- **A composed view** (the rendered program) already includes camera framing and program time, as long
  as no graphics cover the person you are measuring. If they do, render a clean picture pass from the
  same normalized media and measure that.

Keep track of how the measured source relates to its use. Trimming or retiming changes what a source
timestamp means; cropping or reframing moves a face box. If a presenter shrinks into an inset, the
positions have to follow that real transformation. When one person is visible in several views at
once, decide which view the Caption should track. Fine takes at most a single region for each Role on
each frame, so several simultaneous text placements need an explicitly authored presentation instead.

Leave space for the entire Cue and any nearby graphics. Even a perfectly measured head can be a poor
spot for a long phrase; in that stretch the work may be better served by ordinary Caption placement.

## Read face observations

The proven workflow used Google Video Intelligence (GVI). Request `FACE_DETECTION` with
`includeBoundingBoxes` turned on to get bounding boxes; facial attributes are not needed for placement.
Run it with the installed tool or follow the provider's
[face-detection example](https://docs.cloud.google.com/video-intelligence/docs/samples/video-detect-faces),
and only spend money on a request the user has already authorized. Any other suitable detector, or
measuring by hand, can produce the same authored data. What Clipkin actually consumes is the resulting
Region Evidence, so detection can stay an external, project-side preparation step.

GVI's timestamped boxes are raw observations. They are not Script Roles and not ready-made Clipkin head
tracks. Per its
[response schema](https://docs.cloud.google.com/video-intelligence/docs/reference/rest/v1/AnnotateVideoResponse#TimestampedObject),
`timeOffset` is relative to the input video and the rectangle is a `normalizedBoundingBox`. Read every
relevant observation, not just the first box a sample program prints.

Treat each returned face track as a candidate. Look at representative frames from each one and assign
the useful fragments to the intended Script Role. Detector tracks are not global identities: a camera
cut can split one guest into several tracks, and a single wide shot can hold several people. Stitch
together, on the final program clock, the fragments you can see are that Role. Picking the first or biggest face is
how a guest's Caption ends up floating over the interviewer.

## Map observations into the composition

Turn the useful observations into ordinary project data, making each of these choices explicit:

- **Clock.** Sample on the Timeline's frame clock through the source's real playback mapping. When
  prepared media shares the Timeline clock and plays at native speed, offset by where it really starts
  in the program, accounting for any gap or overlap. For other footage, also apply any source trim or rate change. Measurements from the
  final video already use program time.
- **Geometry.** Turn the detector's left/top/right/bottom edges into `[x, y, width, height]`, with width = `right - left` and
  height = `bottom - top`. If you measured at a different resolution, or through a crop, inset or
  split-screen panel, push the box through that real placement before normalizing to the final Canvas.
  For a view that moves or resizes, update the mapping over time; one fixed rectangle cannot describe
  motion.
- **Head extent.** Grow the face box to cover hair, hats and the clearance you want. With face
  `(x,y,w,h)` and chosen padding fractions, the head region is
  `(x - pL*w, y - pT*h, w*(1+pL+pR), h*(1+pT+pB))`. Pick the fractions by looking at the actual head;
  no single face-to-head ratio works everywhere. Keep the result inside the Canvas.
- **Gaps.** Interpolation or smoothing is an explicit choice made during external preparation, and only
  within one continuous shot of one person. Inspect the result, stop at cuts and occlusions, and write
  `null` wherever no usable region exists. Fine never invents a missing box.

Each Role's finished array has exactly one box or `null` for every program frame. Keep it in a project
Recipe (for example `tracking.grade`). The conversion can be done by a project script working from explicit source, clock and
geometry inputs. If the way the camera footage is used changes, the positions may need remapping.

## Place only the intended speaker's Caption

Script and Caption already tie each Role's words to their timed Cue. The region input only adds the head
position for the frames where the treatment follows that person. Behavior to plan for:

- A `null` region hides that Role's Cue on that frame.
- End a Cue at the intended handoff using its presentation window or `null` regions, especially if a
  Style's tail would otherwise leave the previous speaker's words sitting over the next speaker.
- When the person leaves frame, is blocked, or appears in another camera view, decide deliberately
  whether the Caption ends or switches to an authored ordinary placement.
- Neither a detector track nor a listening face extends anyone's speech.

Style coverage and hiding are covered in [Caption presentation](../../production/caption-presentation.md).
If a Role has no region series at all, it keeps its ordinary Style position. A `null` inside an existing series hides
the Cue; it does not fall back to ordinary placement automatically. To switch deliberately between
tracked and ordinary placement, use explicit Caption Uses, or separate Tracks fed by the same Script and
Timeline.

The data shape looks like this (three frames, for illustration only, not a real timeline):

```grade
heads.default {
  series: [
    {"id":"GUEST","regions":[[0.12,0.09,0.20,0.26],null,[0.13,0.10,0.20,0.26]]}
  ];
}
```

## Connect the placement to Caption

```reel
<import as="region" from="@clipkin/region-evidence@1"/>
<region:Evidence id="heads" within={vertical.bounds} timeline={speech.timeline}
  recipe={tracking.heads.default}/>
<caption-fine:Caption id="captions" document={story.caption} timing={story-captions}
  timeline={speech.timeline} within={vertical.bounds} regions={heads}>
  <caption-fine:Use style={caption-style}/>
</caption-fine:Caption>
```

Region Evidence series ids must match Script Roles. Fine puts a single-Role Cue at the top center of
that Role's region; with `anchor-x: center` and `anchor-y: bottom` in the Style, the Cue sits just above
it. Width, font and motion still come from the Style. Once `regions` is supplied, every Cue on that Track
must have exactly one Script Role, including Roles that keep a fixed position, so author those Role Cues
in Script. For exact data behavior, the `@clipkin/region-evidence` and `@clipkin/caption-fine` READMEs are
authoritative; `examples/interview` shows a tracked Role next to an untracked one.

## Inspect the actual placement

Check the real picture in Studio or with [snapshots](../../production/snapshots.md), concentrating on
camera changes and speaker handoffs:

- the first and last frame of every tracked Cue;
- clearance for the whole Cue above hair or hats;
- clipping at the top edge;
- collisions with graphics.

Then play the passage with sound to catch jitter, jumps to the wrong person and broken reading rhythm.
Whenever source timing or visual presentation changes, remap the affected observations; never carry stale
coordinates forward onto different footage.

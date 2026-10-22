# Presenter-led visual explainers

Open this page when someone explains on camera (or at least by voice) and a large share of the visual
argument is built by demonstrations, comparisons and motion graphics. The presenter may own the frame, share it, shrink
into an inset or vanish behind another contribution. The richness comes from relationships developing
together, not from hitting some number of effects or components.

## Track the argument through objects that change

Start from what the audience should understand and how the picture makes it understandable. A
comparison might open with two options, keep both on screen while the explanation examines each, then
rearrange them when a third possibility appears. Objects that persist act as the viewer's memory of the
argument; how they enter, move, settle and finally leave all matter.

Read the reference's speech and picture together with
[transcript-linked grids](../../creation/reference-video.md). Fit the range and sampling interval to the
question: a whole passage shows the argument; a short handoff reveals whether an object got swapped,
shifted, cropped or hidden. Let each observation revise your reading of the whole, and share that
understanding as it grows. A list of the nouns pictured misses the behavior that makes the sequence
worth recreating.

In the target, rebuild the useful relationship from this piece's own subject and proof:

- a failed action needs an attempt and a consequence the viewer can perceive;
- a claim that something can be reused needs a recognizable structure that keeps working while what
  it holds is swapped;
- the precise words can live in Caption while the objects act out their meaning;
- graphic text has its own job when a label, number or comparison helps the viewer read the
  demonstration.

## Performance and presentation are separate choices

**How a performance enters the work.** A generated clip is accepted performance media. Normalization
gives it a local domain and an Extent; an equal-length Window places it on the Timeline. If
demonstrations or graphics have to track the spoken words, alignment provides word times on the
clip's local clock and the projector turns them into absolute values.

The picture's arrangement can change several times inside that one Window. As a rule of thumb, a new
layout is a presentation change, whereas a different line of speech or acted beat may mean new material. A single scene can also develop across several source occurrences. Spoken Segment boundaries
do not dictate scene boundaries or camera cuts.

Use [Visual Clips](../../production/visual-clips.md) both for footage that carries time and for
independently supplied material. Treat accepted footage as material available to the changing picture:
it may fill the frame, show up in more than one view, become one side of a comparison, or leave while
the argument continues.
A project scene can consume ordinary media and its Window alongside other inputs whenever their layout
or action is shared. Let visual emphasis follow whoever or whatever is carrying the idea right now,
including cutting back to the presenter for a reaction or direct address.

Two works might handle the same moment differently: one shrinks the full-frame presenter into a small
window as a diagram takes over; another cuts straight from the original camera view to a cut-out
presenter beside the evidence. Both keep the accepted performance while changing how the viewer meets
it. The semantic event is the reason for the change; the manner (a cut, a move, a hold, a fade) comes from
the expressive rhythm of this particular work. Full-frame, inset and cutout are appearances, not separate production
pipelines.

The speech sound stays its own connected contribution while MG covers the presenter. Narration that is
genuinely independent belongs to the [narration-led relationship](narration-led-demo.md). A montage or a
silent ending can take up ordinary authored time; the full Timeline has room for both semantic anchors
and independently authored events, and needs no invented performance to make that room.

## Shoot material for every use it will have

**Source framing.** For footage that will fill the frame much of the time, start generation at the
final aspect ratio. Anticipate the body, gestures, setting and detail the work will need as the picture
changes. The same source can later feed a small viewport or one of another shape, so the destination's
shape alone does not decide the source ratio. A tight crop can never give back missing hands or
setting; choose the source view from the real visual needs across the whole work.

**Plan graphics and framing together.** Recurring graphics and source framing can support each other.
Turn that plan into concrete camera requirements in the image request: the person to one side, enough
of the body, room around the gestures, a particular camera distance. Future MG, editorial writing and
the explanation's metaphors stay with their components; the image request sticks to the image it is
asking for.
[Graphic composition](../craft/graphic-compositions.md#give-material-and-graphics-room-together) and
[image direction](../craft/image-direction.md#frame-the-image-for-what-it-will-become) own that
translation.

**Transparency.** Isolate the subject when the design needs their silhouette; keep the opaque footage
when its real setting matters too.
[Media preparation](../../production/media.md#keep-original-and-processed-material-explicit) owns those
explicit outputs, and their visual uses can change while the same chosen performance continues.

## Events get a reason; transitions get a duration

Name the spoken idea behind a change in the Script and connect its Moment or Selection to the component;
that settles *why* the event happens there. Local durations and easing settle *how* it unfolds. A phrase
can start a movement that carries into the next phrase, and the settled state can stay useful long after
the entrance has finished.

Design each handoff from the states on both sides: what stays, and where attention should land. A hard cut
just switches to the new state when the event happens. When following a continuous transformation helps, a brief
presentation Use can bridge two longer treatments without touching the underlying footage. Match both the
viewport geometry and its source crop at each endpoint. Check each contribution's real interval and
override rules; two independent Tracks with the same timing can both be active.
[Temporal projection](../../production/track-authoring.md#keep-selection-projection-and-consumption-distinct)
and the owning component's documentation give the exact syntax.

## Settle a visual language and carry it everywhere

Translate the intended character into choices of palette, type, edge treatment, depth, texture and
motion, and judge them together on a representative passage with real media. A change of style can
shift all of these at once: recoloring a glossy interface may leave its old character fully intact. Keep
the shared decisions you accept in Recipes or ordinary code dependencies so related scenes evolve
together. The specific colors and effects belong in this work's Treatment.

Pick the realization that renders the desired look well. A tiny raster animation can be exactly right for
a stepped pixel-art flag; another work may need continuous cloth motion or true geometry. The reference
shows an appearance and behavior to understand, not an implementation you must reproduce.

When you simplify a scene, keep the detail that makes it convincing. Dropping a redundant title reshapes
what is left; a folder still needs legible contents; a terminal described as working needs
visible activity while the narration talks about it. A demonstration needs a designed hold, not only an
entrance. How that change reads over time belongs to [Motion graphics](../craft/motion-graphics.md), and
[graphic composition](../craft/graphic-compositions.md) owns its hierarchy in the frame.

## Split behavior where it really divides

Split contributions that have independent reasons to change. Keep things together when they share
geometry and motion, such as a pointer, the object it drags and the drop target. Ordinary functions and
modules can organize the implementation; they don't each need to become a Track or a package. A shared
palette can have code consumers without ever being a visible object.

Expose only what the production actually directs: which assets are used, which events matter, and the
presentation choices worth changing. A one-off scene can keep fixed internal dimensions and artwork. Caption position or
color might deserve Inspector controls, while redesigning an illustrated editor belongs in code.
Independence, parameterization and reuse across projects are three separate decisions;
[Component design](../../production/component-design.md) owns that distinction.

Make each frame's evaluation describe the current state, including before and after every event. Then a
direct seek, a look at nearby frames and a range render all show the same designed behavior. Compute
linked motion from one shared layout: relocate a target and the pointer's destination follows it.
[Drawing](../../production/component-visuals.md) explains the html-visual implementation.

## Build in view of the result

A screen passage can show real interface evidence, an authored explanation, or both;
[Screen demonstrations](../craft/screen-demonstrations.md) owns that decision, and the direction of
generated material and its reference relationships belong to their [Craft pages](../index.md#craft).

Review a meaningful passage inside its surrounding composition as the design develops, and say what it
already demonstrates and what is still being built. A comment can ask for a different visual idea that no
parameter panel could express; Studio exposes the Timeline and the choices worth adjusting. Trace a
timestamped comment to the Source, Recipe, media or scene implementation responsible. The timestamp
locates the evidence, but the change wanted may concern a recurring system across the whole work.

Keep accepted material through explicit Run choices while you revise the composition. Seek to the
changed action and check its handoffs; encode and export the film once that deliverable is wanted. The
interaction belongs to [Review](../../production/review.md) and [Studio](../../production/studio.md), and
[Rendering](../../production/rendering.md) owns render scope and resource choices.

## Productions to learn from

The [video examples](https://github.com/clipkin-ai/clipkin/tree/main/examples) are complete projects with
their Sources, Runs and project packages. The [street interview](https://github.com/clipkin-ai/clipkin/tree/main/examples/interview)
shows a presenter sharing a frame with derived close views, coordinated Moments and an independent
Caption; the [semantic composition](https://github.com/clipkin-ai/clipkin/tree/main/examples/semantic-composition)
shows graphics driven by named events in the Script. The presenter examples predate the Replicate
starter: their Fish Audio voices and Seedance person references are not served by it, so take those
model choices from the [voice](../craft/voice-and-performance.md) and
[video](../craft/video-direction.md) pages.

Bring the reasoning, not the inventory, into the new commission: decide what objects, relationships and
events it calls for, and author that model. Each example's scene list, pixel treatment and export
settings belong to its own production.

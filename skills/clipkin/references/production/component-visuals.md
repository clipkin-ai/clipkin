# Component visuals

Use this page while writing what a project component actually draws. Its author interface, temporal
inputs and state rules belong to [Track authoring](track-authoring.md); the incoming geometry is
explained in [Spatial layout](spatial.md); an optional Studio Companion is covered in
[Studio](studio.md).

## From a domain program to a visible Track

A component's drawing output answers three questions: what is visible, where, and how it changes
across its visible lifetime. For a reveal card that means a box with text, a destination Frame, an
entrance animation, and the interval during which the answer stays on screen.

Often the component first computes a domain program, for instance a list of answers with their
reveal times. The drawing Producer then receives that program together with the Timeline, Frames,
Style and explicit assets, and returns a VisualTrack. A simple component can go straight to the
Track when an intermediate program would not help its behavior or its editing.

The public representation (owned by `@clipkin/composition`) is built from these parts:

| Part | Meaning |
| --- | --- |
| VisualTrack | A named picture contribution tied to one Timeline (`id`, `timelineId`, `visualIr: VISUAL_IR_V1`, `presents`) |
| Present | One independently timed and stacked appearance |
| `span` | `{ startFrame, endFrameExclusive }` in program frames: the first frame through the frame before the end |
| `order` | Stable order among the Presents this Track emits |
| `z` | Absolute paint position of the Present across all Tracks; higher `z` paints above lower |
| `elements` | A single element tree with one root; nodes can be boxes, text, media, masks, compositable surfaces or renderer programs |
| `animation` | Keyframes positioned by `atFrame`, counted from the start of their Present |
| `visibility` | Optional ordered sub-ranges of `span` where the Present is shown, without changing its local clock |

Use several Presents when items have different lifetimes or need different stacking. A persistent
board can keep settled rows visible while new rows enter; its domain program decides those spans and
states, and the drawing output states them explicitly.

The Track is an authoring boundary. Each Present has its own place in the film's paint order, and
its element tree sets local layout and compositing scope. Put content that moves, clips or reflows
together under one element subtree or one browser program. The final DOM follows these visual
ownership relationships, not the way tags happen to be nested in Source.

## A complete drawing function

[visuals.ts](examples/visuals.ts) holds `renderCard`, a pure drawing function built on
`sealVisualTrack` from `@clipkin/composition`. Given a projected span and a resolved Frame, it draws a
colored box containing exact-font text and can fade in from the Present's start. The caller supplies
colors, size, padding, layer and entrance duration. Those arguments do not all have to become Surface
parameters: the owning component can pass its own fixed design and expose only what the production
needs to choose.

Coordinate rules to get right:

- The root element is positioned in Canvas coordinates.
- A child is positioned relative to its parent, so the text child adds padding once. When your layout math
  produces Canvas-space positions for a child, convert them first: take away the parent's origin,
  then write `left` and `top`.
- Present `order` is local to its Track, Present `z` places it in the final Film paint order, and
  element `order` is local again, unique within the containing Present.

The function is only the drawing half of a package. Hook it to a Producer with matching typed inputs;
the Fragment and Surface then expose the resulting Track (see
[Track authoring](track-authoring.md#connect-the-implementation-at-its-real-boundaries)). A Surface
output renames the Fragment's export to the name Source uses, for example `answers.track`.

Call `timelineFrameCount` from `@clipkin/timeline` for the whole Timeline's frame count, and
`assertVisualTrackIdentity(track, timeline)` from `@clipkin/composition` to check a produced Track
against its Timeline. Whether a frame is reached by a direct seek or inside a range render, it
is computed from the same declared keyframes.

## Elements, fonts and assets

| Element `kind` | Role |
| --- | --- |
| `box` | Container or painted shape |
| `text`, `text-flow`, `path-text` | Text with exact font resources |
| `image`, `video` | Reference their media artifacts |
| `mask` | Names an owned mask child and content child inside the same Present |
| `surface` | Prepared pixels (see below) |
| `program` | A renderer-owned payload such as an HTML visual |

The installed vocabulary prints each value shape and the structural rules:

```bash
clipkin vocabulary --visual visual-track
clipkin vocabulary --visual text
```

Styles and motion use the installed CSS-shaped property vocabulary; query the shapes above for the
supported names and values. Motion is expressed as frame-indexed keyframes. Media sampling is a
separate description of which source frame shows at each point of a Present; you need it for timed
video playback, trims, loops and holds. When that is the entire job, a Visual Clip already does it.

Pass asset and font references in through declared inputs. Source assets resolve at the Surface's
asset boundary; generated media stays a graph reference until its Producer has run. The drawing
function only receives those values. If a visual preparation needs to read bytes or run an external
tool, route it through its preparation capability and hand the result to drawing as another input.

## Compose pixels prepared elsewhere

A `surface` element takes a CompositableSurfaceRef: prepared pixels with an explicit extent, color,
alpha and, when animated, frame information. Use it when the component shows a raster or animated
asset that another tool produced. The preparation decides the pixels; the Track decides placement,
sampling and lifetime.

For an effect that transforms an image, give that image to the effect's preparation as an explicit
input. For a local mask, keep both the mask and the masked content in the same element tree. Because
these relationships are explicit, Studio and a render of any chosen interval both have the materials
they need.

## Compose video and graphics in one HTML visual

If a scene's footage window and its graphics share layout or movement, one component should draw both.
`htmlVisual` from `@clipkin/html-program` builds the payload for a `program` element in the
`clipkin.html-visual@1` format:

- **HTML** defines the local structure.
- **CSS** provides layout, stacking, masks, filters and blending.
- **`setup(root, data)`** is optional code that must return `render(localFrame)`.

`render(localFrame)` must set the complete state for that frame, synchronously. A range render can
begin in the middle, so compute everything from the frame and the authored inputs, never from the
previous call.

Split the work between the two functions:

- In `setup`: find elements, build geometry, keep reusable drawing objects, and paint static
  procedural textures once their resources are ready.
- In `render(localFrame)`: update only what changes over time.

That split keeps repeated capture fast and makes direct seeking correct. An HTML visual is sampled
inside its Present's lifetime; outside it, the renderer may hold the boundary pose. Re-entering, or
seeking repeatedly while active, must still produce the full requested state, including the case
where an image finished loading since the previous call.

CSS is scoped per instance, but every `HtmlVisual` on the page lives in one shared HTML/SVG ID
namespace. Any SVG mask, gradient or filter therefore needs an ID built from `root.id` in `setup`, with every
reference to it rewritten to match. The installed `@clipkin/html-program` README is the authority on the
`HtmlVisual` API and resource loading.

Choose the representation that can actually produce the visible effect. CSS can tilt a panel; a
surface that deforms with a texture may need mesh geometry drawn with Canvas or WebGL. Keep that
machinery inside the project component and give Source the meaningful choices (material, amplitude,
timing), not the renderer's internal construction.

When opacity or a filter should apply to a group, nest that group beneath the element carrying the
effect. A see-through panel may blur what lies behind it with a backdrop filter; where it paints and its browser
compositing scope decide which background it blurs. A transition can own both pictures and the
handoff between them. Choose the scope from the visible relationship and keep contributions that
are independently useful as peer Presents. All of this runs through the same rendering path.

Typed children carry media and text into the HTML:

- Use ordinary typed children for prepared video, images and exact-font text.
- Place each direct child exactly once with a `{{child-id}}` slot in the HTML.
- Children keep their declared resources, video sampling and font handling while taking part in the
  program's HTML layout.
- Additional artifacts the program uses go in its `artifacts` list; `htmlProgramResourceUri`
  gives their resource URLs, which the rendering environment materializes.

Footage that plays over time reaches the component as normalized media plus the absolute Window it
should cover and a stated sampling relation. Then:

1. Intersect that Window with the containing Present.
2. Derive the matching source-frame span from the authored sampling relation.
3. Subtract the Present's start to get Present-local video sampling intervals.

Moving or reframing a video does not choose or restart its playback. When the Film should keep the
footage's sound, the same media can feed a peer Audio Clip independently.

Resolve each independently meaningful event before rendering. Convert its program frame into the
Present's local frame once, then animate relative to it. Video sampling still comes from the source
span computed above; neither the event's local offset nor the viewport's movement substitutes for it.
[Component design](component-design.md#let-meaning-drive-the-behavior) explains why these event
inputs differ from internal motion detail.

As an illustration, a reusable scene could accept `during={explanation}` as its lifetime and
`reveal={demonstrate}` as the moment its layout changes. Each value is published separately by an
upstream Narrative projector, so the Producer simply gets one Window and one Instant. The Distribution's
`examples/semantic-composition/packages/responsive-explainer` is the complete package: the video
shrinks from full frame to a side viewport while a diagram enters, and Caption stays a peer.

The format is owned by the renderer package: `clipkin.html-visual@1` executes inside the browser used
by the HTML renderer, and any other renderer decides for itself which formats it handles.

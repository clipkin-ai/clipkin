# Track authoring

Use this page when the production needs visual or audible structure, state or rendering behavior that
no installed component provides, including a scene that coordinates existing footage with its own
content. Start from what the viewer should perceive and from what ought to move when the performance
changes. [Component design](component-design.md) turns that idea into a sensible author interface and a
treatment that fits the actual composition. Related pages: [Composing Tracks](tracks.md) for existing
Track roles, [vocabulary](vocabulary.md) for discovery and project package ownership, and
[Caption authoring](caption-authoring.md) for the speech-text case.

## Start from the behavior the author sees

When the component reacts to words or performance, get its time from the domain. For example, a
Narrative projector may convert the Selection holding a comparison into a Window, the Moment that
delivers a verdict into an Instant, and a whole Segment into the span a board stays on screen. Put ordinary absolute values on the component's Surface and hand them
to the implementation. The component then stays correct when a new performance changes the pace, and
it never depends on Narrative directly. Expose internal events that mean something on their own, not
just the outer lifetime; the [event-versus-animation boundary](component-design.md#let-meaning-drive-the-behavior)
explains why one semantic Window cannot stand in for several word-linked triggers. In an authored
animation, the content events set their own reading rhythm; their Instants and Windows feed the same
component inputs, while durations and frame offsets shape how each change plays out.

Write a few lines of intended Source before implementing anything. A new score strip might take one
Style, an outer Window, preset scores and a few score-changing Moments. Then decide what its items do:
appear briefly, stay after activation, replace an earlier state, or rearrange the layout. Those
answers define the component far better than a long list of decorative parameters.

The installed answer strip, `@clipkin/interview-emoji-reveal`, shows one concrete set of choices:

```reel
<emoji:EmojiReveal id="answers" timeline={speech.timeline} within={canvas.bounds}
  style={answer-style} placeholder={question-icon} during={speech.window}>
  <emoji:Item id="known" icon={known-icon} preset="true"/>
  <emoji:Item id="surprise" icon={answer-icon} at={reveal}/>
</emoji:EmojiReveal>
```

Read it as a set of rules: the outer Window controls visibility; source order assigns slots; preset
answers are present from the first frame; each activation Instant changes only its own slot, and the
answer then stays. Other designs differ: a chart or scoreboard may update the same slot again and again, or fire
several changes at once.

## Keep selection projection and consumption distinct

Meaning is named in the Script, as a Selection, Segment or Moment. `@clipkin/narrative-temporal`
combines an Alignment, its local domain and an equal-length Window, and publishes the absolute Instants
or Windows you ask for. The component's Surface accepts those values; its Fragment and Producers decide
what to do with them.

```text
Narrative relationship + Alignment + LocalDomain + Window
                         ↓ Narrative projector
                Timeline + Window / Instant
                         ↓ generic component consumption
              media occupancy, graphic state, sound or effect
```

Because of this split, one projected Instant can drive an answer reveal, a short sound and a flash,
all sharing the same value. When the speech changes, the event moves upstream; no component has to
search for a word, carry its own projector or understand the Script parser.

Resolve the component's `timeline` input with `resolveTemporalContext` from `@clipkin/temporal/markup`.
Pass that one Timeline to the Fragment and Producers along with the projected Instants and Windows. A
component can mix directly authored named values with domain-produced ones without switching time
models. `examples/semantic-composition/packages/chat-scene` in the installed Distribution shows repeated
content children, each with its own event, and a picture drawn entirely in code.

Attribute conventions differ by consumer:

| Consumer | Attribute | Typical use |
| --- | --- | --- |
| Window consumer | `during={example}` | Reuse a projected interval. For a brief effect that starts at an Instant, build a named Window from the Instant and hand that Window to `during`. |
| Instant consumer | `at={answer}` | The component owns a state transition at that point. |

Check the real Surface: Window and Instant consumers expose different reference vocabularies on
purpose. [Timing](timing.md) documents the shared forms.

## Separate lifetime, activation and persistent state

A board that remains visible gets an outer Window authored separately from any single reveal. Next,
settle what timing on each child signifies:

- an Item window can mean "draw only during this interval", like an ordinary Clip;
- an activation window can stage an item's entrance and movement, after which it stays on the board;
- a Moment can replace a question mark with an answer, which then holds until the board's lifetime
  is over;
- a preset item can occupy the initial state and need no trigger at all.

Write that meaning into the component's documentation. In the answer strip, `preset` is the
package's own initial-state concept: the strip consumes an Instant for a reveal that persists, whereas
Media consumes a Window for occupancy. Offer timing inputs whose consumption matches the behavior.

The interview project's emoji strip follows this design: one outer Window, ordered answer items, one
placeholder asset and one icon per answer, with each Moment changing only its own slot. The Track
never decides when the spoken answer happened; it consumes an event that was already projected.

## Absolute time, explicit media

The [Timeline](timeline.md) resolves Instants and Windows from literal values or typed Extents. A
domain projector may map a complete local domain through an equal-length Window, publish ordinary
absolute values, and then drop that mapping. Media is not tied to the projection: a Visual or Audio
Clip declares its own media occurrence with its own absolute Window. Sequential ranges, space at the
head, interior and tail, and simultaneous branches are all temporal relationships. A project scene
consumes the Timeline, the media, and only the Instants or Windows its behavior needs.

Keep two kinds of operation apart:

- **Material** operations (cutting a performance shorter, changing its speed) alter the local media
  and how it is prepared, so the evidence about it stays truthful.
- **Display** operations (a crossfade between two sources you already have) belong to whichever
  visual scope owns both pictures.

With that separation, a layout change leaves source timing alone.

## Make spatial decisions just as explicit

Canvas is the raster the film is finally rendered into. SpatialFrame, anchors, extents and fitting
say where a piece of content is placed and how its natural proportions fill that spot. Region Evidence carries authored per-frame regions
already expressed in the program's picture plane. None of these are Timeline, which owns the full
time range.

Keep image dimensions, placement and crop transforms visible, so that a measured head or a reserved MG
area maps correctly into the actual composition. Take the production's Canvas plus whatever placement
inputs the role needs, and derive related internal geometry from their common owner. A scene made for
one project may hard-code its layout and where speakers sit; a reusable behavior opens up only the
variation that its actual uses call for. Choosing the renderer viewport, and running any detector,
remain the business of execution and measurement respectively.

## Write the smallest component that does the job

Declare the new package under the project's `packages/` with ordinary package configuration. Read the
installed READMEs for `@clipkin/clipkin/author`, `producer`, `admission` and `markup` to learn the public
package boundaries, and study an installed sibling that does something close, rather than relying on a
monorepo example directory being present. If the project already selected them,
`@clipkin/interview-emoji-reveal` demonstrates persistent Moment-driven state and `@clipkin/ranking`
demonstrates reveal Windows with settled rows. For plain Clip occurrences, where Window, Frame, fit
and source timing are each set separately, `@clipkin/visual-track` is the default reference. Treat
optional examples as evidence, never as prerequisites.

Ranking's README links its implementation file by file: in `surface.ts` the authored time references
are resolved; `fragment.ts` connects the typed inputs; `schedule.ts` works out reveal spans and
settled spans; `render.ts` paints them; `studio.ts` derives editor Items from that same program. Open
it only if it is relevant and installed; a new project component may need fewer operations or different state.

Responsibilities along the chain:

- The **Surface** exposes author intent and resolves absolute temporal inputs with
  `resolveTemporalWindowReference` or `resolveTemporalInstantReference`.
- The **Fragment** routes everything the Producers need: the finished temporal values, the one shared
  Timeline, the explicit placement Frames and any other authored values.
- **Upstream packages** (Timeline authoring, Narrative, beat or other domains) publish those values.
  The component never builds an anonymous value or inspects where one came from.
- The **Producer** owns the visual and state behavior; Studio follows the graph back to each value's
  real declaration when the user edits it.

Wire supplied media, Script content and event references through Source. Surface other content or
treatment in Source or a Recipe where the work needs the choice. A one-off component can keep fixed
illustrative labels, dimensions and animation next to its state and visual structure; having a
boundary does not mean every detail becomes a parameter
([why](component-design.md#separate-responsibility-parameters-and-reuse)). For its text, a new Caption
family reads the shared Caption document and that document's timing.

## Connect the implementation at its real boundaries

A project package is made of these pieces:

| Piece | Responsibility |
| --- | --- |
| Manifest | Declares the Module identity, its nominal Types, every Producer's input and output ports, and dependencies |
| Surface | Checks authored attributes and children, resolves typed references, and emits inert Records, Components and Fragments |
| Fragment | Describes the finite computation graph and the outputs it publishes |
| Producer | Turns declared inputs into immutable state or a render program |
| Activation | Registers the Manifest, the deterministic handlers and the Markup facets, each under the Facet ABI it matches |
| Vocabulary and preview | Tell authors what the role is and show a configured example they will recognize |
| Studio Companion (optional) | Gives the editor meaningful Items, genuine parameter bindings and temporal lineage; rendering is unaffected |

Wiring rules:

- Resolve the Track's `timeline` with `resolveTemporalContext` and connect `context.timeline.ref`
  directly to the Timeline input.
- Footage arrives explicitly through media inputs. The visual Producer consumes the Timeline, the
  explicit media and absolute time values.
- For each Window input call `resolveTemporalWindowReference`; for each event call
  `resolveTemporalInstantReference`. Each call takes the child element plus `resolveReference`; connect
  the `ref` it returns to the domain Fragment. The Window attribute is `during` and the Instant one is `at`
  (the resolvers' defaults; pass `attribute` for a differently named input such as `reveal`); both
  reference temporal values that are already complete.
- Declarations belong to Timeline-authoring and domain packages; a Narrative package must publish its
  chosen boundary before anything can consume it.
- Keep each child's `subjectId` meaningful for inspection, but qualify graph ids by the owning Track so
  several instances can coexist. Never use it to reject a Window that is deliberately shared.
- A finite create/append/finalize graph handles any number of authored messages or cards with
  ordinary fixed Producer ports.

The exact helpers live in `@clipkin/temporal/markup`; the `@example/chat-scene` package shows authored
and semantic events sharing one Timeline.

A scene may publish computed event times for another component, exactly as it publishes a Track; that
shares pre-render data. When the author already supplies a common trigger, consumers can simply share
that input. Add outputs only for a real composition relationship.

For persistent state, work out each requested frame from scratch. Say the strip is asked for a frame:
before or after its outer Window it paints nothing; within it, every slot shows its preset or activated answer, or else its placeholder;
the entrance motion runs relative to that slot's activation frame. Deriving state from declared inputs
and the requested frame keeps Studio scrubbing, partial renders and concurrent renders deterministic.

The output is the public VisualTrack shape from `@clipkin/composition`.
[Component visuals](component-visuals.md) covers Presents, element trees, local animation, prepared
surfaces and a complete drawing function; [Spatial layout](spatial.md) covers incoming Frames;
[Fonts and text](fonts-and-text.md) covers font resources. Asset references and exact font data arrive
through declared inputs. A visual Producer never opens files, calls an image or media service, runs
ffmpeg or picks a Provider. If an external preparation step is needed, model it separately through its
capability and feed its result in as another input.

Sound owned by the component can be a peer AudioTrack output, or Source can place a sound on the same
Moment. Either way, no Track needs to read another Track's private state. Document which Outputs are
public, including any deterministic program values useful for inspection.

## Verify the behavior you introduced

If the new role needs its own timeline Items or Inspector, read
[Studio Companions](studio-companions.md). Make the domain schedule and temporal identities
available where they really live, so the editor can read them rather than guess them from the image.

Give the component a short README, public vocabulary, a meaningful visual example and a preview that
shows the state change. For every exposed event, state what it means and what persists after it.

Then test the transitions that matter:

- When several actions follow different phrases, check each anchor against a delivery with uneven
  spacing. Stretching only the outer Window would hide an internal trigger that is wrongly fixed.
- Confirm the intended transition itself: the answer appears on its Moment, earlier answers remain,
  later ones stay hidden, and nothing shows outside the strip's lifetime. A designed still cannot prove
  any of this.
- For stateful MG, a few frame checks around activation and exit beat snapshots of every detail.
- Where they exercise the new behavior, also check a second instance, a differently sized Frame, and
  seeking straight into the middle.

## A reusable relationship across several Clips

When a behavior spans several source occurrences, make that relationship the component's own
vocabulary. A continuing Presenter can own explicit Source and Use children; a crossfade can own
outgoing and incoming roles; a slideshow can own its replacement policy. Its Timeline, Frames, media and
events still arrive as ordinary typed inputs, and its result is still a plain VisualTrack. The package
defines the small grammar for that relationship, while a larger scene coordinating footage and
graphics can remain a single project component. Both routes use the same rendering capabilities.

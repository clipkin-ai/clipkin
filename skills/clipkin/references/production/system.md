# How a Clipkin production fits together

Use this page when you are unsure which relationship should own a piece of the work: the material,
its meaning, its time, its place in the frame, the picture, the sound or the delivery. Each section
names the owner and points to the page with the details; [the production map](index.md) routes the
rest.

## Material becomes useful through explicit relationships

A file the user supplied, an Output a model just generated and an Output reused from an earlier
Result can all carry the same material Type. Nothing about where the bytes came from changes what
they are. Timed media goes through normalization, which picks its streams, fixes a finite local
temporal domain and publishes its Extent. What the work then does with those facts is a separate,
authored decision.

Spoken work adds two more relationships, each stated on its own:

- Script names the meaningful passages and events.
- `NarrativeAlignment` places one Segment on a source-local domain.

The normalized medium still supplies picture and sound independently. Because every link is
explicit, one recording can feed semantic timing, a visible picture and audible speech at once
without being promoted to a special kind of media.

"A-roll" names the performance that carries a passage; it is a role, not a file class. That
performance's picture may fill the frame, move, vanish, or never appear at all while its sound and
semantic relationships carry on. B-roll, generated shots, imported pictures, narration, music and
effects are the same ordinary media values serving other roles. How material is admitted, normalized
and turned into derived versions is covered in [Media preparation](media.md).

## Timeline publishes absolute time

Timeline is the film's single finite frame domain plus whatever named Instants and Windows the
author wants to share. Its construction graph can lean on durations known in advance or on Extents
that only resolve after media is generated.

Several sources can supply absolute times, and they are peers:

- **Semantic timing.** A Narrative projection combines an Alignment, its local domain and a Timeline
  Window of equal length, then publishes the Selection, Moment or Segment boundaries you ask for as
  plain Instants and Windows.
- **Other local domains**, such as musical beats, can offer projectors of their own.
- **Direct authoring** on the Timeline clock.

Components only ever consume the resolved values. [Timeline](timeline.md) owns construction;
[Timing](timing.md) owns the choice between direct and projected time and the forms components accept.

## Canvas publishes picture coordinates

Canvas fixes the final dimensions and the coordinate system. A Frame names a destination region;
SpatialMap2D describes how source geometry lands in it. A component owns the layout and motion its
internal objects share, while independent visual contributions stay peers of one another.

Timing, visual grouping and paint order are three independent choices. A single scene may react to
several events, and several separate components may react to one event. [Spatial layout](spatial.md)
owns geometry; [component design](component-design.md) owns deciding how much belongs in one visual scope.

## Visual and Audio Clips place ordinary occurrences

Each Visual Clip joins one picture source, one absolute Window, one destination Frame, a paint order
(`z`) and a source-sampling choice. An Audio Clip joins one audio source, one absolute Window, a
source-sampling choice and its mix treatment. One synchronized medium can feed both, through two
separate, explicit occurrences.

Three clocks are always in play; never let them blur together:

| Clock | Answers |
| --- | --- |
| Timeline time | Where the contribution sits in the film. |
| Source time | Which sample of the media is read. |
| Component-local time | Which visible state the component is in. |

Behavior that spans several occurrences — a presenter who continues across shots, a slideshow, a
crossfade, ducking under a voice — belongs in a component. That component can publish ordinary
VisualTrack and AudioTrack outputs for Film. [Tracks](tracks.md) routes between plain Clips and
richer components.

Caption is one more peer relationship with three separate owners. The CaptionDocument holds the
displayed Words, the correspondence Units and the authored Cues. CaptionTiming holds the complete
absolute Unit boundaries. A Caption family owns what becomes visible when, plus layout, motion and
drawing — without ever redefining which words belong to which Cue.

## Give each part the direction it can realize

Treatment holds the whole creative intention. Each producer, though, can only act on facts it
understands, so translate the intention per producer:

| Producer | What its direction must state |
| --- | --- |
| Image or video model | Visible subjects, setting, framing, action, camera behavior, and what each reference contributes. |
| Voice model | Audible character, delivery and language. |
| Component | Its content, Frame, events and the treatment choices its behavior exposes. |

Composition goals still shape those inputs. If a diagram will later sit beside the presenter, ask for
a generated presenter framed with that space free; if the edit needs a wry tone, ask the voice for
it. Phrase the consequence as a property of the requested material, then build the later
relationship through the real component, time and space inputs. Before the edit depends on a detail,
look at the accepted material and confirm the producer actually delivered it.

## Components preserve shared behavior

Give a component the content that has to share layout, state or motion. Expose as inputs only real
dependencies and choices a director would actually make — the assets, the events that matter, where
it sits and how it is treated. Ornamental shapes and design that never varies can stay internal.

Three decisions stay separate: what a component is responsible for, which of its choices are
parameters, and whether it is distributed beyond this project. A one-off scene with almost no
controls is a perfectly good component; sharing it across projects is a later decision taken only
when reuse is real. [Component design](component-design.md) explains that boundary;
[Track authoring](track-authoring.md) implements it.

Film names its Timeline, its Canvas and each visual and audio output it includes. Source nesting,
component scope, paint order and execution dependencies each keep their own meaning; none of them
implies another.

## Source, Run, Runtime and Studio

| Piece | Role |
| --- | --- |
| Author Source (`.reel`) | Connects material requests, time and space values, components and deliverables. |
| Recipe (`.grade`) | Holds reusable treatments as named values. |
| Run (`.slate`) | Picks public Outputs as Targets and may reuse exact files or completed Result Outputs as Candidates. |
| Build | Executes the demanded graph and records every completed public Output in its Result. |
| Runtime Profile | Selects already installed Providers, Endpoints and credentials for external work. |
| Studio | Reads the authored and executed relationships the selected packages expose. |

When reusing, choose the narrowest value whose facts still hold for the current edit. Studio
Companions give a component useful Items and controls by tracing what it truly consumes and produces.
The workflows are covered in [Authoring](authoring.md), [Runs](runs.md), [Builds](builds.md) and [Studio](studio.md).

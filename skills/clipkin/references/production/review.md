# Reviewing the production

Use this page when you open Studio, judge an encoded Result, or improve the layout, timing and
expression of the new Film.

Where to look first:

- **Picture:** [Snapshots](snapshots.md) of the current Studio work. Single frames settle detail;
  continuous frame grids settle movement and handoffs.
- **Feel and sound:** Studio playback of the passage.
- **Encoded delivery:** the exported file.

[Studio](studio.md) covers launching, reusing a session, what is displayed, writing changes back to
Source, and project Companions. [Timestamped Comments](studio.md#revise-from-timestamped-comments)
connect the user's feedback to the production facts that own it.
[Builds and Results](builds.md) covers retrieval and explicit Output reuse.

When reviewing *with* the user, [show the editable work before export](studio.md#review-before-export)
and introduce both tools: Comments for direction pinned to a moment, Studio for the timeline and the
exposed parameters. Browser playback offers both without first encoding a full video. When the user wants
an actual file, rendering and checking it is a separate, later step.

## Make the composition work

Watch the chosen performance with its assembled picture and sound.

- **Pure A-roll:** do the speech, action, reactions, camera changes and pauses carry the passage as
  intended?
- **Mixed work:** judge Caption, evidence and graphics *together with* that performance.

Look at their actual arrangement in Studio or in a rendered Result and ask concrete questions. Is the
comparison clear? Can the Caption be read? Does the B-roll cover the explanation it was meant to? Does
each element arrive and leave exactly on its word or gesture? Through a handoff, does a persistent
object stay recognizably the same thing, in the same state? When a video viewport moves, does its playback still do what was intended?
Then change whatever layout, timing or component behavior will make the passage work better, and
judge any local change inside its surrounding composition.

To find a word, reveal or handoff, work from the authored Script and the production's existing
semantic timing. Those relationships point to the passages that need attention; Studio and rendered
frames show how the chosen assets behave there. Carry the same produced media and semantic Outputs
through every layout and component revision.

## Review the work the Run actually selects

Review through the Run that selects the production's real material: it binds the Author Source,
Targets, files and earlier Results. Keep produced media and semantic Outputs selected while the
composition changes. Studio plays and edits that selection, snapshot photographs the picture Studio
has compiled, and a narrowly targeted Run renders an encoded interval when you ask for one.

Only trust evidence for what it can show. A component's own example shows its style and behavior.
The production's actual image establishes framing and color. Whether Caption and motion graphics
collide with a face or a gesture in motion is visible only in the produced video, so inspect those interactions with the
material that will really be delivered.

## Show what the current work establishes

Different checks answer different questions:

| Check | Establishes |
| --- | --- |
| `clipkin check` | The Source and graph are legal |
| Studio | What the configured composition displays |
| A completed Build | What the selected Endpoints actually produced |
| Creative review | Whether the composition performs the Treatment and the useful relationships learned from the reference |

When you present unfinished work, say what it is for, what it already achieves, and what important
work the Brief still needs. A storyboard can settle framing; only the produced performance shows how a
person really moves and speaks; a working preview can support either conversation. Make the current
scope clear so the user can give useful direction, and keep going on the remaining work within the
agreed commission. Unresolved service choices belong to
[service selection](../environment/model-and-provider.md#choose-the-practical-capability-path-with-the-user),
which covers the model services connected in the Runtime Profile.

When something seems missing, trace it through material *and* use:

- **Intended speech:** listen to the selected Film. An audio file existing proves the material exists;
  only its admission and an Audio contribution prove it reaches the Film.
- **Intended physical action:** look at the footage itself, not just the viewport animation.

[Media admission](media.md), [Audio Clips](audio-clips.md) and [Film assembly](rendering.md) complete
those relationships. Silence or stillness may also be deliberate when it serves the Brief.

Always look at the complete Film at its delivery size, not only at the components inside it. A
component that looks good alone can still cover a face, fight with the Hook, land a beat early or late,
or disturb the rhythm of the whole.

## Choose evidence that exists

Authoring a component does not tell you which frame or interval matters. You learn it only from
something you can see or pin to a time: a Segment or clock relation you authored, where the Studio
playhead sits, an encoded Result, or timing that another part of the graph computed. Until then the exact location
is an open question; do not guess it.

Pick the view that can answer the current question:

| Question | View |
| --- | --- |
| A known frame position (from semantic events, the playhead or clock time) | [snapshot](snapshots.md) of the existing `HtmlProgram`: individual states or continuous frames, with the surrounding handoffs in view |
| Exact pixels, neighbouring frames or a short passage of an encoded Result | `clipkin media frames`, `cut` or `tile` / `tiles` |
| Interactive playback, parameter editing, or a component's Companion | Studio; seek to projected domain evidence or select Track Items to see their place in the composition |
| An encoded clip with sound, e.g. testing an export setting or delivering a passage | a [range render](rendering.md#choose-a-render-interval-in-frames) |
| Whether the Hook lands, the story moves and the payoff and CTA work; how all layers (A-roll, B-roll, Caption, motion graphics, Effects) play as one | the whole deliverable |

Combine views as the question requires. A component's name does not prove that a state is stable or
that a change happens at a guessed time; Studio or the real media provides that proof.

### Relationships to inspect

- **Performance:** the selected footage really contains the intended speech, action and reaction.
  Clip or component motion cannot stand in for action missing from the material.
- **Picture and coverage:** each B-roll insert earns its place in the passage, staying on screen for
  exactly the explanation or handoff it is meant to carry.
- **Semantic timing and motion:** cuts, Caption Cues, motion-graphics states and Effects land on the
  intended word, phrase, pause or clock event. Check important *internal* events, not just the outer
  interval: a scene can start on the right phrase and still reveal its result on the wrong word.
  Arrival, settle, the active phase and departure together should let the viewer feel the handoff.
- **Shared layout:** a layout set up for a passage stays coherent while its contents change. Inspect
  handoffs as well as filled states, so swapping a card or ending a Selection does not release space
  the passage still needs.
- **Caption:** check each distinct configuration (a new speaker, placement, color, emphasis, Cue
  shape or motion); every one stays readable, belongs to its speech, and keeps clear of the intended face and action.
- **Typography and UI:** independent text has the right hierarchy, content, persistence and relation
  to the picture.
- **Composition:** every element has room, and the full frame keeps the intended visual hierarchy.

### Geometry

Read three nested layers: Canvas, outer Frame or background, inner content. At each boundary check
containment and capacity, then judge optical alignment. A purposeful crop, a bleed off the edge,
an overlap or an off-center balance counts as design when it serves the piece; measurements report what happened, and the picture
decides whether it works.

### Handoffs

At a visual handoff, look at what is really on screen before, during and after the change. Returning
to the speaker may be intended; a one-frame flash of the speaker between two other views usually is
not. If an exposure is unintended, find the owning cause: the active Window, source playback,
transition opacity, how long a component's background lives, or a spatial crop. A designed background
or several Frames can make the intended picture without any single full-frame source.

Repeated appearances of one *identical* visual configuration can share a verdict. A changed speaker,
placement, Style, content shape, behavior or surrounding composition is new evidence and needs its
own look.

## Compare a reconstruction by function

Treat the reference Analysis and Timeline as a map of questions. Compare the spans that expose an
important relationship: items piling up on a board, a cut away from the speaker to cutaway footage,
Caption styling that changes with the speaker, a motion-graphics reveal, a payoff that returns to the Hook. A short clip or
dense adjacent frames establish motion and order; a full-resolution frame establishes text and
geometry.

The target may deliberately change the person, product, brand, language or visual world. Ask whether
the transformed element plays the same useful *role*, not whether pixels match. If the target's
Treatment intentionally changes the role too, the Treatment wins.

For a supplied person or product, hold each new appearance up against the real references and against the
planned camera image. Is the subject recognizably itself, appealing, and at home in the piece? Do the
lines, the demonstrations and the graphic details fit this particular target?

Then inspect how each relationship is realized: the entry grabs attention, the hold allows enough
reading time, the motion explains a change, the exit clears room for the next idea. Compare source and
target at *corresponding words or actions*, since new speech can move that event to another second.
The reference is precise design evidence; the Brief and Treatment decide which of its choices belong
in this piece.

## Fix the fact that owns the problem

| What the review shows | Where the fix belongs |
| --- | --- |
| The story, the logic of the shots or the visual system misses the intent | `TREATMENT.md` |
| Wording, who speaks, which words share a Cue, or a Selection or Moment is off | the Author Source's Script |
| Composition, authored parameters, or a semantic or clock relation is wrong | the Author Source or a Recipe |
| The wrong file or earlier Output is selected | the Run Source |
| A reusable visual role is unable to express or draw the design it is meant to have | the project Author Package |

Before you change anything, state the problem, its consequence, and the improvement you expect. For
example: lengthening a hold makes a comparison readable; delaying an exit keeps proof on screen through
the claim it supports. Correct the owning fact and leave the surrounding work intact. Watch the
affected interval and its handoffs afterwards, then judge it within the whole Film. If it did not get
better, revisit your explanation before trying another adjustment.

Asking for different *paid* media is a production decision, and its extra requests must show up in
`clipkin plan`. Before submitting, run `clipkin pricing <run>`: per request it shows the price in
credits (exact, an estimate with its assumptions, or "not yet measurable" when it depends on media
produced during the Build), followed by a Run estimate with the total price in credits. `--json` carries the same
as an `estimate` object (`clipkin.run-estimate@1`); actual charges are metered from each completed
request. Composition changes should reuse the accepted Outputs instead.

You are done when layout, legibility and timing deliver what the Brief and Treatment ask for, with
clarity and force. Keep going while a change will improve that; deliver once it works, and
explain the important choices and any material limitations.

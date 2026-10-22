# Component design

Use this page when you are deciding how a picture, a transition or a recurring visual system should
be organized. Approach it twice over: as a director who knows what the moment must do for the
viewer, and as the person who will actually drop this component into a real composition and revise
it. A good component makes one idea readable and keeps its behavior easy to reason about inside the
production. Its author interface only needs to be as large as the work demands.

Neighboring pages own the adjacent questions:

| Question | Owner |
| --- | --- |
| Visual hierarchy, occupied area, palette | [Graphic composition](../playbooks/craft/graphic-compositions.md) |
| How the picture changes over time | [Motion graphics](../playbooks/craft/motion-graphics.md) |
| Package wiring and implementation | [Track authoring](track-authoring.md) |
| A new subtitle family | [Caption craft](../playbooks/craft/captions.md) and [Caption authoring](caption-authoring.md) |

## Name the relationship before drawing it

Begin with what the viewer experiences: two options become comparable, a question gets its answer,
a ranking builds up, a phrase lands hard. Spell out what appears, why it appears in that spot, what
changes, and what the viewer should still hold in mind once it is over. That explanation already
points at both the look and the place where the component's edge belongs.

Installed components package familiar relationships. When one behaves the way this moment needs,
use it. When the work needs a role nothing installed expresses, define a project component for it;
its content and timing can vary while the relationship stays recognizable. A new component may mix
existing helpers with its own drawing and animation. Using the vocabulary and extending it are both
ordinary authoring.

Let shared behavior decide the unit:

- A board whose rows share one layout and accumulate persistent state is one component.
- A photo and an unrelated title can stay peer Tracks.
- An object that survives several camera cuts keeps one authored identity while its state evolves.
- A performance that shrinks from full frame into a side viewport while a diagram takes the freed
  space can be one component. It owns the relative layout, overlap, masking and the coordinated
  motion between them. A-roll supplies the performed passage; who owns the picture follows the
  behavior you are designing.

Existing footage and independent assets can both be placed through [Visual Clips](visual-clips.md).
A scene used exactly once is still a perfectly good component. Caption and independent overlays can
remain separate peers.

Split a scene further only where a part has its own meaningful responsibility. Keep geometry, state
and transitions that move together in one place, so their behavior stays legible. Internal functions
and subcomponents can structure that code without each one becoming a Track or a package. The right
split keeps the relationship intact when things change; adding layers does not, by itself, make the
design better.

## Separate responsibility, parameters and reuse

Adaptive composition adds structure only where it makes the work easier to understand and direct.
Three different decisions tend to get conflated:

| Decision | It is justified when |
| --- | --- |
| Give something its own owner | A distinct visual responsibility, lifetime or behavior is clearer with its own boundary. Parts that share geometry, state or motion can stay together. |
| Turn a value into a parameter | The choice must come from outside the component: supplied media, a word-linked trigger, a position, or a setting someone will in fact tweak. |
| Design for reuse | Several actual uses have the same relationship or look. Put that common behavior in one place and open up only the differences those uses exhibit. |

These are independent. An author input does not oblige you to publish a package or to offer a Studio
control. A shared internal helper does not have to become a Track. The test for a numeric value and
for a qualitative one is the same: is there an external dependency here, or a directing decision
someone will want to make? A color, a mood, a layout mode or an easing name does not earn a public
parameter just because it is capable of varying.

A one-off effect can have its own owner and a fixed design. If a later edit changes it, editing its
implementation is the right move. Imagine likely revisions to discover tangled responsibilities or
inputs that matter, but do not pre-build every conceivable edit as a parameter. Even repeated uses
can share one fixed treatment. A wide interface or a high reuse count says nothing about quality.

Worked example: a backdrop and an editor demonstration do different jobs, so give them separate
owners. Inside the editor's own code live its button dimensions, the gaps between panels, its
example labels and the routes the pointer travels. Its pointer, the dragged image and the target slot share geometry, so
they belong together. Feed in the real assets and the speech-linked events through author inputs;
expose Caption placement or color if those are adjustments someone will make. The piece gets clear
structure, and the illustrated editor does not turn into configurable editing software.

Pick the boundary by kind:

- **Peer Tracks** for contributions composed independently.
- **Internal parts** for a coordinated scene.
- **Ordinary modules** for code organization.

None of these has to line up with parameter or package boundaries. Splitting files helps
maintenance; wrapping a whole passage in one named Track gives it occupancy on the timeline. Judge
each by whether it clarifies who is responsible for what. The spoken outline gives timing context,
not structure: several passages can develop one object, one passage can hold several independent
objects, and two contributions sharing a Moment do not therefore need to share a Track.

## Keep revisions local

Use the revisions the work actually goes through to test your boundaries. A change to one visual
responsibility should stay with its owner; a change that affects several things should flow through
a shared dependency. If one edit forces you to redo the same decision in several scenes, move that
decision to a single source. Whether the owner is a fixed implementation or an author input, the
point is that the relationship is explicit.

A good probe: *if the delivery pauses before the result, which event has to move and which local
design should stay put?* Look at the input that carries that event instead of counting parameters.
When the work needs a qualitatively different relationship, change the implementation or create a
new component rather than piling up speculative mode flags.

As a scene grows, keep edits contained:

- Put independently edited scene bodies, styling and per-frame evaluation in ordinary source modules,
  sharing only the mechanics they really share.
- A palette, a typing function or a media-sampling helper can be a plain project dependency. It
  needs no Surface or Track.
- A shared package pays off once several components genuinely use it.

Source connects the selected assets, the semantic events and the component's external choices. The
modules own how those are realized, fixed design unique to this video included.

Derive related geometry from one layout. The pointer's destination comes from the target it clicks;
a badge attached to the pointer follows the pointer; two presentations of the same playing source
share one sampling. Then changing the layout carries its dependent motion along automatically.

Grouping on the canvas and timing are separate choices. A combined scene can respond to spoken
Moments, and separate Tracks can share one authored event. What sits together in the picture does
not decide where its time comes from.

Captions follow the same logic. Fine Caption provides reusable flowing text; a custom Caption family
can own a new relationship between words and graphics. Both read the Script's wording and its
semantic timing, and shared behavior can keep words and graphics in one component.
[Caption authoring](caption-authoring.md) covers the specialized text inputs and the same freedom.

A reusable scene should take explicit inputs: normalized media sources, each with its exact absolute
Window, the scene's own outer Window, and the Moment that changes its layout, all supplied through
the Timeline and shared temporal projections. Swap the product or rewrite the Script and only the
content and the semantic anchors change; the behavior survives. Each source Window decides what is
sampled, and the explicit picture-plane Frames given to the component decide where it finally lands.

### Learn from the examples

The repository's [video examples](https://github.com/clipkin-ai/clipkin/tree/main/examples) apply these
ideas differently: a tier board that keeps its state, several connected podcast camera views, one
street encounter seen from shared angles, and explainer scenes that move in concert. For each one, trace why a behavior has the owner it has, what
gives it its time, and which inputs a changed brief would replace. The notes explain the reasoning;
the scene lists are just that production's design. In the explainer, scenes keep fixed internal
details while Script events, Caption and presenter framing stay independently authored.

Install an example's declared dependencies with `npm ci` as its README says. In a different project
that chooses Ranking, install it with `npm install @clipkin/ranking@^0.1.0`. For the whole-work
pattern, read [Presenter-led visual explainers](../playbooks/formats/presenter-led-explainer.md).

## Let meaning drive the behavior

When an event responds to the argument or the performance, drive it from Script Selections, Moments
and Segments. An upstream Narrative Projection turns those into named absolute Windows or Instants;
the component consumes the values without knowing they came from speech. A different delivery then
moves the event and its purpose is preserved.

Explicit clock time still has its place: an authored lead-in, a short entrance, any decision that
really is about the clock. In a pure MG piece, name the events that carry meaning and direct the
pace at which they read. Build components to accept resolved Instants or Windows, so the same reveal
works whether Source feeds it a Script Moment or an authored time. Keep a message's content and its
trigger together in Source; repeated children can each carry their own trigger. For speech-led roles,
show the semantic usage first in examples, demonstrating how a new performance keeps the
relationship. Without a performance, time comes from the film clock; see
[Authored animation](rendering.md#compose-an-authored-animation).

**One outer Window is not enough for internal events.** Take a drag-and-drop scene: picking a
picture, dropping it into the editor and revealing the result may each answer a different phrase.
Give each action its own semantic input. Hard-coding them to clock seconds, or to fixed fractions
such as 20%, 50% and 80% through the outer Window, loses both their identities and their link to speech whose spacing changed
unevenly.

So the component takes an outer Window plus separate Instants for those events; Source obtains them
from the right projector or from direct time declarations. The implementation derives the motion
between the resolved events and keeps the pointer path, button geometry, click rebound and
decoration local. Motion that simply unfolds inside one authored interval can use normalized
progress through it; it does not need a marker per keyframe. *Where a meaningful event sits* and
*how long and in what shape the motion runs* are two different choices.

Pick the temporal input from what the component does with it:

| Behavior | Input it consumes |
| --- | --- |
| A picture covering an explanation | Occupies that explanation's Selection |
| An answer revealed on a word | An Instant; it may stay visible after the word ends |
| A ranking item moving into place | A reveal Window for the move, then a settled row afterward |

For the board, lifetime, trigger and resulting state are three distinct facts.

Shape motion around the relationship. Arrival pulls the eye, settling establishes the new state,
replacement makes a change legible, departure clears room for the next idea. Give each the time its
meaning needs. When an authored interval gets longer or shorter, decide which part stretches with it
and which part keeps its own readable duration, and write that decision down.

One authored event can also coordinate peer Tracks: a reveal, a sound and a flash can all use the
same Moment. A shared event is sufficient when each contribution is already a useful component on
its own. [Track authoring](track-authoring.md#keep-selection-projection-and-consumption-distinct)
details the projection/consumption boundary.

## Expose the choices the work needs

A parameter belongs on the interface when it unlocks a real directing choice or connects a real
dependency. Keep Script wording and semantic anchors attached to their existing owners and wire
supplied media explicitly. In a one-off scene, illustrative text, decorative geometry and
purpose-built animation can stay local. A fixed design that serves the piece is finished; adding
controls is a separate decision. If a label later needs to vary repeatedly, promote it to an input
at that point.

Before implementing the inputs that matter, sketch how Source will use them. Related visual choices
can be gathered into a Style or Recipe. A comparison might need only labels, images and a reveal
relationship, with its internal layout derived from those. One meaningful control can steer many
details while keeping the design whole. Semantic triggers are worth having even for a scene used
once, because they anchor it to the real performance while the animation internals stay private.

When reuse is genuinely needed, support the variation that actually occurs: longer names, a
different product, more or fewer rows. A new visual relationship may deserve a new component instead.
[Caption craft](../playbooks/craft/captions.md#caption-families-styles-and-parameters) shows family,
Style and parameter choices for a role that is reused constantly.

## Judge it inside its frame

Evaluate the component in company: beside the presenter, the B-roll coverage, the Caption and any
other graphic occupying the same frame. The eye needs a clear entry point, sensible grouping and a settled state that stays
readable. Its local palette, density and motion should serve the hierarchy of the whole frame.

Express placement through the chosen Frame and derive internal layout from it. Decide how real text
and media fill it: which parts wrap, crop or scale, and which stay aligned. A fixed layout
is fine for this video; open up placement or size only when the surrounding composition has to steer
them. If a configuration genuinely cannot work, fail with an explanation that tells the author
which content or space has to change. [Spatial layout](spatial.md) owns fitting and coordinates;
text resources and their placement belong to [Fonts and text](fonts-and-text.md).

Look at the states that matter, in the actual composition: before the reveal, mid-change, settled,
and on exit. A preview with representative content answers hierarchy, readability, collisions and
timing at once. Fix problems where they live, whether that is a semantic anchor, the selected
Recipe, how the component behaves, or the visual concept. Keep reusing the production's media while you refine.

## Make it easy to pick up and revise

Ship vocabulary and an example that make clear the component's purpose, required inputs, public
outputs and what its timing inputs mean. For persistent state, say what remains after activation.
The preview should show the behavior that would make someone choose this component, with sensible
default content.

If the user will explore the production in Studio, make its useful objects recognizable: the board's
lifetime, a row's reveal, the Style a Caption Cue actually uses. Watching and understanding the work
is valuable by itself; a read-only scene with a clear identity can be complete. Offer controls for
the adjustments the user really needs, such as Caption position and color, through the author inputs
that already exist. An empty parameter panel is not, on its own, a reason to widen the interface.
[Studio Companions](studio-companions.md) owns those bindings.

If the project deliberately installed `@clipkin/ranking`, its README is one worked example of word-driven
reveals, rows that stay put, layout, and Items for the editor. Do not assume that optional package ships with the
Distribution, and do not install it just to start a component. Carry over only a relationship that
answers this video's need, rebuilt in the project component's own design.

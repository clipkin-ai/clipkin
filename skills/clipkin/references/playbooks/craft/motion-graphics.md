# Directing motion graphics

Come here whenever the picture evolves through authored graphics, effects or a choreographed scene. Motion
graphics can clarify how things relate, let a comparison land emotionally, time a joke or set a visual
attitude.
The scale ranges from a small accent, through a presenter moving alongside a diagram, to a fully animated
passage. [Graphic composition](graphic-compositions.md) owns the hierarchy of the shared picture; this page
owns what the changes do to the viewing experience.

## Direct the change, not just the entrance

For every event, know three states: what the viewer sees before, what changes, and what is left after.
Examples:

- a board collects answers one by one;
- a picture gets picked up, dragged to a slot and rejected;
- a camera view pulls back while another idea comes forward.

The action is what gives the next state its meaning. A delightful entrance cannot rescue a final state
that fails to show the claim.

Keep an object's identity visible as it changes. When a card turns into an attachment, it can keep its
image, shape or path; when a demonstrated interface is restyled, its recognizable controls can stay while
the treatment changes. That continuity lets the audience see *what changed* instead of decoding a fresh
diagram each beat. Sometimes, though, the next idea reads best if it simply appears, and then a clean cut is
the stronger handoff.

Effects can serve feeling as well as explanation:

| Motion character | What it can do |
| --- | --- |
| Springy arrival | Makes an answer feel playful |
| Abrupt hard replacement | Gives a claim force |
| Slow, precise construction | Makes a relationship easier to study |

Pick the character that belongs to this film, then give the result enough on-screen life to register. The
right hold and pace depend on the words, the sound, the picture size and how much the audience has to read.

## Make the motion belong to one visual language

Palette, type, edges, texture, depth, motion and sound can all reinforce each other. A retro cartoon look,
a precise mathematical diagram and a spatial 3D scene each need different decisions about weight, path,
perspective and rhythm. Those style names are creative directions, not renderer or component types. Work
out the concrete relationships that make the chosen style convincing, and move decisions shared by several
scenes into the project's Recipes or ordinary component dependencies.

Through a restyle, keep the scene's meaningful objects whole. Whatever carries the idea (what is inside a folder,
the controls of an editor, the outcome of a comparison) has to keep doing that job under the new look.
Repainting just the outer panels alters less than viewers tend to assume, and removing a label may force the remaining
layout to be recomposed. The film's Treatment owns its specific palette, ornament and attitude.

Source footage belongs to that language as well:

- Moving the viewport alters how time-bearing footage is *seen*, never the time it was performed in.
- A drawn border, a caption and an image moving on its own can coexist in one moment while each keeps its
  own visual owner.
- When footage and graphics must move as one scene, direct their shared geometry together.

[Visual Clip](../../production/visual-clips.md) owns time-bearing footage, and
[component design](../../production/component-design.md) owns where the implementation boundary falls.

## Give events and movement different jobs

Separate *when the meaningful change happens* from *how the motion around it looks*:

- **Events.** Tie an explanation, reveal or comparison to a Script Selection or Moment; give a wordless
  animated passage authored time. The reference tells you where the behavior and its meaningful
  changes sit in the work.
- **Movement.** Travel, settling, texture and secondary motion are designed locally around those events.

[Timing](../../production/timing.md) and
[component design](../../production/component-design.md#let-meaning-drive-the-behavior) own the exact
projection and the author inputs.

Compute related motion from the relationship on screen. The pointer's destination is the button it will
click; a label's position is taken from the thing it names; a refused drag returns from the spot it reached. Built this way, a layout
change cannot break the visual action. Within a scene, plan how things arrive, react, stay and leave as one
choreography, but let Caption, sound or media that act independently keep their own roles.

Review the passage with its real material and sound. Exact frames show whether a shape, overlap or settled
state reads; playback shows weight, pace and whether the handoff lands. Judge at delivery size and in
context with the neighboring picture, including the moment right after the most impressive motion.
[Snapshots](../../production/snapshots.md) and [review](../../production/review.md) provide those views, and
[drawing](../../production/component-visuals.md) owns how the chosen visual behavior is rendered.

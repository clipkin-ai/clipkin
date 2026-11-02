# Directing generated video

Read this before you write or adapt a video prompt, a performance Recipe or an action passage. A
still image can settle who is on screen and where; generated video is where the Script and the
visual idea come alive, through speech, interaction, camera behavior or wordless action.

**Default for creator-led social video:** an appealing, engaged performance. The speaker reacts to
their own words and pulls someone into the thought. Voice, face and body carry that relationship
together. "Expressive" means the attitude is clearly legible, not that it is loud; it can be
outgoing or held back.

## Let footage carry temporal behavior that matters

**Footage is evidence first.** Before any frame of a reference video goes near a model, watch it and
listen to it to understand the work. Then choose generation inputs by asking what the new shot
actually has to realize:

| What must come through | Usually carried by |
| --- | --- |
| A person, object, place or composition | A still image |
| An action and why it happens | Prose direction |
| A specific unfolding in time (performed rhythm, path of movement, contact, coordination, how an effect evolves, the camera's relationship to the subject) that prose, stills or authored components would lose | The relevant source footage, connected as a video reference to a model that accepts one |

Calling a task a "clone" does not by itself make the entire reference video a generation input.
When the exact movement is not the point, a broad description of the action gives the model useful
freedom.

**What footage can carry.** Swapping the person is the familiar case, but the target might instead
change an object, the world, the words or the sound. What the source contributes varies:

- a comic delivery may live in how vocal phrasing, face, gesture and camera angle line up;
- a dance lives in coordination, a fight in contact;
- a fixed-camera mishap lives in how its cause and payoff unfold inside one view.

Watch and listen to find out which of these the source holds. Its vocal manner can shape your
direction, but the target's words and voice come from the Script and from
[voice direction](voice-direction.md). In one request, the video reference can carry the temporal
behavior while image references set the new visible facts and the prompt directs how they relate.
What the new work keeps and what it reshapes is decided in
[Transformation](../../creation/transformations.md#reshape-an-event-from-footage). Watching a
reference to understand it and wiring a chosen excerpt into a request are two separate acts.

**Name the job the excerpt does.** There are two relationships:

- **Reference transfer.** The excerpt lends a temporal property (motion, camera behavior,
  performance rhythm, effect evolution) while the request creates new material. The packaged
  `@clipkin/seedance-kits/motion-reference` (`motion-reference-v1`: image 1 is the subject, video 1
  supplies body motion, gestures and pose dynamics) and `@clipkin/seedance-kits/camera-reference`
  (`camera-reference-v1`: image 1 is the subject, video 1 supplies framing, lens, movement and
  photographic rhythm) are written for this.
- **Strict source editing.** The supplied footage is the material being changed. Your direction
  spells out what is altered, and which parts of the motion, framing, timing or sound are kept.

One request may draw evidence from several materials, as long as each has a stated job. These are
relationships between model inputs, not distinct kinds of Clipkin project. An accepted result is
ordinary Media and goes through normalization, the Timeline and presentation like anything else.

**Choosing and connecting the excerpt.**

- Cut an excerpt that contains the useful action plus, where it matters, its wind-up or settling.
- Its length follows from the relationship you want to keep, the new duration you intend and the
  chosen model's reference limits.
- Connect the actual footage in Source. Describing it in words does not give the model its timing.
- The chosen model and Provider decide which input combinations and media formats are allowed. Their
  installed vocabulary and package docs define the precise request shape, reference metadata included (for Seedance, every image or video Reference needs `person-reference="true|false"`) and
  any duration or aspect contract for strict edits.
- Inspect the whole selected excerpt, not only its first frame.

**Long actions.** Keep two numbers apart: how much source footage a model will accept, and how much
it can generate in one request. Use a single request when the model allows it and the work's
continuity benefits. A forty-second fight may be several exchanges and reversals, or its unbroken
choreography may be the whole point. If separate requests suit the work, cut excerpts around
meaningful action or camera relationships and carry the target people, objects and world forward
with useful references. A literal boundary frame helps only when that exact continuity is intended;
most new passages do not need one. The accepted outputs define the target's real time. If unbroken
continuity is essential, use a capability that can deliver it, or explain what an edited
interpretation will change. When an accepted wordless action carries a passage,
[empty Segments](../../production/media.md#project-a-wordless-segment-when-its-identity-is-consumed)
let that material set its own time without word tokens.

How images carry identity and world from request to request is covered in
[Reference relationships](generated-dependencies.md). This page covers the separate decision of
giving a video request temporal evidence.

## Direct the reason for an action

Give each passage one clear expressive intention, then add only the few specifics that decide how it
lands. Begin with two relationships: how the speaker feels about the subject, and how they relate
to the listener. For example:

- eagerly passing a discovery on to a friend;
- testing a bold claim with skeptical curiosity;
- fondly roasting something they know inside out.

A direction like that implies voice, expression, posture and rhythm at once. Its value is the
playable relationship inside it.

The [two ideas behind image prompts](image-direction.md#two-ideas-behind-every-sentence) apply here
too: high-level language should carry sensory direction. A model can sustain "admiring but
incredulous" across a whole passage. Words like "lively" or "expressive" set a level of energy; the
speaker's particular reaction to the meaning gives that energy somewhere to go.

Find the thought in the Script that matters most and make its expression concrete. Ask: what
deserves a vocal accent, a change of face, a movement? Voice, expression and gesture can all reinforce
one response, using whichever channels make it readable. One revealing reaction can carry a thought
by itself; scripting every channel on every phrase is not worth anything for its own sake.

Paired with a Script that questions a price and closes on an ironic compliment:

```text
She is ranting to a friend, fondly exasperated at how overpriced this is. On the price, her
eyebrows shoot up and her open palm flips upward with an incredulous lift in her voice. The closing
compliment lands with a teasing smile you can hear.
```

The first sentence directs the whole encounter. The two specifics make the price and the ironic
turn unmistakable; everything else in the phrasing and movement can grow out of that attitude. Keep a
detail only if it sharpens a judgment, exposes a reaction or protects a physical relationship that
matters. Pinning a hand movement to every phrase adds choreography but not necessarily
expression.

**Develop or hold.** Let the thought decide whether the attitude shifts or stays put. An example
might win a doubter over; a firm argument might keep the same conviction start to finish. When
adapting a reference, work out what triggers each reaction and how it lands, then find the
matching thought in the new Script. That keeps the expressive relationship while letting the new
words ask for their own movements and phrasing. Emphasis at phrase level must fit the tones and
cadence of the language being performed; a stress pattern from the source language is not a
universal instruction.

**Across clips.** Carry the character, the voice and the useful physical relationships from one
generated clip to the next, but direct each passage's own attitude. As the argument moves, one speaker
may invite, then question, then tease, then persuade. Shared direction keeps their manner consistent;
each passage supplies its specific response. Keep production continuity, and rethink the expressive
intention whenever the thought changes. Steady framing leaves space for the face, voice and posture
to change.

## Give restraint an expressive purpose

"Serious" covers several attitudes: weighing a claim, pressing a fact, questioning an
assumption. A relaxed
person can tease, dismiss or show interest almost without moving. Pick the behavior that conveys the
attitude. A small, deliberate reaction often carries more conviction than constant motion.

A serious judgment:

```text
She takes the claim seriously but doubts it. Her brow tightens at the price; she leans on the
number with pointed emphasis, then seals her verdict with one small, decisive nod.
```

A languid response:

```text
He slouches back in the chair, entertained that anyone is impressed by this. He stretches out the
setup with a sidelong glance, then throws away the verdict in a light, dismissive tone.
```

These are two different intentions, not stock poses for every serious or relaxed character.
Breathing, blinking and small posture shifts provide ordinary aliveness; the speaker's reaction to
the content provides the performance. Direct that reaction even when the body barely moves.

**Turn contrast into an attitude.** "Contrast" names a relationship between things and leaves the
performer's attitude open. Convert it into something a person can play: "She tries to sound
composed but can't quite hide how proud she is of the result" gives voice and face one shared
direction.

**Humor needs a carrier.** It reaches the viewer through the words, the situation, a reaction or the
delivery. A deadpan performance can sharpen a clear joke with pointed emphasis or a dry turn of
phrase; an odd appearance does not make a flat explanation funny.
[Treatment](../../creation/brief.md#treatment-is-the-directors-answer) decides how the premise
becomes an experience for the viewer; action directs this person's share of creating it.

## Ground actions in the generated scene

The prompt describes what this generation should show over time. Give the performer physical
relationships with things that actually exist in the generated scene: the camera, other people,
props, parts of the set.

- **Graphics come later.** If a graphic will be added afterwards, express what it needs from the
  frame as camera view, gaze or gesture for the performer. The later Caption, icon or product card gets its own content
  and events through composition.
- **In-scene objects are real objects.** A prop or display meant to exist inside the generated scene
  can be described as that object and connected through its references.

**Speech and picture have separate jobs.** A speaker may talk about objects, quantities,
transformations or an imaginary demonstration while the camera only records them performing in the
referenced setting. Keep the words in Dialogue; use action to describe how the person responds to
those words. Quoting a phrase in the action can mark where a vocal accent or hand beat falls without
asking the model to turn its meaning into an object, label or event.

**The performer is the subject.** "She gives the promise a satisfied accent and a small nod" tells
camera and microphone exactly what to capture. Phrases such as "make the idea tangible" or "show
that it works" leave the model to invent how the demonstration happens. Finish that translation into voice, expression
or physical interaction before you write the request. Then read the assembled prompt as one account
of the scene. A blanket no-text instruction does not cancel an ambiguous invitation to act out the
spoken content.

**Figurative language gets taken literally.** Capable video models can turn a metaphor into a real
object, event or transformation. Use concrete, visible language for gaze, gesture, movement, camera
behavior and cuts whenever a figure of speech would put the wrong thing into the scene. Social
attitude and aesthetic shorthand stay useful when they direct the performance; an imagined object
or event belongs in the prompt only if it should really appear.

**Playable, not strategic.** Give the performer an attitude they can express, such as challenging a
claim with skeptical curiosity. The larger aim of persuading an audience belongs in Treatment;
translate it into this person's delivery and interaction. Decide whether a described action
actually happens or is only gestured at, and say which.
[Direction and its inputs](../../production/system.md#give-each-part-the-direction-it-can-realize)
ties these performance choices to the whole composition.

**Numbers and hands.** Natural emphatic gestures are far more reliable than asking fingers to show
an exact count. Let speech, Caption or MG state the quantity, and let pointing and hand movement
serve the performance.

**Encounters have edges.** Someone being interrupted can first be busy with something; someone
finishing can start to leave. Small causes like these make a clip feel like a slice of life rather
than a pose that starts and stops with the encoder.

## Prepare footage for subject isolation

When the piece needs a moving figure cut out from its background, pick a matting method that can
handle the actual footage.

- **New generation.** A continuous, evenly lit chroma backdrop can support the keying workflow you
  choose. Pick a backdrop color well apart from the person's hair, clothes and anything they hold.
  Direct how much of the body is visible, the performance and the steady backdrop as plain facts of
  this recording. This is a material-preparation decision for that specific use.
- **Existing footage.** Use a suitable matting capability instead: BRIA background removal
  (`@clipkin/bria-matting`, served by `clipkin.default`) takes sources of at most 60 seconds, so
  plan a longer performance as parts of 60 s or less and matte each.
  An opaque camera view can also stay useful through cropping and reframing.

Transparency in motion needs its own alpha-producing operation. A transparent still used as a
reference does not make the generated video transparent. Keep the original footage when the final
piece also uses its setting.
[Media preparation](../../production/media.md#keep-original-and-processed-material-explicit)
covers processing, alpha-preserving normalization and explicitly using those outputs. Judge the
moving edge against the background it will actually sit on: shoulders, hair, hands, color spill and
changes in opacity.

## Give each input its own responsibility

| Input | What it is responsible for |
| --- | --- |
| Character-and-scene references | How people and place look, the framing, and the physical state to keep |
| Product, interface or other factual references | Visible facts that need continuity or exactness |
| Source-footage references | Timing of performed, physical or camera relationships the new shot should follow |
| Recurring voice references | The speaker's voice identity, where the model accepts one |
| Script dialogue | Exact words, intended pronunciation and speaking turns for a visible performance |
| Prompt Kit or Recipe | A reusable prompt relationship suited to this kind of work |
| Passage direction | Attitude, vocal delivery, where attention goes, physical interaction, camera behavior, motivated cuts |

Keep every one of these responsibilities explicit in Source. Prose in a prompt does not create a
media edge, and a connected reference does not explain which of its facts to keep. A given model may
take only some of these inputs; its installed vocabulary and package documentation define the exact
request.

**Visible A-roll.** For an on-camera performance, the generated video normally carries the person's
picture, the exact Script delivery and the sound together. The request therefore gets three things: the
useful camera image, the recurring Voice Reference (if the model takes one), and the Segment's
dialogue. With the
`speaker` Kit, that means `@image1` is the speaker-and-scene view, `@audio1` the voice, `dialogue`
the Segment's `.dialogue` Text, and `action` the passage direction.
[Voice direction](voice-direction.md) covers the casting and sample that decide who the person
sounds like; the passage direction gives that voice its present attitude and delivery.
[Script pronunciation](../../creation/script-and-time.md#write-the-intended-pronunciation) explains
how names and abbreviations get the right reading while keeping their displayed spelling.
A-roll built on separately generated speech is another construction; see
[Voice and performance](voice-and-performance.md).

**Silent B-roll.** Direct the visual event and leave out any speaking identity the shot does not
use. A listener or reaction shot can stay silent and still breathe, notice, shift posture and react
through expression. How B-roll relates editorially to the underlying performance is covered in
[B-roll](b-roll.md).

## Choose the generation relationship

**Starting model.** Seedance 2 Mini (`model="mini"`) at `720p` is the usual first choice for
generated performances, a good balance of capability and cost. Still choose for the shot you intend
and for the model services the user has connected in their Runtime Profile;
[Model and provider](../../environment/model-and-provider.md) covers choosing and connecting them.
The selected model's installed vocabulary is the authority on resolutions, references and request
lengths, and the serving Endpoint can be narrower. Through the starter's `clipkin.default`,
Seedance renders 480p, 720p or (with a configured price) 4K but not `1080p`, and refuses every
image or video reference marked `person-reference="true"`; a Seedance Provider on a Profile-only
install refuses person references as well unless its host supplies authorized portrait assets. Plan
a presenter shot that must carry a person's image on a model the connected Endpoint serves with
references, such as MiniMax H3, or confirm the route with `clipkin plan` first;
[Model and provider](../../environment/model-and-provider.md#inputs-some-providers-refuse-until-the-request-changes)
lists the refusals and alternatives. Before committing, `clipkin pricing <run>` shows each request's price and the Run estimate
in credits; see [Builds](../../production/builds.md).

Video models usually offer some mix of three relationships. In `@clipkin/seedance` they are three
Surfaces:

| Relationship | Seedance Surface | Use it when |
| --- | --- | --- |
| Text-directed | `seedance:TextVideo` | The world and action do not depend on any existing visual identity, composition or motion reference. |
| First-/last-frame | `seedance:FrameVideo` | The shot must start, or end, on a specific authored image. |
| Reference-directed | `seedance:ReferenceVideo` with `seedance:Reference` children | Images, video or audio steer identity, world, voice, motion or camera language, but are not literal endpoints. |

Reference-directed generation is the strong default for controlled Clipkin production: good images
have already settled the people, scenes, products, composition and visual continuity, and the
requested performance sets that world in motion. Text-directed or first-/last-frame generation is
still right when its relationship is truly what the shot needs; a last frame belongs only when
reaching that exact image is part of the action. Reference transfer and strict source editing are
both uses of reference-directed generation, not extra invocation types or categories of finished
work.

**Kits implement the relationship; they are not the craft.** Model-specific Surfaces and Prompt
Kits are concrete implementations of these relationships. A Kit produces ordinary Text; Source wires
that Text and the real references into the chosen model request. Clipkin's distribution includes
`@clipkin/seedance-kits`, whose README owns the exact imports, slots, Recipe choices and reference
order:

| Import | Template | Relationship |
| --- | --- | --- |
| `@clipkin/seedance-kits/speaker` | `speaker-v1` | One visible speaker; `@image1` view, `@audio1` voice |
| `@clipkin/seedance-kits/broll` | `broll-v1` | Silent visual micro-story from ordered references |
| `@clipkin/seedance-kits/podcast` | `podcast-v1` | Two fixed host views with their voices |
| `@clipkin/seedance-kits/call` | `call-v1` | Main tile plus inset, reversed in image 2 |
| `@clipkin/seedance-kits/street-interview` | `street-interview-v1` | Interviewer, guest and shared setups |
| `@clipkin/seedance-kits/motion-reference` | `motion-reference-v1` | Subject image plus motion from video 1 |
| `@clipkin/seedance-kits/camera-reference` | `camera-reference-v1` | Subject image plus camera language from video 1 |

[Prompt Kits](../../production/prompt-kits.md) explains using or authoring a Kit without turning it
into a model wrapper.

Read the chosen template's actual wording before picking its Recipe values. Composition, camera,
edit rhythm, performance and gesture choices each shape a different aspect of the footage (in
`speaker-v1`: `composition-stability`, `camera-motion`, `edit-rhythm`, `performance`, `gesture`).
Pick them to support the intended delivery, and keep the passage's specific meaning and reactions in
the action Text.

## Direct camera and cuts as part of the passage

**Default for direct-to-camera social video:** pause-trim jump cuts at phrase boundaries. That cutting
pattern keeps the explanation moving and feels as immediate as a creator trimming their own
recording. A stable frame, expressive acting and frequent cuts all work together. Express this
through the Kit's documented Recipe choice; for `speaker-v1` that is
`edit-rhythm: pause-trim-jump-cuts` (the template falls back to `continuous-take` when the axis is
omitted).

**Other forms cut for other reasons.** A podcast can cut with whoever is speaking or to a meaningful
reaction. A street interview can favor the guest and cut to the interviewer for a reaction. An
action that unfolds, or a reaction that is held, may get its force from one continuous shot; choose
that temporal shape when the passage benefits.

**Requests, Segments and shots are independent.** One generated video can hold several shots,
several speaking turns or a split-screen layout. A Segment is not one speaker turn and not one camera
shot. In the other direction, one character-and-scene image can serve several generated clips that
join at natural edit points. A truly continuous shot needs the model relationship and direction
that preserve that action. Use [Reference relationships](generated-dependencies.md) to decide which
visual or motion evidence each request should be conditioned on.

**Several camera images in one request.** Where the model supports it, multiple camera images can
guide one request across different views or locations. Direct which people, settings and states
each image brings and how the passage moves among them. In this relationship the images guide the
footage; they become literal first or last frames only if you chose the first-/last-frame
relationship. Size the request from the intended performance and the model's supported durations and
reference inputs, not from a rule of one image per shot.

**A prompted cut is a request, not an edit.** Asking for jump cuts asks the generator for an edited
rhythm; nothing inspects or trims the returned media. When produced footage needs a guaranteed cut,
speed change or trim, apply the matching media operation before normalization and alignment. The
edited media, its local domain and its alignment remain separate facts.

## Size the request around the delivery

**Estimate the words first.** Run `clipkin estimate` on a spoken Segment at the pace it will actually
be performed, leaving time for meaningful interaction, pauses and actions:

```sh
clipkin estimate reference.reel --segment hook --pace fast
```

[Script and time](../../creation/script-and-time.md#estimate-before-choosing-durations) covers the
command, rounding, and how an estimate relates to the real aligned time. Pick the pace (`slow`,
`normal` or `fast`) from the intended performance, and carry that same pace into the voice and
passage direction. For brisk social delivery with trim cuts, `fast` is a good starting point; being
called `normal` does not make that pace right for every piece. A shorter duration squeezes the words,
but the direction can still give them the stresses, attitude and reactions that hold attention. The estimate sizes the words; emphasis, attitude and motivated reactions give the delivery
its character. The target's delivery decides how much generated media a passage needs. A reference
video's length helps explain its rhythm but does not automatically become the target duration.

**Fit the model's request lengths.** Read the chosen video model's supported durations from its
installed vocabulary. Those values limit a single generation request; they do not define the
finished work's Segment structure or its edited beats. When the estimate does not fit one request
neatly, reshape the performable passage rather than the meaning:

- a short question and its answer may belong in one request;
- a brief line may gain room for a meaningful reaction;
- a long exchange may split where its thought turns.

Keep the intended meaning and energy, then choose a supported duration.

**After production.** Normalized media gives the real envelope. When the composition needs word
positions, alignment derives them from the accepted performance. Compose the piece from that material
and any timing it requires. [Composition review](../../production/review.md) covers judging whether
Caption, MG, B-roll and the other layers sit well with the performance you produced.

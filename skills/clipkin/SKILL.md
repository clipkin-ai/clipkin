---
name: clipkin
description: Direct and produce videos with Clipkin — generated images, video and voices composed with authored components, from a brief, a reference video or supplied material. Covers Reel/Grade/Slate authoring, Builds and pricing, Studio review, and Runtime, Provider and credential setup.
---

# Clipkin

## Your role

The user is commissioning a video, and you are its director and producer at once. That means two
jobs that never separate:

- **Director:** decide what the piece should be — its argument or story, its casting, its look, its
  rhythm — and be ready to defend that decision.
- **Producer:** get it made — material generated, components written, Builds run, cost agreed, the
  finished file watched before it is handed over.

Clipkin leans toward **creating** what a piece needs rather than settling for what happens to be
lying around. Image, video and voice models give you the people, places, voices and performances;
project components give you the graphic systems; the engine binds both into one work in which
meaning, time and space agree. Material the user supplies is not automatically footage to cut in:
decide first whether a given recording is something to learn from, a performance worth keeping, or
a standalone picture or sound.

Your voice in the conversation matters as much as the files. Speak the user's language. Be warm and
concrete. Report what you are discovering while you discover it — a timing trick in the reference, a
casting decision, why a reveal will land on a particular word — and say what is running when a step
takes time. When you need a decision, frame the question so the actual choice is obvious. Adopt the
temperament the video calls for, whether that is dry wit, tenderness, social savvy, understatement or
gleeful nonsense, while staying observant, imaginative and honest underneath it.

Some decisions belong to the user, not to you: what they ultimately want, private facts, which
accounts to connect, any large download or machine setup, and money. Everything else you settle, and
once settled it goes into the work and the project notes.

## How a Clipkin piece is built

Hold this model in mind; every reference page assumes it.

- **One Timeline, one Canvas.** Each work has a single finite Timeline and a single Canvas.
- **Media brings its own clock.** Prepared media keeps a local domain and Extent. Projectors carry
  local evidence (a spoken word, a beat) onto the Timeline through equal-length absolute Windows; the
  evidence itself never becomes Timeline content.
- **Several things can set time, as equals.** Semantic alignment to speech, musical beats and events
  you author all produce absolute times.
- **Clips are explicit.** Visual Clips and Audio Clips place ordinary media through stated Windows
  and sampling choices.
- **Time and space are open.** A Timeline can contain speech, silence, overlap or nothing but
  animation. The Canvas can hold independent layers or one coordinated scene with its own tree.

[System relationships](references/production/system.md) lays out the whole organisation and how
materials and execution attach to it.

**Components.** Draw a component's boundary around behaviour that is shared: things that move and
lay out together belong in one scene; things that merely coexist can stay separate. Prefer an
installed component when it already behaves the way you need; write a project component when the
relationship is new — writing a single-use scene is perfectly normal. Keep three questions apart:
*who owns this* (organise by responsibility), *what should be adjustable* (expose only real directing
choices) and *will this be reused* (generalise only for real reuse). A fixed, control-free scene is
fine, but its speech-linked events still enter as semantic inputs rather than hidden constants. Read
[Component design](references/production/component-design.md) before starting any new visual system.

**Meaning sets the clock.** In anything carried by a performance — talking heads, pure A-roll, short
drama — write the meaning into the Script and let the accepted take decide the timing, with or
without motion graphics. When recreating a reference, ask what each cut, image, reveal and sound is
*answering*, then rebuild that answer around the new words. Selections hold explanations and
comparisons; Moments hold answers and payoffs. Because the presentation hangs off meaning, it follows
automatically when wording or delivery changes. Authored animation instead gives each message, reveal
and state change its own reading pace: durations govern how things unfold, semantic anchors pin what
belongs to speech, and one piece can mix the two.

**Footage is evidence before it is input.** Use a passage of reference video as a model input only
when the new material has to inherit continuous motion or timing that words, stills or components
would lose. [Video direction](references/playbooks/craft/video-direction.md#let-footage-carry-temporal-behavior-that-matters)
decides this and separates *studying* footage from *feeding* it to a model.

**A-roll** is whichever performance carries a passage. Its normalised Extent may define the
Timeline and its local domain may project meaning; after that, its picture and sound are ordinary
media. Put the picture on screen through a Visual Clip or a project scene and the sound through an
Audio Clip, each with an explicit absolute Window and sampling. What leads the frame is a creative
choice for each idea — a hard cut and a continuous move are both valid. Spatial grouping and timing
are independent, so a whole scene can react to one Moment while separate components share the
Instant that Moment reveals. See [Voice and performance](references/playbooks/craft/voice-and-performance.md)
for the role and [Visual Clips](references/production/visual-clips.md) for the mechanics.

## The workflow

These phases overlap and repeat; return to any of them when new evidence changes an earlier call.

### 1. Locate the job and prepare only what it needs

Start from the request and the most useful next result. Pin down the reference and the change being
asked for, find the project — the [project files](references/creation/project-files.md#establish-the-project-boundary)
define what belongs to this commission, while the Skill and executable only tell you where tools
live — and say what can begin immediately. The Skill and the
[executable](references/environment/distribution.md) provide authoring tools only; no model account
or generation credit comes with them.

Once the material plan takes shape, explain in plain terms which capabilities it needs and which
services could supply them. Every model capability runs through a Provider that the Runtime Profile
binds to an account: in a hosted Clipkin workspace those accounts are already connected by the
platform; on the user's own install, generation can be billed to their Clipkin account with one
personal key ([Connect a Clipkin account](references/environment/model-and-provider.md#connect-a-clipkin-account)),
or the user stores their own vendor keys (the starter Profile
routes every generation model — images, video, voices, word timing and background removal — through
one Replicate token; ElevenLabs, Fish Audio, MiMo, Volcengine and the other direct vendors are added
only when the work needs them). Picking a service and
storing its credential are two distinct steps. For the decision, the connection steps and the public
SDK, read [Models and Providers](references/environment/model-and-provider.md); keep using any
service the user already chose wherever it can serve.

**The example projects predate the Replicate starter.** The podcast, interview and ranking-football
examples (and the image and voice examples drawn from them) use Fish Audio voices and Seedance person
references, which the starter does not serve. Learn their structure, direction and reasoning; take the
model choices from this Skill instead (Qwen3 or MiniMax voices; no person references on Replicate).

Measured speech timing comes from word-level transcription — hosted, or local WhisperX — and is what
lets picture changes follow speech. Someone talking on screen does not by itself require it; a face
or motion swap, for instance, usually doesn't. Before standing up a new local inference service,
compare the setup still ahead with simply using a hosted one —
[service selection](references/environment/model-and-provider.md#choose-the-practical-capability-path-with-the-user)
covers how. Configure routing in the [Profile](references/environment/profile.md) and prepare only
the helpers this production calls for. Treat "installed", "selected", "prepared" and "running" as four
separate facts, and read a Profile-wide readiness report through the lens of the current job. When
downloads or model loading are the bottleneck,
[local preparation and network routes](references/environment/local-tools.md#make-network-preparation-practical)
explains how to read the evidence and weigh caches or mirrors. Anything not blocked by setup —
studying the reference, writing components — can proceed in parallel.

### 2. Understand the reference, then decide the new piece

Read the reference whole first: what should a viewer feel, learn or decide by the end, and how does
the piece get them there? Then take each visual system apart — content, position, entrance,
movement, persistence, exit — and see what word, action or neighbour it is tied to. Expect close
reading to change your idea of the whole. [Reference understanding](references/creation/reference-video.md)
shows how to switch scales; for spoken references, use grids keyed to the transcript and adjust their
range, interval and cell size as your questions sharpen.

Write the whole-piece explanation into **Analysis** and the timed observations with their meaning
into **Timeline** as you go. Describe each behaviour by the concrete states and transitions that
create it, follow it through the piece, reuse the description when it recurs, and update it when
new evidence disagrees. Show the user what you are finding — frames, a word-labelled grid, a specific
discovery — and what direction it points to; detailed evidence stays in the files.

The **Brief** records what the user wants; the **Treatment** records your creative answer. An
adaptation may replace a person, object, setting, script or sound while keeping a recognisable event,
so rethink argument, performance, imagery and graphics for the new request. The original explains
what works; the newly accepted performance sets the new timing.

### 3. Direct the material

Directing material is knowing how generation models respond to words and references; composing is
arranging what they produce into meaningful behaviour. Give each part only the instruction it can
act on: picture, framing and performance go to the generated material, while later graphics get
their content, placement and events through components. Style and attitude remain useful wherever
they describe how material should look, sound or act —
[Direction and its inputs](references/production/system.md#give-each-part-the-direction-it-can-realize)
draws the line.

In creator-style social video, put effort into casting, an appealing voice and a clear stance toward
the subject and the viewer; humour, contrast and surprise must be something the audience can actually
see and hear.

These pages contain tested findings about specific models. Open them **before** writing the
corresponding request, including when you inherit a prompt or Recipe from earlier work:

| About to… | Open first |
| --- | --- |
| write or revise an image prompt | [Image direction](references/playbooks/craft/image-direction.md) and the Prompt Kit you chose |
| choose, design or change a voice | [Voice direction](references/playbooks/craft/voice-direction.md), then [Voice and performance](references/playbooks/craft/voice-and-performance.md#choose-between-visible-and-audio-only-a-roll) for the speech package (Qwen3 design → clone by default; MiniMax for other languages or emotion control) |
| write a video prompt, performance Recipe or action, or decide whether footage should guide it | [Video direction](references/playbooks/craft/video-direction.md) and the selected Kit's wording |

Copy the relevant finding into the actual prompt, using the examples to judge how strongly and where
it applies. For A-roll, B-roll, Caption, motion graphics or sound questions, the matching Craft page
gives judgment and model choice, while installed vocabulary, Kits and package docs give exact
Surfaces, wording, inputs and limits.

**Quality is decided here.** Considered image and performance prompts, Script pronunciation, voice
references and reference relationships settle the material's quality while you author the requests.
After generation, treat the assets as the production's raw material and refine how they are arranged.

### 4. Compose and review

With Script, prompts, references and target durations settled, submit the generation work the user
agreed to, and keep building components, Recipes and semantic arrangement while it runs. Plan shared
framing in the Treatment; judge real overlap of picture and graphics only once actual media exists.

Compose around the directed material and the Outputs you already have, locating each passage by its
authored events (for speech, by the Script and whatever semantic timing is actually consumed). Look at
motion graphics, Caption, B-roll, Typography and Effects together in the real frame:
[snapshots](references/production/snapshots.md) for exact states and continuous grids, Studio
playback for a passage with sound. Aim for graphics that clarify, Captions that read effortlessly,
and images and effects that arrive exactly when they help — a comparison you can parse, a reveal that
lands on its word, B-roll covering the explanation it illustrates. Fix problems in the Source or
component that owns them and reuse finished media through Run Candidates. Change the Treatment when
the design must change, and the Brief only when the user's goal does.

If the user can open Studio, show them a representative passage early and keep the real Run around
for discussion. When the piece is close, open its Comments page and point out both modes: timestamped
notes in Comments, or the Studio timeline with the component's exposed controls. Reviewing in the
browser and exporting a file are separate steps; an explicit export request already decides
delivery. [Working in Studio](references/production/studio.md#discuss-the-work-while-composing)
links that review to the component's authored choices.

### 5. Deliver

Watch and listen to the actual deliverable and hold it against the Brief, the Treatment and the
reference relationships that matter: performance, sound, clarity, hierarchy, timing, character and
whether it is ready to publish. A browser review can settle composition before export; an encoded
file still gets inspected itself. Explain the key choices and any limits, and when the user can reach
[Studio](references/production/studio.md#show-the-finished-work), show them the editable production
next to the video so they can see how it is put together and what they can change.

## Rules that always apply

- **Money needs an agreement.** Before anything is charged, settle which account pays, which work is
  covered and the expected cost or budget. `clipkin pricing <run>` quotes every request and adds a Run
  estimate — vendor cost, price in credits, the hold reserved before the Build — and
  `clipkin usage <build>` shows what was really metered afterwards. Write the agreement into the Brief
  and apply it to all covered transcription, generation and processing; anything outside its scope,
  cost or accounts goes back to the user. Having a connected account is access, not permission to
  spend. Details: [Builds](references/production/builds.md#work-within-the-agreed-paid-scope).
- **Reuse is explicit.** Continuations carry finished work forward; new adaptations start from the
  reference and the requested changes. Weigh old material against the current Brief and Treatment,
  keep what still serves through explicit Run Candidates, and leave unrelated selections alone. Even
  failed Builds can hold useful Outputs. `plan` shows what still needs to run, and nothing crosses
  between Builds without being selected —
  [Authoring](references/production/authoring.md#reuse-produced-work-explicitly) shows how to pick the
  Output that keeps material while allowing the edit.
- **A Build is one attempt.** If a watching terminal closes or times out, check Runtime status before
  assuming anything — leaving `--follow` only stops watching. After a failure, carry surviving Outputs
  into a new Run and a new Build. See
  [Builds](references/production/builds.md#continue-after-a-failed-attempt).
- **Secrets stay in stores.** The Profile chooses Credential Stores and references; Endpoints declare
  their slots and acquisition. Use `clipkin auth` and the store's own setup, and report only whether a
  credential is configured.
- **Separate seeing from interpreting.** Record what a frame, tile, clip or transcript actually shows,
  label your reading as a reading, and leave unobserved claims open — or look again if the answer
  would change the work.
- **The files are the memory.** Analysis holds the whole-piece reading, Timeline its timed
  realisation, Brief the user's goal, Treatment your answer, Progress the open question, what is left
  to check and the next step. Keep them current enough that a fresh conversation could pick up from
  them plus the Sources, Runs, Results and Runtime status.
  [Project files](references/creation/project-files.md) defines each document and a layout.
- **Respect ownership.** Leave unrelated Sources, Recipes, Runs, assets and project packages as they
  are; change things where they are owned; never edit Result media; put new visual behaviour in
  project components. When execution breaks, investigate and repair through the
  [integration guidance](references/environment/model-and-provider.md), and explain any material change.

## Where the current question is answered

Several pages often apply at once. Open what the work needs now, and come back when a preview or
Result raises the question again. Package vocabulary and package READMEs remain the source for exact
attributes, APIs and model limits.

**Orientation**

| Topic | Page |
| --- | --- |
| Which production page owns a question (expression, material, time, space, presentation, delivery) | `references/production/index.md` |
| The overall model: materials, components, authored relationships, execution | `references/production/system.md` |
| Recognising a known format, mixing formats, finding other Craft pages | `references/playbooks/index.md` |

**Setup and services**

| Topic | Page |
| --- | --- |
| Installing or updating the executable and Skill; reusing tools and produced work | `references/environment/distribution.md` |
| Picking model services, connecting accounts or deployments, rate cards and metering, writing a project Model or Provider | `references/environment/model-and-provider.md` |
| Profile selection and edits, credentials, bindings, capacity, when changes apply | `references/environment/profile.md` |
| Local media tools, browsers, WhisperX, helpers, caches, mirrors, logs | `references/environment/local-tools.md` |

**Creation**

| Topic | Page |
| --- | --- |
| Reading a reference video or link | `references/creation/reference-video.md` |
| Pinning down the target and the user's request | `references/creation/brief.md` |
| Swapping a person, object, world, performance, script or sound; blending references | `references/creation/transformations.md` |
| Wording, pronunciation, performable passages, semantic links, measured delivery | `references/creation/script-and-time.md` |
| Project layout, resuming, handing over an editable production | `references/creation/project-files.md` |

**Directing craft**

| Topic | Page |
| --- | --- |
| Generated people, settings, products, B-roll stills, camera views, image references and prompts | `references/playbooks/craft/image-direction.md` |
| Designing or adapting a voice, its appeal and casting sample | `references/playbooks/craft/voice-direction.md` |
| Generated video, footage-guided action or camera, visible speech, silent action, cuts, durations | `references/playbooks/craft/video-direction.md` |
| Who carries a passage, voice continuity, covered performance, narration, supplied speech; which speech package (Qwen3, MiniMax, or a declared ElevenLabs / Fish Audio / MiMo) | `references/playbooks/craft/voice-and-performance.md` |
| B-roll and material-led pictures: sources, role, composition, handoffs | `references/playbooks/craft/b-roll.md` |
| Screen demos: real UI evidence, captured interaction, illustration, guiding attention | `references/playbooks/craft/screen-demonstrations.md` |
| Caption grouping in Chinese, English or mixed scripts; rhythm, style, placement | `references/playbooks/craft/captions.md` |
| Captions that follow a speaker's head (seen in the reference or requested) | `references/playbooks/craft/caption-tracking.md` |
| Boards, cards, diagrams and MG laid out with material: hierarchy, area, palette | `references/playbooks/craft/graphic-compositions.md` |
| Effects and MG in motion: states, actions, handoffs, persistence, rhythm | `references/playbooks/craft/motion-graphics.md` |
| Which generated assets should depend on which references (people, places, views, props) | `references/playbooks/craft/generated-dependencies.md` |
| Balancing performance or B-roll sound with music and effects, ducking, continuity | `references/playbooks/craft/sound-mix.md` |

**Authoring language**

| Topic | Page |
| --- | --- |
| Writing Sources, Recipes and Runs; reusing produced work; adding a component | `references/production/authoring.md` |
| Imports, output references, literals, Recipe rules | `references/production/source-syntax.md` |
| `<script>` syntax: display vs speech, spacing, grouping, Roles, Cues, attributes, marker affinity | `references/production/script-syntax.md` |
| Prompt Kits: choosing, assembling, authoring | `references/production/prompt-kits.md` |
| Run syntax, Targets, Candidates, Run Fragments, media reuse | `references/production/runs.md` |
| Placing components in time: semantic bindings, clock positions, offsets, durations, edit effects | `references/production/timing.md` |
| Timeline end, Instants, Windows, Extents, gaps, overlap, pure MG | `references/production/timeline.md` |
| Content ownership; composing visual and audio contributions | `references/production/tracks.md` |

**Media and presentation**

| Topic | Page |
| --- | --- |
| Admitting and reusing media, model references, normalisation, local domains, NarrativeAlignment, trims, variants, cutout footage (BRIA background removal, up to 60 s per source) and transparency | `references/production/media.md` |
| Independent images, prepared video or surfaces; source playback; when a component is needed instead | `references/production/visual-clips.md` |
| Independent music, narration, ambience, effects; gain, silence, fades, source blending | `references/production/audio-clips.md` |
| Caption Styles per speaker or passage, overrides, hiding captions | `references/production/caption-presentation.md` |
| A caption style asked for by name (Ticker, Neon, Highlighter…), or a ready-made look to start from | `references/production/caption-styles.md` |
| Canvas, Frames, aspect, fit, crop, coordinates | `references/production/spatial.md` |
| Fonts, local font files, multilingual text, Emoji, Typography | `references/production/fonts-and-text.md` |
| Compositing, correcting, resizing, cropping or cutting out an image | `references/production/image-operations.md` |
| Downloading a video from a link | `references/production/video-downloads.md` |
| Capturing a site, recording a page interaction, exporting an HTML graphic | `references/production/browser-capture.md` |
| Choosing an installed Surface versus writing a project component | `references/production/vocabulary.md` |

**Components**

| Topic | Page |
| --- | --- |
| Component boundaries, behaviour, semantic events, author controls | `references/production/component-design.md` |
| Drawing elements, animation, resources, prepared surfaces | `references/production/component-visuals.md` |
| A project Track with new layout, semantic events or persistent state | `references/production/track-authoring.md` |
| A Caption family with new word relationships, scheduling or layout | `references/production/caption-authoring.md` |
| Timeline Items, picture selection and controls for Studio | `references/production/studio-companions.md` |
| Sharing a component, Kit, Model or Provider between projects | `references/production/component-sharing.md` |

**Execution and delivery**

| Topic | Page |
| --- | --- |
| `plan`, `pricing` and the Run estimate, `build`, retries, interrupted submissions, following, Results, exports, `usage` | `references/production/builds.md` |
| Studio before export: Comments, timeline, parameters, timestamped feedback, interface language | `references/production/studio.md` |
| Film assembly, authored-time MG, final render, frame intervals | `references/production/rendering.md` |
| Exact frames or paged grids of an existing production, without rendering | `references/production/snapshots.md` |
| Judging a preview or Result and choosing fixes | `references/production/review.md` |

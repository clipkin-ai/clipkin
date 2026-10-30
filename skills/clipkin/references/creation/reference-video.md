# Understanding a reference video

Open this page when a video or link serves as evidence for what the new work should keep, adapt or
learn from. What you are after is a semantic reading at the level of timecodes: what the piece is
saying, and how its precise picture and sound choices get that across.

If the reference arrives as a link, [video download](../production/video-downloads.md) covers
`clipkin download`, its explicit `clipkin download prepare` step, and the saved file the tools below
work on.

## Read the whole through its details

**First pass: the whole.** Watch from the first frame to the last. Track the hook, the argument or
story, where attention shifts, the payoff and the reaction the piece wants from its viewer. Read the
spoken words against their times. Note who carries the performance, what the pictures add, and which
Caption, MG, Typography, Effect and Audio systems stay on screen or come back. End the pass with a
provisional explanation of why the piece works.

**Then read meaning through realization.** Every designed element deserves a concrete account:

| Aspect | What to pin down |
| --- | --- |
| content and look | what it shows, its style |
| space | where it sits relative to everything else |
| entry | how and when it arrives |
| active behavior | what it does while present |
| persistence and exit | how long it stays, how it leaves |
| anchor | the word, pause or action it serves |

Then say what that choice does for the viewer: introduces a person, sets two claims against each
other, stacks up proof, amplifies a reaction, makes a process followable, or passes attention to the
next idea. The meaning tells you where to look closely; the close look gives you the detail you need
to recreate the effect. Looking closely also turns up purposes and links the first impression missed.
An interpretation is only useful if it explains the concrete choices, and an observation only becomes
creative understanding once it connects to what the piece is trying to do. Develop the two together
for the whole reading.

**When something puzzles you, widen the frame.** Relate it to the words around it, events nearby,
earlier appearances and later consequences. Ask what those links might explain, then examine the
relevant stretch. Read the Format or Craft page for the relationship you are investigating; it will
sharpen your question and help you recognize what the reference is doing.

**A name for a motion is only where the description starts.** When they make the effect distinctive,
look at its path, the change in scale or opacity, the pace, any overshoot or settle, and how it sits
against neighboring events. Read a graphic's hierarchy, type, palette and spacing in terms of what the
viewer must take in first and compare next. Find the single coherent behavior that links the frames
you observed, including the details that make each state and transition work. For example, a fainter
duplicate during an exit may just be one object fading out; check the sequence before concluding
anything.

**Whole and detail keep correcting each other.** When an object is still there after a camera cut,
it is part of a system with a longer life than the shot. Follow its state through the piece: a new arrival might
replace an item, add to a collection, or cover something temporarily. Describe the system once and
mark its changes in time. Cuts are useful for navigating; meaning and continuity decide what belongs
together.

**Talk while you read.** As you look closely, tell the user what the timing, placement or motion you
found does for the viewer and what it suggests for the adaptation. Show representative frames or a
word-labeled grid when that makes the relationship easy to see. Bring a provisional reading into the
conversation and then say how new evidence deepens or overturns it. Putting the connection into words
also exposes where your explanation is still thin. The files hold the detailed evidence; the
conversation lets the user follow the interpretation as it forms and add their taste. Routine
progress does not need a fresh approval.

**Aim for an account that can become an editable production.** Sometimes a still screen image is all
the evidence a passage needs; a comparison that changes also needs its arrivals, states and
handoffs. Capture what the objects do together, not only how each one looks. Many implementations
could produce the observed behavior, so there is no need to guess the original author's code or
component structure. What you are building is an explanatory model for this commission: which
relationships should survive a change of person, product or wording, and which choices need
redesigning. Write down the observed behavior before deciding how the target will implement it. A
picture, text and motion working together may become one component; repeated appearances may turn
out to be states of the same object.

Cover the entire reference and give each distinct system and its changes a concrete account. Behavior
that repeats can share one explanation, with its variations and handoffs placed in time. Use what you
have already established to drive direction and composition while you keep working on the open
questions, and park those questions at their source times so the next viewing can sharpen them.

## Make time visible

### Transcribe spoken references

For a reference with speech, run `clipkin transcribe`. Its words and word-level times are a strong base
for following the argument and linking speech to cuts, illustrations, reveals and emphasis. Store the
transcript next to the reference and read its wording in light of the surrounding argument, names
visible on screen and context the user gave you. A few transcription mistakes do not stop you from
understanding what a passage means.

Always name the spoken language: `--language en` for English, `zh` for Chinese, `ko` for Korean,
`es` for Spanish, and so on. Which languages actually align depends on the service the Runtime
Profile selects; for local execution, prepare that language's resources as
[local tools](../environment/local-tools.md) describes. Chinese speech that contains English brand
names is still `zh`. Its individually timed Chinese characters let you locate a phrase precisely;
group them into meaningful phrases when you describe the reference and write the new Script.

To weigh local preparation against a hosted path for this transcription, see
[service selection](../environment/model-and-provider.md#choose-the-practical-capability-path-with-the-user).

The spelling the recognizer (WhisperX locally, or a hosted transcription service) writes down is its
guess at the audio. Invented words and unfamiliar names are especially likely to come back
substituted, so a spelling difference alone proves nothing about how the word was pronounced. Use the
transcript to recover content and find moments. For the new work, the
[Script's pronunciation](script-and-time.md#write-the-intended-pronunciation) states the words and
readings the generation request should perform.

For a reference without speech, locate meaning through the actions and changes in the scene.

### The local media toolkit

`clipkin media` works locally, with no Runtime Profile, network request or project state. Pick the
subcommand that fits the scale of the question:

| Subcommand | Use it to |
| --- | --- |
| `probe` | read duration, streams, size, frame rate and whether audio is present |
| `cut` | save one stretch (or joined stretches) as a clip |
| `frames` | extract chosen instants, or a range at an interval, as individual images |
| `tile` | lay out one time-labeled grid, optionally with words |
| `tiles` | page a dense range into several grids |
| `boundaries` | list candidate abrupt visual changes worth a look (mechanical scores, not shot labels) |

To study motion closely, `frames --every-frame` and `tiles --every-frame` keep every original frame
in the interval. Each interval is decoded once, continuously, then paginated at the cell size you ask
for; real source timestamps are kept, so variable-frame-rate footage stays honest. `tiles --ranges`
visits several intervals in one call, and `--transcript` puts their words alongside.

```bash
clipkin media tiles references/promo/source.mp4 --start 4.2 --end 5.9 --every-frame \
  --columns 4 --rows 3 --cell 480 --transcript references/promo/transcript.json \
  --to references/promo/evidence/badge-motion
```

To look at the production you are composing rather than the reference,
[snapshot](../production/snapshots.md) captures its current picture straight from Studio or compiled
HTML. Line the comparison up by what the event means, then study the actual frames. Coarse and fine
readings keep informing each other: understand the whole, nail down the particular behavior, then
revisit the whole with what you learned.

### Steer the grids by the argument

For spoken references, let the transcript's phrases and word times guide which grids you make. Pass
`--transcript` so the words sit beside the frames, and use `--around` to target the phrase whose
picture change you want to understand.

Keep retuning the range, the sampling interval and the cell size as the question changes:

- **widen** the range to follow an argument or a persistent system;
- **narrow** it and sample more densely to trace an entrance, a change or a handoff;
- **enlarge** the cells to read typography or spatial detail.

These are zoom levels of one investigation. Switch levels as soon as a detail alters your
explanation, or the explanation sends you looking somewhere else. A long reference can be read passage by passage
as long as you keep its overall development in view.

A sample only proves what is on screen at its own instant. A coarse overview can skip a brief event
even when neighboring samples look the same. Follow the words and visual systems through those gaps
at a density that accounts for each entry, change, persistence and exit; a handful of stills cannot
give you that temporal account.

```bash
clipkin transcribe references/promo/source.mp4 \
  --language en --to references/promo/transcript.json

clipkin media tile references/promo/source.mp4 --start 0 --end 10 --every 1 \
  --transcript references/promo/transcript.json \
  --to references/promo/evidence/opening.jpg

clipkin media tile references/promo/source.mp4 --start 4.2 --end 5.9 --every 0.1 \
  --transcript references/promo/transcript.json --columns 4 --cell 480 \
  --to references/promo/evidence/badge-change.jpg

clipkin media cut references/promo/source.mp4 --start 4.2 --end 5.9 --label-time \
  --to references/promo/evidence/badge-change.mp4

clipkin media frames references/promo/source.mp4 --at 4.3,4.8,5.4 --label-time \
  --to references/promo/evidence/badge-frames
```

Time labels mark positions in the input media, so give `--transcript` the transcript of that same
media; its word times use the same clock. Words are printed beneath each picture, leaving the
original Caption and MG visible. Keep worthwhile evidence in `evidence/` under names that make it easy
to reopen the question it answers.

To examine a spoken phrase, replace `--start`/`--end` with
`--around "the phrase" --transcript references/promo/transcript.json`. `--padding` adds time on each
side (0.3 s by default) and `--occurrence` picks one instance of a repeated phrase. For a dense
sequence, `tiles` with `--columns` and `--rows` pages it into readable grids. Keep the range wide
enough to see the handoff coming in and going out. Every `--to` destination must be new; the commands
refuse to overwrite.

**Caption deserves its own pass.** Inspect each meaningfully different configuration (speaker
treatment, placement, emphasis, Cue shape, animation) and the transitions between them. Repeated uses
of one behavior can share a description, with their differing content and times noted.

**When two readings disagree,** reopen that source interval and make the contested detail legible.
Keep what is visible or audible separate from what you infer it means. Player controls and other
viewing chrome belong to the viewing surface, not to the designed video.

## Preserve a connected account

Write the understanding into the project while it forms. Record the overall explanation as well as the
close reading, including source times and evidence paths, so someone else could pick up from the
files alone. Next to how a choice looks, record what it does for the viewer.

**`ANALYSIS.md` holds the whole-piece model:** the goal the piece pursues, the way its story and
pacing operate, what each visual or sound system adds, which systems persist or return, and how
distant moments connect. Write so a reader can tell the reference's facts apart from your
interpretation.

**`TIMELINE.md` holds the realization you can locate in time.** Divide it into sections titled by
source time and a meaningful phase. In each, connect whatever is on screen, and exactly how it
behaves, to the words or actions it serves. A good entry lets someone find the event, understand how it is
expressed, and build a fitting counterpart. For example:

```md
## 4.18–5.92 · The proof stacks up

The voice lists "faster / cheaper / quieter". On each adjective a stamped badge drops onto the
product photo and the previous badge slides down to make room, so the three stay visible as a
growing column. The speech Caption moves to the top edge for this passage so it never covers the
stack.

Badge and word land together; each badge overshoots slightly, settles, and stays until the column
clears on the cut to the price card. Shrinking gaps between badges make the case feel overwhelming.
See the 4.2–5.9 clip and badge-change grid for the handoffs; word times are in transcript.json.
```

Sections may overlap, and dense stretches can carry finer timed notes. A persistent title, board,
sound bed or Caption system can run across several sections: refer back to the same system and
describe what changes. Keep exact text, significant colors, positions, motion phases and timings
wherever someone needs them to understand or rebuild the design, and reopen the media for any fact
still in doubt.

Name roles by their function. A-roll is the semantic performance even when it sits in a small inset
or behind full-frame B-roll. Caption shows the speech; Typography carries writing that stands on its
own. MG and UI can contain their own text. One sound can support a continuing argument across several
picture changes. Use the role names that make this particular work clearer.

## Turn understanding into new direction

When the new piece clones the reference shot for shot, start from `clipkin shots` and follow
[cloning right the first time](clone-checks.md): it measures the reference, the cheap material and
the draft, each before the step it protects.

Source seconds tell you where the evidence is. Record them together with the expressive relationship:
a reveal resolves a question, a picture illustrates a phrase, an exit clears space for the next claim,
or the next speaker's audio starts under the previous picture.

How those relationships live on in the new piece depends on the user's request. A different person or
product can change the argument, the copy, how many examples there are, graphic content, placement
and duration. Think the adaptation through with [transformations](transformations.md). In the target
Script, name meaningful spans as Selections and events as Moments; their timing then comes from
whichever performance is accepted. [Script syntax](../production/script-syntax.md) defines that language.

For generated camera imagery,
[image direction](../playbooks/craft/image-direction.md#two-ideas-behind-every-sentence) turns what
you observed into a coherent styling and scene direction carrying the decisive details the target
needs. The reference notes keep the observations those choices rest on.

For the designed picture, [component design](../production/component-design.md) turns the target's
relationships into useful objects, parameters and events. One system may span several shots, and one
shot may contain several independent systems; set new component boundaries by shared behavior, with
the detail needed to realize it.
[Direction and its inputs](../production/system.md#give-each-part-the-direction-it-can-realize)
links the overall creative design to its separate material and composition instructions.

The finished account should explain the piece from start to end and make every distinct visual system
and its changes findable in time. Make it specific enough to steer the new work: what to keep
or adapt, how it is expressed, and why it belongs. Keep digging into any unexplained relationship
that could change that direction.

Put the current question, the passages or systems still to examine, and the next useful action in
`PROGRESS.md`. Get discoveries into Analysis and Timeline promptly, and rewrite those accounts
whenever your reading shifts. On resuming, read these files and reopen the source at the
recorded times. The user's goal stays in the Brief and your new design in the Treatment.

If the adaptation depends on a performed, physical or camera relationship that unfolds over time,
keep a useful excerpt of the source as temporal evidence for
[reference-directed generation](../playbooks/craft/video-direction.md#let-footage-carry-temporal-behavior-that-matters).
The analysis explains why it matters; the excerpt itself can pass that behavior to the model.

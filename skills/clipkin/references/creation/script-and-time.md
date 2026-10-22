# Script and semantic time

Open this page when you are settling the target's wording, its pronunciation, how it divides into
performable passages, and which meanings the picture and sound should follow. It also covers
estimating how long delivery will take and passages with no words.

Neighboring pages own the details:

| Topic | Owner |
| --- | --- |
| exact authoring forms of `<script>` | [Script syntax](../production/script-syntax.md) |
| projecting Script identities into the work | [Timing](../production/timing.md) |
| imports, references, Recipes and Runs around the Script | [Source syntax](../production/source-syntax.md) |
| the consumers of Script meaning | [Tracks](../production/tracks.md) |
| local temporal domains, gaps, overlaps, and declaring the whole work (including pure MG with no Script) | [Timeline authoring](../production/timeline.md) |
| connecting real footage to a Segment | [Media preparation](../production/media.md) |
| targeting material and reusing produced media, domains and alignment evidence | [Runs](../production/runs.md) |

## Script is the target's sole verbal authority

`<script>` holds the words the target video will speak, and nothing else of that kind: no reference
timecodes, media, visual Style parameters, prompts or Provider decisions. A semantic word attribute
such as `really{emphasis}` may tag a word's role for a Caption family. The Brief may keep required
claims and the Treatment may describe what a passage is for, but the adopted wording exists in exactly
one place: the Source.

Pick the Script structure from the thought being expressed and the performance that carries it:

| Construct | What it says |
| --- | --- |
| **Segment** | a passage someone can perform, built around one thought with its delivery and action; accepted media may be aligned to it, yet the two never merge into a single semantic-media object |
| **Role Cue** | who speaks a turn; the label travels into the model's dialogue |
| **Dual Text** | one authored unit with separate display text and spoken text |
| `\|\|` | this on-screen **Caption Cue** hands off to the next one after a complete Alignment Unit |
| **word attribute** | an authored role on one displayed word, for a Caption family |
| **Selection** | the span of meaning an element serves, e.g. a demo covering an explanation, or a comparison held through a claim |
| **Moment** | an event such as an answer or a verdict, where graphics, sound or effects can respond together; the consuming component decides how the resulting state continues |

```reel
<script id="story">
  <hook>
    <HOST> @{verdict!} Our new @{proof}<SDK | S D K> || ships really{emphasis} tonight.@{/proof}
  </hook>
</script>
```

Reading this example:

- The viewer sees `SDK`; the performer receives `S D K`. Together they form one indivisible Alignment
  Unit.
- `||` closes the first on-screen Caption Cue right after that unit, so the next Cue opens on `ships`.
- `proof` stays a single semantic range across the Cue break; `verdict` is a semantic point other
  layers can respond to.
- `really{emphasis}` marks one displayed word for the Caption family without adding timing.

**Think of a Cue as a block of on-screen speech with its own timing, not as a text line.** The Caption family and its Recipe
may wrap that block across one or several lines, reveal or highlight its words, and give it an
entrance, an exit or a handoff. Segment boundaries and Role turns already separate Cues. A Caption Use
window can switch Style partway through a Cue while keeping its content and original word times. Reach
for `||` only when one Segment, one turn and one Style still call for an extra intentional reading break. How the
picture, the language, the family and the Recipe shape that decision belongs to the
[Caption craft](../playbooks/craft/captions.md#design-cue-rhythm-with-the-caption-system).

[Script syntax](../production/script-syntax.md) owns the exact forms, the display and speech
projections, spacing, grouping and marker affinities. Use them to express the choices above.

## Write the intended pronunciation

Decide pronunciation while you write, not afterwards. When a coined name, an unfamiliar brand or an
abbreviation needs its reading directed, use Dual Text: the display side keeps the spelling, and the
spoken side gives the performer an unambiguous form. Spell that form out in the performed language as
plain words, syllables or the names of letters. Familiar word sounds, phonetic respellings and
homophones all make an unfamiliar name's sound concrete while the display spelling stays untouched.

Leave ordinary spelling alone when it already conveys the intended reading; for example, English names
in Chinese speech do not need a phonetic stand-in by default. Choose the reading that suits this
language and this character, and keep whatever display spelling the user chose.

### Choose the sound the spelling should carry

The rows below show authored pronunciation choices. They are not results verified on every model. The
last column is the literal text that reaches `.speech` or appears inside `.dialogue`:

| Intended reading | Script fragment | Caption shows | Spoken text |
| --- | --- | --- | --- |
| the letter S, by name | `<S\|ess>` | `S` | `ess` |
| CSS as three letter names | `<CSS\|see ess ess>` | `CSS` | `see ess ess` |
| an abbreviation spelled out as separate letters | `<SDK\|S D K>` | `SDK` | `S D K` |
| SQL said as the word "sequel" | `<SQL\|sequel>` | `SQL` | `sequel` |
| a coined name given familiar syllables, when "zoo no" is the reading you chose | `<Zuno\|zoo no>` | `Zuno` | `zoo no` |
| a name given a chosen Mandarin homophone | `<Lumi\|露米>` | `Lumi` | `露米` |

Three different choices are easy to confuse: naming the letters, sounding the letters, and saying an
acronym as a word. `ess` names the letter S; it is not a request for a long hissing /s/. `sequel` is
one particular reading of SQL; if the character should spell it out, write the letter names instead.
Phrase the whole expression naturally rather than forcing a pause between every letter or syllable.

**Phonetic notation.** IPA or similar notation can help a model that understands it, but Script
passes the written form through literally. It does not interpret IPA and offers no phoneme-control
API. The spoken projection also drives duration estimation and semantic preparation, so pick a
spelling that this production's speech path can actually use. A model's own pronunciation feature, if
it has one, belongs among that model's documented inputs.

**Keep reading aids and instructions apart.** A reading aid such as `ess` belongs on the spoken side.
A prose instruction ("pronounce this as…") belongs in performance direction if it is needed at all,
never among the words the character is asked to say.

### Carry the chosen reading through the work

```reel
<script id="story">
  <setup>
    <HOST> Sign in through the <SDK | S D K>.
  </setup>
  <recap>
    <HOST> The same <SDK | S D K> runs on mobile too.
  </recap>
</script>
```

A Dual Text pair covers only the occurrence it wraps. Repeat the chosen spoken form at every
occurrence of the name, in every Segment, so performances generated separately all get the same
direction. The model receives the right-hand wording via the Segment's `.dialogue`, while Caption shows
the display spelling. Settle all readings before you estimate durations and request performances.

The same split makes numbers and names in Chinese copy precise. `今年<2026|二零二六>年` keeps the year
compact on screen while specifying how it is spoken; `只要<¥19.9|十九块九>` picks a casual way of saying
a price. Choose the spoken form for the meaning and delivery of that sentence. Estimating the Segment
with `--language zh` then counts the spoken side, including syllables hidden behind a compact numeric
display. Caption keeps the authored simplified or traditional characters; transcription supplies
timing and never rewrites the displayed Script.

## Choose performable passages

**One Script, three projections.** A Segment's `.dialogue` goes to a speaking video prompt and
includes Role labels plus chosen pronunciations. `.speech` carries pronunciation without Role labels,
for duration estimation and speech-only requests. The Caption view keeps the display wording. Because
all three come from the same Script, editing the words never means updating a separate prompt or
subtitle file. For how to reference each projection, with a dialogue for two
speakers, see [Script projections](../production/script-syntax.md#use-the-scripts-deliberate-projections).

**Passages without speech** are also Script:

```reel
<script id="story">
  <product-detail></product-detail>
</script>
```

The Segment's name is yours to choose (`empty` is just as ordinary a name as `product-detail`, which
has the advantage of saying what the passage is for). Having no words does not mean having no
meaning: the Segment keeps its identity, and normalized media attached to it can supply its local
duration. If some consumer has to see that identity mapped onto the real media, a NarrativeAlignment
with an empty unit array can still map the Segment's boundaries; merely declaring the Segment does not
demand an Alignment. Wordless passages and whole pieces built from prepared media use the same
Timeline and Track timing vocabulary. The empty tag declares neither a zero-length interval nor any
duration.

For an interval made purely of component animation, use Timeline placement and extent instead; no
media-backed Segment is needed. Spoken passages, wordless media passages and graphics-only passages
can all live in one work.

**Where to draw Segment boundaries.** Let natural production passages and delivery length decide;
picture cuts do not.

- A single Segment rendered as a single generated clip may hold several turns of speech, several
  camera cuts, or a conversation shown in split screen.
- A narration that runs without a break can host many B-roll changes by way of Selections.
- Edited UGC may intentionally stitch several generated clips that all start from one
  character-and-scene image; the natural cut is often part of the charm.
- A Role change or a `||` never by itself calls for another generation.

When retained recorded speech carries the passage, cutting the file changes the performed material
but does not create a Segment. Several retained stretches can make one passage, and different passages
may each get their own performance clip. Script the words as they were finally performed, and if
something downstream needs to know where those words fall, align the prepared result on its own
local clock.

## Timing for authored animation

**Speech-led graphics follow what they explain.** Keep that relationship in the Script: a reveal
belongs to its Moment, coverage belongs to its Selection. Then, if the argument is rewritten or the
performance changes, the design moves with the target's real timing. Reference seconds document what
you saw; the target Script expresses what the new graphic follows.

**Some pieces are drawn entirely by components:** a chat animation, a diagram, kinetic type. Their
messages and state changes still carry meaning, and you decide when the audience receives each one and
how long it needs to be read. In Source, keep the content next to the named time
values that drive it. An event can have an identity like `question` or `reveal`, which either a Timeline child or a
free-standing `time:Instant` can produce, with no invented speech and no media-backed Segment. The film's time comes
from a `time:Timeline` with an explicit end;
the form is shown in
[composition and rendering](../production/rendering.md#compose-an-authored-animation).

**Choose where timing comes from relationship by relationship; there is no single global choice.**

- A spoken Moment can open a chat scene whose messages then arrive at authored intervals.
- An authored animation can reveal a single item on a spoken Moment: have the Narrative projection
  publish that Moment as an absolute Instant.
- If the design wants a lead or a lag, derive a separately named `time:Instant` with an explicit
  offset and hand that result to the component.

What triggers an event and how long its entrance takes are separate decisions. `at={answer}` locates
the answer; giving the arrival ten frames is what gives it a particular feel.

## Estimate before choosing durations

When an A-roll performance is new or rewritten, its time comes from the target's words, delivery and
action.
The reference timeline still helps you understand rhythm and relationships, but the new performance
fixes their actual timing. Identical words can run longer or shorter with a different speaker or
delivery.

`clipkin estimate` is the creation-time front end to `@clipkin/speech-estimate`. It counts pronunciation
units and estimates the seconds they need at a chosen language and pace, entirely locally:

```bash
clipkin estimate productions/launch/authors/script.reel --segment setup --language en --pace normal
clipkin estimate --text "You expect me to log every lunch?" --language en --pace normal --rounding ceil
clipkin estimate productions/launch/authors/script.reel --segment zh-offer --language zh --pace fast --rounding round
```

| Option | Choice |
| --- | --- |
| `--pace slow\|normal\|fast` | match the intended delivery: conversational explaining often suits `normal`; brisk, tightly cut social delivery often suits `fast` |
| `--rate <units/s>` | set the rate directly (the CLI always prints the effective rate) |
| `--language auto\|en\|zh\|ja\|es` | `zh` for Chinese copy, even with English product names in it |
| `--segment <id>` | estimate a Segment from the spoken side of its Dual Text |
| `--padding <s>` | reserve extra time for a reaction, demonstration or held pause |
| `--rounding none\|round\|ceil` | `none` keeps fractions for early estimates; `ceil` rounds up to a whole second; `round` takes the nearest |

Counting rules: for Mandarin, each Han character counts as roughly one syllable, and any English mixed
in is counted by syllable; for English, syllables are counted rather than words. The rate already includes ordinary phrasing pauses;
`--padding` is only for time beyond that. Most video requests take whole seconds, so settle the final
literal by weighing the selected model's allowed values against the performance you want.

**Keep delivery density coherent.** Related performances should share a speaking density. An
energetic performer can still give a dense explanation room to breathe. Counting pronunciation units
across the reference's spoken passages suggests a candidate rate; adjust it for the target's
language, terms and actions. After rounding each request, check the resulting density: forcing
each line into the briefest duration the model allows can leave the whole piece sounding hurried.
Note the rate you chose, and any deliberate padding, in the production's direction so that later
Segments apply the same decision.

**Let the estimate shape the passage.** A very short line might belong with the reply that follows,
might deserve slightly fuller wording, or might leave room for a meaningful action. A long passage
might work better trimmed, or divided where the thought naturally turns. Keep the meaning and
energy, find a shape that can be performed, and estimate the changed wording again.
[Generated video direction](../playbooks/craft/video-direction.md#size-the-request-around-the-delivery)
applies this to the selected model's request range.

**What the estimate is not.** It balances speaking density and sizes the generation request; it provides
no anchors on the timeline. After you accept a generated clip, normalize it and build an equal-length Timeline
Window from its real extent. If Caption, B-roll, MG, Effects or anything else needs word positions,
align the real speech against its Script Segment, then carry that evidence through the
domain/Window relation. The duration literal settles "how many seconds of media should I ask for?"; Alignment answers "where did
the words fall in the accepted media?" It does not reproduce the estimated spread of words, and it is
unnecessary when nothing downstream consumes word positions.

For a wordless Segment, choose the request duration from the action, the music or the visual rhythm.
Speech-rate estimation plays no part; the resulting media still sets the Segment's span.

## Bind meaning to Script identities

When a picture, Caption treatment, MG state, sound or effect belongs to spoken meaning:

1. author a Selection or Moment in the Script;
2. reveal it through an explicit Narrative Projection declaration;
3. pass the resulting named Window or Instant to the consumer.

For design that is genuinely clock-based or has no speech, declare a named time directly.

Pick every anchor for the event it names, and decide which side a pause belongs to. Adjacent B-roll
Selections can meet exactly, one ending where the next begins; a held reaction can take in the quiet that
precedes the next word. [Marker affinities](../production/script-syntax.md#bind-meaning-to-script-identities)
encode these decisions using word and structural edges, and [Timing](../production/timing.md)
covers turning identities into named Instants or Windows, adding intentional offsets, and the
effect of a later Studio edit.

Reference archives keep original seconds and say which original words or events an item serves. In the
target, the Source states the intended relation in terms of the target Script, and once the target's real audio
is aligned, the Timeline supplies its frames. Never copy a reference timestamp into the target, and do
not preserve an incidental lead or lag unless that offset is itself part of the design.

## Connect reference understanding to audiovisual composition

A timing problem you notice in Studio or a real Result can have several different causes. Fix it where
the fact is owned:

| Symptom | Where the fix goes |
| --- | --- |
| a wrong Cue or semantic anchor | Script |
| a performance whose rhythm departs from the intent | the duration choice, or the Treatment |
| a correct Selection rendered badly | the component or Recipe |
| an unusable generated clip | its prompt, reference, Candidate or shot design |

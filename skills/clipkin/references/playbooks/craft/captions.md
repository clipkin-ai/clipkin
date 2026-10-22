# Caption craft

A Caption is the spoken line shown while it is being said. What makes something Caption is its role:
it carries the words of the performance and stays in step with them. Size, ornament and position do
not decide it. A huge animated word that tracks the delivery is still Caption. A heading that keeps
showing a phrase long after it was spoken, to name a section, is Typography even though the words were
once heard. Classify by the job the text does in the work.

Caption does not have to match a raw transcript letter for letter. Script's Dual Text lets display and
pronunciation differ on purpose: "2012" on screen and "twenty twelve" in the voice are still one
authored verbal unit. Text that is not the spoken line (independent titles, lower thirds, labels,
editorial paraphrases) belongs to its own Text or MG component, not to Caption.

**Pronunciation forms.** For coined names or words read letter by letter, use
[Script pronunciation](../../creation/script-and-time.md#choose-the-sound-the-spelling-should-carry):

| Script form | Screen | Voice | Use it when |
| --- | --- | --- | --- |
| `<CSS\|see ess ess>` | `CSS` | "see ess ess" | the display spelling needs an explicit reading |
| `<New York\|>` | `New York` | same words | display and speech match but should be one complete unit |
| `<\|再见>` | nothing | "再见" | the words are performed and keep their anchors, but stay out of Caption |

These forms settle content and correspondence only. How that unit looks is up to the Caption family.
Put `||` between complete units wherever you want a further reading handoff.

Related guides:

- Building a new visual family: [Caption authoring](../../production/caption-authoring.md). It keeps the
  shared text and timing chain and shows which parts the new family schedules and renders itself.
- Picking Chinese, Latin or mixed-script faces, using a local font file or finding a new face:
  [Fonts and text](../../production/fonts-and-text.md).

## Direct captions for this video

Study what the reference's captions contribute before copying their look. Ask how they group the
speech, how they push an idea forward, how they mark who is talking and how they sit around the
picture. Carry over the relationships that serve the new Brief. A different language, performer,
product or tone can justify a new face, grouping, position or motion. Decide that treatment from the
meaning of the new Script and the feel of the video, then write the decision into Treatment and its
Recipe.

There is no correct Cue length or single correct caption look. A quick handoff can sell a punchline;
a longer held phrase gives an explanation room. Either works if the viewer can take in the thought
and still watch the picture. Let the reference, the language and the energy you want inform the call.

Decide three things together while keeping each one in its own place:

1. **The reading phrase** - what shares one screen state (Script `||`).
2. **The layout** - how that phrase sits and wraps (Style). A meaningful phrase can wrap to two lines.
3. **The emphasis** - what responds to the voice (Style). A line can stay fully visible while the
   word being spoken changes color.

Hiding captions during a demonstration is a presentation change. It does not alter the Script or the
recorded speech. The sections below tie these decisions to the actual frame.

## Keep wording and timing in their owners

Each fact has exactly one owner:

| Fact | Owner |
| --- | --- |
| Display words, speaking Roles, Dual Text units, word attributes, authored Cues | Script (`||` closes the current Cue). Its CaptionDocument holds no seconds or frames. |
| Where each Unit falls on the real Timeline | A source-domain adapter, which emits complete, flat Unit CaptionTiming |
| How Cues look and when they show | The visual family, which joins that timing to the authored Cues |

When you want a spoken phrase to take an unusual shape, reuse these units inside a Caption family. Do
not retype the spoken words into a free-standing Typography component just because it can draw the
shape.

Align against the produced performance's normalized audio. Anything that changes that audio (its
speed, its cuts, a re-take) can move word times, so realign after such a change. A purely visual
restyle can keep the same semantic and media outputs and reuse them through the Run.

## Design Cue rhythm with the Caption system

A Cue is one timed block of displayed speech. Keep the four boundaries apart:

| Boundary | What creates it | Effect |
| --- | --- | --- |
| Segment or speaking turn | Script structure | Always starts a new Cue |
| Extra handoff inside a turn | `\|\|` in Script | Starts a new Cue within the same Segment and turn |
| Style change mid-Cue | A Caption Use | Changes presentation; the Cue keeps its full content and original word times |
| Visual line break | Fine's wrapping | Splits one Cue across lines; no `\|\|` needed |

The family and Recipe decide what a Cue block looks like; `||` only decides where one block hands off
to the next.

Group by reading the language and the picture at once. Aim for each Cue to hold one coherent phrase
or idea that a viewer can absorb while still watching the performer. Words that depend on each other
for meaning stay together. When the visual treatment benefits from separation, give a payoff or a
contrast its own handoff. Do not split, when doing so makes either screen state harder to read:

- a name;
- a negation and what it negates;
- an article and its noun;
- a preposition and its object;
- a phrasal verb;
- a quantity and its unit.

### Language changes the reading unit

The smallest timed display unit depends on the writing system. In English it is normally a word; in
Chinese it is a single Han character. That gives Chinese very fine highlighting, but a Cue should
still carry a whole meaningful phrase, so a Chinese Cue usually holds more characters than an English
Cue holds words. Size the Cue from meaning, reading time and the room the real font takes up. A fixed
count of words or characters cannot make that judgment for you. When Dual Text is involved, measure
fit using the display side.

| Writing | How to group and present |
| --- | --- |
| English | Hold a useful phrase together with its articles, negation, name or quantity. Because word lengths vary a lot, the face and the available width matter more than how many words there are. |
| Chinese | Keep compounds, names, and modifiers with what they modify together. A short complete clause can share one Cue if it fits; a string of tiny character groups breaks up both the sense and the screen. |
| Korean | Keep the word spaces the author wrote and keep grammatical phrases readable as a group. `3개월` and `3 개월` are two different spellings; layout follows whichever the Script uses. |
| Mixed Chinese and English | Judge the phrase as a whole. A Latin brand name or a number can be as wide as several Han characters, so counting lexical units will not predict width. |

Fine keeps the separators the author wrote, in any script. `word-gap` sets the width of those
separators; a boundary between Chinese and Latin text, or between a digit and a letter, does not
invent one. To keep a space, write `是的 就是这样`; to keep text together, write `3D` or `3개월`.
Glyph tracking is a separate control, `letter-spacing`. `<expression|>` is for grouping an
expression's caption behavior; you never need it to protect spelling or spacing.

### Choose emphasis independently of grouping

One set of unit timings can drive several treatments: a steady complete Cue, color on the current
word or character, or a trail of everything said so far. Choose by the viewing rhythm you want:

- A steady phrase lets the viewer read the line while studying a detailed demonstration.
- An active-word response draws the eye to the delivery itself.
- A whole-expression response gives a name or punchline a single accent.

Even when the design keeps the phrase still, character-level timing stays available underneath.

Highlighting recipes (Fine):

| Effect | Settings |
| --- | --- |
| Highlight the whole current character or word | `karaoke: current` with `karaoke-transition: step` |
| Keep already spoken units highlighted | `karaoke: trail` with `karaoke-transition: step` |
| Sweep color through the glyphs | `karaoke-transition: wipe` |
| No color response; phrase stays steady | `karaoke: off` |

`step` switches the complete timed unit on at its start; `wipe` is a different look that fills inside
the glyphs. Both follow each unit's own speech time, so uneven delivery and pauses show up faithfully.
Lengthening a Cue changes what is read together; it never changes a character's timing.

**Grouping an expression.** When a compound, name or short phrase should react as one, write it as
`<组件化|>` in Script. The empty spoken side inherits the displayed words. Fine's whole-unit `step`
highlight, active underline and active box then span the group from its first spoken sound to its
last, while each character still keeps its own Timeline anchors. Grouped and ordinary characters can
mix inside one Cue. Reserve this for deliberate whole-expression treatment; there is no need to mark
every Chinese word. Grouping never creates a Cue; `||` is still the only reading handoff.

**Appearance is separate from color.** Whether text appears and whether it changes color are two
different controls:

| Appearance | Setting |
| --- | --- |
| Whole Cue readable at once; Karaoke supplies emphasis | `atom-reveal: all` |
| Each spoken unit appears as it starts | `atom-reveal: on-start` |
| Whole graphemes type on within each unit | `atom-reveal: typewriter` |

A pronunciation span like `<API|A P I>` is one shared timing unit, so all its display words switch on
together. Keep that span tight around the expression that needs the pronunciation hint, so the Chinese
characters around it keep their individual timing.

### Choose line layout for the picture

A single-line treatment gives a run of short Cues one stable place to be read. You get it by tuning
phrase grouping, font size, usable width and spacing together. When a full thought needs more room,
Fine can flow that one Cue onto additional lines. An oversized keyword laid out independently with smaller
supporting text is a different structure; build it as a new Caption family. Pick the structure for the
picture and the meaning. A visual line break is never, on its own, a reason to add `||`.

These excerpts keep short ideas together in three languages:

```reel
<explanation><HOST>
  One reference can rebuild ||
  the shots and pacing, ||
  the captions and effects, ||
  around your product.
</explanation>

<explanation-zh><HOST>
  一张参考图 || 就能重新设计镜头和节奏，||
  让字幕和特效 || 为你的产品服务。
</explanation-zh>

<explanation-ko><HOST>
  참고 영상 하나로 || 촬영과 편집의 리듬을 바꾸고, ||
  자막과 효과를 || 제품에 맞출 수 있어요.
</explanation-ko>
```

They are alternative Scripts for separate versions, not one bilingual performance. A different width
or delivery could justify different handoffs. The sentence provides the semantic structure; the
presentation decides how much of it sits on screen at once.

Fine's optional `max-words-per-line` breaks rows by counting display units, which for Chinese usually
means characters. Leave it unset for normal width-based flow, and set it only when a deliberately
counted row helps the design. `max-lines` validates those counted rows and only works together with
`max-words-per-line`; it cannot squeeze a long Cue onto one physical line. The
`@clipkin/caption-fine` README is the authority on these controls.

## Give captions a place in the visual language

Treat font, size, width, line height, contrast and motion as one decision. When a Cue overflows, find
out why before fixing it: the cause can be the authored grouping or the Style, and they need different
fixes. Lead, tail and handoff govern when the Cue is visible; Karaoke always follows semantic word
timing.

Judge weight, outline and shadow on real glyphs over the moving picture at delivery size:

- A heavy outline can give energetic captions their silhouette and separation.
- A tight shadow can separate a calmer treatment.
- As weight increases, check that the counters and gaps inside dense glyphs stay open.
- The right strength depends on font, size, background and intended style, and must be rechecked when
  the language changes.

Text and decoration can share a palette without giving every word its own color. A two-tone accent
under a steady phrase, a shaped backing or an offset shadow can tie Caption to the film's look. Use an
existing Style if it already expresses that link; otherwise author the matched text and decoration
together in a project Caption family. Make the decoration's size, position and movement respond to the
text it supports.

Compose Caption with icons, flashes and other graphics as one picture. A guest's color and an answer
accent can cooperate without every system using identical colors. Check that captions read over both
light and dark frames, that they do not cover the key face or product, and, above a tracked head, that
there is room for the whole Cue and not just its anchor point.

Normal Caption placement comes from the family's layout and Style. It can hold a fixed reading zone or
adapt to the composition, with no face boxes involved. Use the optional
[Caption tracking](caption-tracking.md) relationship only when the user's reference visibly has
captions following a head, or the user asks for it. A face being on screen is not a reason by itself.

## Caption families, Styles and parameters

Script publishes a single `CaptionDocument`: display words in order, complete Alignment Units, speaking
Roles, word attributes and the authored Cue handoffs. Caption binds that document to the real Timeline.
This shared, typed relationship is what defines Caption; the official renderer does not. A project
package can supply its own Caption family that consumes the same Script words and the same measured
speech evidence.

Direct the presentation at three levels:

| Level | What it settles |
| --- | --- |
| **Family** | The structural visual language and scheduling the Caption can express: uniformly flowing words, separately arranged phrases, shapes attached to speakers, or some other authored relationship. |
| **Recipe and resolved Style** | One coherent treatment inside the family. A Grade Recipe collects a useful combination of settings; the family's Style Surface resolves it against fonts and other explicit resources. Role or Selection applications choose between Styles. |
| **Parameters** | The single settings within a treatment, such as anchors and placement, wrap behavior and usable width, type, boxes and Paint, how the active word responds, reveal, Cue motion, and the lead, tail and handoff envelope. |

The installed family's vocabulary is the authority on exact parameter names and allowed values (run
`clipkin vocabulary @clipkin/caption-fine`). This page is about how a combination serves this picture and
this reading rhythm. Keep a treatment that worked in production in the project's `.grade`. When the user names one of
the gallery styles, or wants a ready-made look to adapt, start from
[Named caption styles](../../production/caption-styles.md). A set that
has proven itself across several works can be published as a normal, versioned data package in its
owner's scope; that keeps family, Recipe and intended use together instead of promoting isolated values into
universal defaults.

Caption Uses decide when each Style applies, optionally filtered to one speaker. When the presentation
changes partway through a phrase, the Cue's content stays whole.
[Caption styling and coverage](../../production/caption-presentation.md) covers overrides,
Segment-wide selections, word attributes and hiding chosen captions with a Hidden Style.

## Reuse Fine or author a new family

For UGC, podcast and interview work, `@clipkin/caption-fine` is usually enough. Its explicit Style
Recipes cover exact fonts, anchoring and placement, wrap, Cue boxes, the active-word look, motion, and
lead/tail. Role-filtered Uses can tell podcast hosts apart, and a tracked head can feed a moving
placement point without touching the verbal pipeline.

```reel
<caption-fine:Caption id="captions" document={story.caption} timing={story-captions}
  timeline={speech.timeline} within={vertical.bounds}>
    <caption-fine:Use style={primary-caption}/>
    <caption-fine:Use role="GUEST" style={guest-caption}/>
  </caption-fine:Caption>
```

This fragment assumes the Source already imports the Surfaces and declares the fonts, the Styles
(`caption-fine:Style`) and the `story-captions` timing (`narrative-caption:Timing`). Check current
Recipe fields in the package README and with `clipkin vocabulary @clipkin/caption-fine`. Every speaker and
Style should read from one interpretation of the Script; giving speakers different colors never calls
for separate transcripts or separately invented timings.

Think of Fine the way you think of Media for ordinary pictures: a general, reusable component, not the
only option. A new visual relationship can go straight into a project component. A Caption family might
arrange a phrase around its keyword, place two speakers' lines in one shared layout, or treat words and
graphics as a single visual event. The authored meaning travels in word attributes and Selections; the
family decides how that meaning looks and moves. Writing such a family is normal video authorship, even for a
treatment used in a single work.

Component boundaries are equally flexible. Captions that behave independently can stay on their own
peer Track. When words and graphics share layout or motion, one component can own both, reading the
common Caption document and semantic timing. "Caption" names the bond between displayed speech and its
performance; it does not demand a separate visual layer or the Fine renderer.
[Caption authoring](../../production/caption-authoring.md) walks through building such a family or
scene.

## Review in the current composition

Check captions where they actually live:

- **Frames.** Take [snapshots](../../production/snapshots.md) from Studio or the existing HTML to look at
  real glyphs, spacing, outline, decoration, wrapping and the states just before and after.
- **Playback.** Play the passage in Studio with sound to judge reading rhythm, emphasis, Role assignment,
  behavior across cuts and tracked movement.
- **Export.** When delivering a file, inspect the encoded output as well.

The current composition provides this evidence while the Run keeps its accepted media and semantic
Outputs, so a caption-only fix needs no regeneration.

Diagnose before changing anything. Too many tiny handoffs make the viewer keep re-finding the text; an
overloaded block asks one screen state to do too much.

| Symptom | Fix |
| --- | --- |
| The reading unit itself is wrong | Move or add `\|\|` |
| The reading unit is right but size, wrap, placement or motion is off | Change the Style |
| The relationship you want cannot be expressed by Fine | Build a project Caption family |

Afterwards, confirm the treatment holds up at the real speaking pace and over the real picture,
including how each Cue enters and leaves.

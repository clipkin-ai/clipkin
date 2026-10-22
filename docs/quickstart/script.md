---
title: Script
description: Write the words of a video once, and mark who says them, what the captions show and which moments the picture follows.
---

Every Clipkin video starts from its words. The `<script>` element is where they live: the voiceover,
each speaker's lines, and the places the picture should react to. It is plain prose with a little
markup. There are no timestamps, file names or styles in it. Voices, captions, B-roll and graphics
all read from the Script, and they find their timing later, once the voice has been recorded or
generated.

```reel
<import from="@clipkin/script@1"/>

<script id="story">
  <hook>
    <HOST> Your product videos don't need an editor anymore.
  </hook>
  <demo>
    <HOST> Describe the video, and the agent builds the cut.
  </demo>
</script>
```

Importing `@clipkin/script@1` makes `<script>` available. The `id` (here `story`; it is `script` when
you leave it out) is the name other parts of the project use to read from this Script.

## Split the words into Segments

A Segment is one part of the video, such as the hook, the demo or the call to action. You open it
with a lower-case name of your choosing and close it with the same name. The order you write them
in is the order they are spoken.

```reel
<script id="story">
  <hook>
    Three seconds. That's how long you have.
  </hook>

  <beat/>

  <offer>
    Start free today.
  </offer>
</script>
```

- **The name is the Segment's id.** It starts with a letter and uses only lower-case letters, digits,
  `-` and `_`, up to 64 characters. Each name is used once per Script, and `script` is reserved.
- **Segments sit side by side.** One Segment can't contain another, and every word must be inside a
  Segment. A Script needs at least one.
- **A self-closing Segment** such as `<beat/>` marks a place in the structure with no words in it.
  It doesn't add a pause or any length of its own.

To use one Segment elsewhere, refer to it by name: `{story.segment.offer}` for the Segment itself,
`{story.segment.offer.dialogue}` for its text with speaker names, and `{story.segment.offer.speech}`
for the words alone.

## Say who is speaking

For more than one voice, start each line with a Role Cue: the speaker's name in angle brackets.
A Role Cue has no closing tag. The line runs until the next Role Cue or the end of the Segment.

```reel
<interview>
  <MAYA> How long did the launch video take?
  <LEO> About ten minutes, start to finish.
</interview>
```

- **A Role Cue only labels the line.** It doesn't pick a voice or create a character; that happens
  where the voices are generated.
- **Names** can use letters in any language, digits, `_`, `.`, `-` and spaces, up to 32 characters:
  `<HOST>`, `<Voice over>` and `<진행자>` all work.
- **Within one Segment,** either every line has a speaker or none does. Words that come before the
  first Role Cue of a Segment are an error. Different Segments can make different choices.

The same Script gives each consumer the text it needs:

| What reads it | What it gets for the example above |
|---|---|
| **dialogue** (prompts that need to know who speaks) | `MAYA: How long did the launch video take?`<br>`LEO: About ten minutes, start to finish.` |
| **speech** (voice generation) | `How long did the launch video take? About ten minutes, start to finish.` |
| **caption** (on-screen text) | `How long did the launch video take? About ten minutes, start to finish.` |

The captions come from `{story.caption}`, a caption document holding the displayed words, how they
line up with the spoken words, and where each caption ends. It holds no seconds or frames; those
are worked out from the recorded voice.

## Show one thing and say another

Sometimes the screen should read differently from what is said: a name spelled one way and
pronounced another, a number written as digits, a filler word you want heard but not shown. Write
both in one pair of angle brackets: what to **show** on the left, what to **say** on the right.

```reel
<intro>
  <HOST> Meet <Clipkin | clip kin>, your video agent.
</intro>
```

| Reads | Gets |
|---|---|
| **caption** | `Meet Clipkin, your video agent.` |
| **speech** | `Meet clip kin, your video agent.` |

The two sides don't need the same number of words. Clipkin treats the pair as one unit, so the
caption for "Clipkin" stays whole while the voice says two words.

**Said but not shown.** Leave the left side empty:

```reel
<HOST> I was < | um> saying it works.
```

**Shown and said the same way, kept together.** Leave the right side empty. `<Clipkin Studio|>` is
spoken exactly as written, but the captions treat it as one unit, so a caption style can highlight
it as a whole. Each word still gets its own timing. This is useful for names and for phrases in
languages without spaces, such as `<组件化|>`. You don't need it to protect ordinary words.

Rules for pairs:

- The spoken side must contain at least one word. `<API|...>` has nothing to speak and is an error.
- Pairs can't be nested.
- Punctuation right after a pair joins the shown word: `<AI | A I>.` displays as `AI.` and is
  spoken as `A I.`
- Markers for Selections and Moments (below) go on the spoken side: the right side, or the left
  side when the right is empty. Write `\@` to show a literal `@` on the left.

## Choose where captions break

By default the caption style decides how to group words on screen. Write `||` to end the current
caption at that point, for example to keep a punchline on its own:

```reel
<HOST> Three seconds. || That's how long you have.
```

A break needs words before it, can't go inside a show/say pair, and doesn't change the timing.
A new Segment or a new speaker always starts a new caption, and line breaks in your source don't
create caption rows.

### Spaces and characters

Captions show your spacing as you typed it, so `3D` and `3 D`, or `是的 就是这样` and `是的就是这样`,
stay different. Several spaces in a row become one, and the spaces at the start and end of a line
are dropped. Markers add neither text nor space: `是的@{part}就是这样@{/part}` stays joined.

Punctuation never gets a timing slot of its own; it rides with the word next to it. English is
timed word by word. Chinese characters, Hiragana and Katakana are timed character by character, so
a sentence without spaces doesn't become one giant word.

## Tag words for caption styles

Put a tag right after a shown word, in braces, to give a caption style something to work with,
such as a brand name to color or a word to emphasize:

```reel
<HOST> Edits that used to take a day{stress} now take minutes{stress,highlight}. Try Clipkin{brand}.
```

- A tag on its own (`{brand}`) means "on". A value is written `{size=1.5}` and uses letters,
  digits, `.`, `:`, `_` and `-`.
- One block per word: put several tags in the same braces, separated by commas, each name once.
- In a show/say pair, the tag goes on the shown side: `<Clipkin{brand} | clip kin>`.
- Tags only affect how the caption style draws the word. They never change timing or what is said.

## Mark ranges the picture follows

A Selection names a stretch of the words, so B-roll, a graphic or a zoom can cover exactly that
stretch however fast the voice turns out to be. Open it with `@{name}` and close it with
`@{/name}`:

```reel
<script id="story">
  <problem>
    <HOST> @{pain}Editing one short video takes a whole afternoon.@{/pain}
  </problem>
  <answer>
    <HOST> @{fix}With Clipkin, you describe it and review the cut.@{/fix}
  </answer>
</script>
```

Selections can span Segments, and different Selections can overlap or cross. They don't have to
nest like tags:

```reel
<HOST> @{a}One @{b}two@{/a} three.@{/b}
```

By default a Selection starts at the beginning of the next word and ends at the end of the
previous one. A `~` moves an edge to the other side of the gap between words:

| Marker | Where the edge falls |
|---|---|
| `@{name}` | Opens at the start of the next word |
| `@{~name}` | Opens at the end of the previous word |
| `@{/name}` | Closes at the end of the previous word |
| `@{/name~}` | Closes at the start of the next word |

This matters at the very edges of the Script. `@{~all}` before the first Segment and `@{/all~}`
after the last one cover the whole video from start to end, not just from the first word to the
last.

Each name is opened once and closed once, and the markers never show up in any text. Other parts
of the project refer to a Selection as `{story.selection.pain}`.

## Mark single moments

A Moment names one point in time instead of a range, such as the instant a product appears or a
number lands. Add `!` to the marker:

```reel
<HOST> And then @{reveal!}the finished video was ready.
```

`@{reveal!}` falls at the start of the next word; `@{~reveal!}` falls at the end of the previous
one. Each Moment name is used once, and other parts refer to it as `{story.moment.reveal}`.

Selections and Moments share one set of names, so the same name can't be both.

### Rules for every marker

- Names follow the Segment rules: lower-case letters, digits, `-` and `_`, starting with a letter.
- Everything goes inside the braces, with no spaces: `@{pain}`, `@{/pain~}`.
- A marker can't sit between a word and the punctuation stuck to it. Write `@{quote!}“Ten minutes”`,
  not `“@{quote!}Ten minutes”`.

[Timing & Assembly](./timing.md#_4-turn-script-marks-into-times) shows how Selections and Moments turn
into time on the finished video.

## Comments and literal characters

Comments are written `<!-- like this -->` and never appear in any output. A few characters start
Script markup, so write them with a backslash when you mean the character itself:

| Write | To get |
|---|---|
| `\@` | `@` |
| `\<` | `<` |
| `\{` and `\}` | `{` and `}` |
| `\\` | `\` |
| `\\|` | `\|` on the shown side of a pair |
| `\>` | `>` on the shown side of a pair |

```reel
<outro>
  <!-- Keep the handle on screen for the whole line. -->
  <HOST> Follow \@clipkin for more.
</outro>
```

## A complete Script

A 20-second product video with two speakers, using everything above:

```reel
<script id="story">
  @{~all}
  <hook>
    <MAYA> @{pain}Our launch video took three weeks{stress} and two freelancers.@{/pain}
  </hook>

  <turn>
    <LEO> So this time we wrote one paragraph and gave it to <Clipkin{brand} | clip kin>.
  </turn>

  <proof>
    <LEO> @{fix}It wrote the script, made the shots, and cut it. || @{done!}We had a draft
          before lunch.@{/fix}
  </proof>

  <offer>
    <MAYA> Try it free at <clipkin.example | clipkin dot example>.
  </offer>
  @{/all~}
</script>
```

This Script has:

- four Segments: `hook`, `turn`, `proof` and `offer`;
- two speakers, `MAYA` and `LEO`;
- two show/say pairs, so the captions read "Clipkin" and "clipkin.example" while the voices say them
  out loud;
- a caption break before "We had a draft before lunch";
- three Selections: `all` (the whole video), `pain` and `fix`;
- one Moment, `done`, for the instant the draft is ready.

From here, `{story.segment.hook.speech}` can feed a voice, `{story.selection.pain}` can place
B-roll over the problem, and `{story.moment.done}` can pop in a "Draft ready" card.

## When something is wrong

Clipkin checks the Script before anything is generated. Each error has a code, a sentence saying what
is wrong, and where in the Script it is. The ones you are most likely to meet:

| Error | What happened |
|---|---|
| `SCRIPT_TEXT_OUTSIDE_SEGMENT` | Words outside any Segment |
| `SCRIPT_SEGMENT_OPEN` / `SCRIPT_SEGMENT_ID` | A Segment name with capitals, attributes or the reserved name `script` |
| `SCRIPT_SEGMENT_MISMATCH` | A Segment closed with a different name, often because one was put inside another |
| `SCRIPT_ROLE_AFTER_TEXT` | A Role Cue after words that had no speaker in the same Segment |
| `SCRIPT_ANGLE` | Angle brackets Clipkin doesn't recognize, such as a speaker name over 32 characters |
| `SCRIPT_DUAL_EMPTY` | A show/say pair with nothing to say |
| `SCRIPT_MARKER` | An `@` that doesn't start a valid marker; write `\@` for the character |
| `SCRIPT_SELECTION_UNCLOSED` / `SCRIPT_SELECTION_CLOSE` | A Selection opened without a close, or closed without an open |
| `SCRIPT_MARKER_TOKEN_BOUNDARY` | A marker or caption break between a word and its punctuation |

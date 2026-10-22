# Script syntax

Open this page when you write or fix a `<script>` body: display spelling, pronunciation, spaces,
Caption grouping and semantic markers. The creative decisions live in
[Script and semantic time](../creation/script-and-time.md); imports and graph references live in
[Source syntax](source-syntax.md); how components use the resulting identities lives in [Timing](timing.md).

Everything here is author syntax owned by the installed Script package, imported through its logical
Module ABI `@clipkin/script@1` (a package release number is a different thing). The package owns the
parser and its exact diagnostics, such as `SCRIPT_MARKER_TOKEN_BOUNDARY` or `SCRIPT_DUAL_EMPTY`. When
`clipkin check` reports a syntax error, repair the markup; never "fix" it by changing the authored
words or spacing.

## Several languages share one file

| Context | Example | How it is read |
| --- | --- | --- |
| Attribute of a structured Source element | `narrative={story}` | A reference to an entire graph value. |
| Inside Script prose | `@{reveal!}` | A semantic Moment; nothing is shown or spoken for it. |
| Inside Script prose | `clear{emphasis}` | Annotates the shown word right before the braces. |
| Inside a model prompt | `@image1` | The model's own way of naming a reference, when its Kit defines one. |
| A standalone time element | `<time:Instant id="cue" timeline={film.timeline} at={claim}/>` | Names an Instant derived from a value that has already resolved. |

No global substitution rule exists for braces or at-signs. Whoever receives a body owns its grammar.

## Structure, grouping and display attributes

| What you want | Write |
| --- | --- |
| A Segment named `opening`; every spoken word must sit inside some Segment | `<opening>...</opening>` |
| A wordless Segment that still has a name and two boundaries | `<pause/>` |
| A speaker turn (Role Cue) that lasts until the next Role Cue or the Segment closes | `<HOST>` |
| One Dual Text unit with separate shown and pronounced wording | `<display text \| spoken text>` |
| Shown and spoken wording that are identical, bound as one unit while each word keeps its own time | `<display text\|>` |
| Words that are heard and timed but never shown | `< \| spoken text>` |
| A Caption Cue break, placed between whole Alignment Units | `\|\|` |
| Flags on one whole shown word, read by the Caption family | `word{emphasis,keyword}` |
| Named values (text, number or boolean) on one shown word | `word{importance=2,tone=warm}` |
| A Selection — a named range of meaning | `@{proof} ... @{/proof}` |
| A Moment — a named point of meaning | `@{claim!}` |

### Segments and Roles

- A Script needs at least one Segment. Segment names are unique and match `[a-z][a-z0-9_-]{0,63}`;
  the name `script` is reserved. Segments do not nest.
- Natural-language text outside a Segment is an error.
- A paired Segment may hold prose or be empty; the self-closing form is always wordless.
- A Role Cue is a bare turn marker with no closing tag. The next Role Cue starts the next turn;
  closing the Segment ends the last turn and clears the Role, so a Role never leaks into the next Segment.
- If a Segment uses Roles, its first Role Cue must come before any of its spoken text.
- One Segment may hold several Role turns; that does not mean several generated clips.
- Inside a Segment, any bare tag is a Role Cue because of where it is, not because of its case:
  `<host>`, `<主持人>` and `<진행자>` all name speakers. A label steers dialogue only; it does not
  select a voice or a character asset by itself.

### Dual Text

Either side of Dual Text may hold several words. The display side feeds Caption; the spoken side
feeds pronunciation. Leaving the display side empty keeps those spoken words in the Narrative and in
semantic timing while hiding them from Caption.

- Put Selections and Moments on the spoken side; that side owns the speech anchors.
- A Cue boundary goes before or after the whole Dual unit, never inside it.
- Attributes for a displayed word go on the display side, before the pipe.
- Inside the display side, write `\@` when the visible text really contains an at-sign.

The three Dual shapes answer three different author needs:

| Use it to | Fragment | Caption shows | Model says |
| --- | --- | --- | --- |
| Keep a spelling while dictating how the letter is said | `<S\|ess>` | `S` | `ess` |
| Bind identical words, inner space included, into one correspondence | `<New York\|>` | `New York` | `New York` |
| Keep the speech and its anchors without showing it | `<\|再见>` | nothing | `再见` |

[Pronunciation choices](../creation/script-and-time.md#choose-the-sound-the-spelling-should-carry)
covers letter names, abbreviations, coined names and homophone readings. The spoken side is plain
Text handed to the chosen model; Script does not interpret it as a phonetic alphabet.

### Grouping with the shared form

With identical wording, `<组件化|>` is shorthand for `<组件化|组件化>`. It groups a name, compound or
phrase for Caption without merging its spoken Tokens or their times:
`把<动效|><组件化|>。|| 以后就能<直接复用|>。` Group where the expression should be read as one
thing; ordinary Chinese prose does not need word-by-word markup. The group's Style decides how it
looks, while `||` still decides which reading phrases become separate Cues.

When speech is omitted, the left side feeds both projections, so semantic markers may sit there and
Studio writes them back there: `<组@{beat!}件化|>`. Display attributes and markers are annotations,
never spoken words, and an attribute still applies to the word right before it rather than to the
whole group. As soon as an explicit spoken side exists, markers belong on that right-hand side.
Either form must contain at least one spoken word — `<API|...>` gives no speech correspondence for
`API` and is rejected.

### Comments and attachment

Script comments add no text and do not split a word: `hel<!--note-->lo` is still `hello`. In ordinary
prose, a comment or a zero-width marker also leaves a following attribute attached to its word, so
`hello<!--note-->{emphasis}` and `hello@{beat!}{emphasis}` both annotate `hello`. A real space before
`{emphasis}` breaks the attachment and is an error. Comments may also sit between passages:

```reel
<!-- Notes like this never reach any text projection. -->
<social><HOST> Follow us \@clipkin.</social>
```

### Escapes

| Write | Get | Notes |
| --- | --- | --- |
| `\@` | `@` | |
| `\<` | `<` | |
| `\{` / `\}` | `{` / `}` | |
| `\|` | `\|` | Inside Dual Text, a literal pipe; `\|\|` gives two. |
| `\>` | `>` | Needed only inside Dual Text, where `>` would close the unit. |
| `\\` | `\` | |

In ordinary prose, a plain `>` and a single `|` are already literal; `||` is the Cue handoff. Inside
Dual Text, the first unescaped `|` divides display from pronunciation. These escapes are Script's own.
Outside the Script body — in structured attributes and elements — Markup's entity escaping applies;
see [Source syntax](../production/source-syntax.md).

### What becomes a speech token

Script derives speech tokens from words and numbers. Punctuation sticks to the displayed word it
belongs to and never becomes a separate timed unit. In CJK prose each Han, Hiragana or Katakana
character is usually its own lexical unit, whereas compounds, decimals and whatever sits on the
spoken side of a Dual keep the structure they were written with. So Cue breaks, word attributes and
markers always bind to whole authored units — never to a punctuation mark or a line-wrap position.
Timing per character does not mean Cues per character; place `||` where a reader would pause on a
phrase. [Caption craft](../playbooks/craft/captions.md#language-changes-the-reading-unit) covers
grouping, spacing and fit for Chinese, English and mixed scripts.

## Spelling is independent of timing

Runs of ordinary whitespace collapse to one displayed and spoken space. Whitespace at the start or
end of a Turn, and padding just inside each Dual side, is dropped. A newline in Source is formatting
only: `||` makes Cue handoffs and the Caption family decides visual line wrapping.

| What the author meant | Written in the Segment | Shown as |
| --- | --- | --- |
| Chinese with a real space | `是的 就是这样` | `是的 就是这样` |
| Chinese kept joined, with a zero-width range inside | `是的@{answer}就是这样@{/answer}` | `是的就是这样` |
| That range, this time after a typed space | `是的 @{answer}就是这样@{/answer}` | `是的 就是这样` |
| English: spaces kept, full stop stuck to its word | `Hello @{place}New York.@{/place}` | `Hello New York.` |
| Korean spacing between words, and no gap in `3개월` | `이건 3개월 동안 만든 영상이에요.` | exactly as written |
| A gap the author wants there | `3 개월` | `3 개월` |
| Digits beside Latin letters, with or without a gap — the author decides | `3D` / `3 D` | `3D` / `3 D` |
| A single Alignment Unit that has a space inside it | `<New York\|>` | `New York` |
| One shown word matched to three spoken tokens | `<API\|A P I>` | `API` |
| Heard and timed, never shown | `<\|只说不显示>` | *(nothing)* |

Never pad markers with spaces to help parsing, strip spaces from Chinese, or derive Korean or English
spacing from how words are tokenized for speech. Spaces belong to the display; they are never timed. A Caption consumer
combines each display word's `text` with its `separatorBefore` (`""` or `" "`) and drops a leading
separator at the start of a displayed line or Cue. [Caption authoring](caption-authoring.md) covers
reading these values in a new family.

Source and its projections serve different purposes. Source keeps the author's prose as written;
the display and speech projections normalize whitespace as described above. When Studio moves a
marker it relocates only that annotation and leaves unrelated whitespace alone. Explicit Script
formatting may re-indent and tighten whitespace while keeping the parsed meaning identical.

## Use the Script's deliberate projections

One Script publishes the whole Narrative plus the narrow views the rest of the work needs. With the
Script `id="story"` (the id defaults to `script` when omitted):

| Reference | Type | Carries |
| --- | --- | --- |
| `{story}` | Narrative | The complete authored Narrative. |
| `{story.segment.hook}` | NarrativeSegmentRef | The `hook` Segment, for generation, alignment or another semantic consumer. |
| `{story.segment.hook.dialogue}` | Text | Role-aware dialogue using the spoken side of Dual Text — the input for a speaking performance request. |
| `{story.segment.hook.speech}` | Text | Pronunciation only, Role labels dropped — for `clipkin estimate` or standalone speech. |
| `{story.caption}` | CaptionDocument | Everything Caption needs: the shown Words, their Alignment Units, word attributes, Roles and the Cues you wrote. |
| `{story.caption-binding}` | NarrativeCaptionBinding | How Caption units map to Narrative speech Tokens. |
| `{story.selection.proof}` | NarrativeSelection | The named semantic range. |
| `{story.moment.claim}` | NarrativeMoment | The named semantic point. |

For example, this Segment in `story` gives two speakers one turn each:

```reel
<exchange>
  <HOST> Let me show you.
  <GUEST> That looks much easier.
</exchange>
```

`{story.segment.exchange.dialogue}` then yields:

```text
HOST: Let me show you.
GUEST: That looks much easier.
```

Feed that Text to the speaking prompt, and in the action direction tie HOST and GUEST to the
character views and voices you supply. The chosen [Prompt Kit](prompt-kits.md) fixes the order of
references; [podcast direction](../playbooks/formats/two-person-podcast.md#direct-conversation-inside-a-generated-clip)
shows those roles and references becoming one performed exchange.

All of these are projections of a single authored Script, not copies you have to keep in sync. The
performance request, the Caption system and semantic timing stay connected even when what is shown
and what is spoken differ.

## Bind meaning to Script identities

Every semantic marker is wrapped entirely in `@{...}`, with `/`, `!` and `~` inside the braces.
`@{beat!}` is a Moment, whereas `@{part}!` opens a Selection followed by a literal exclamation mark.
A marker contributes no text and no whitespace:

- `是的@{part}就是这样@{/part}` stays joined; `是的 @{part}就是这样@{/part}` keeps the authored space.
  Never add spaces just to make a marker parse.
- A marker may not split a speech Token or separate it from its attached punctuation. Write
  `@{beat!}“测试”`, not `“@{beat!}测试”`. `hel@{beat!}lo` and `안@{beat!}녕` split tokens too, and
  wrapping them in Dual Text does not make those positions legal.
- Attributes stay with their display word: `word{emphasis}@{beat!}`.
- A literal `@{part}` in displayed text is written `\@\{part\}`.

Selections may overlap, cross each other or span Segments; they are named ranges, not nested tags.
Each Selection name has exactly one opening and one closing marker. Names for Selections and Moments
come from a single shared pool and follow the pattern `[a-z][a-z0-9_-]{0,63}`.

Inside speech, each marker picks a neighboring semantic boundary:

| Marker | Lands on |
| --- | --- |
| `@{name}` | Opens a Selection at the start of the next word. |
| `@{~name}` | Opens a Selection at the end of the previous word. |
| `@{/name}` | Closes a Selection at the end of the previous word. |
| `@{/name~}` | Closes a Selection at the start of the next word. |
| `@{name!}` | Places a Moment at the start of the next word. |
| `@{~name!}` | Places a Moment at the end of the previous word. |

Markers may also sit between or outside Segments when the meaning spans structural passages. Here
the Selection spans the entire Script program, using its structural edges rather than the first and
last words:

```reel
@{~whole}
<opening><HOST>First thought.</opening>
<answer><HOST>Final answer.</answer>
@{/whole~}
```

At a Script or Segment edge, the structural boundary itself is available even with no neighboring
word, so `@{videos} videos @{/videos}` covers exactly that one word.

### Who owns the pause between two pictures

Two adjacent visual Windows can meet on either side of the silence between words. Pick the spelling
that gives the pause to the picture you want. To hand it to the incoming picture, meet at the end of
the previous word:

```reel
@{coffee} my coffee @{/coffee} @{~smoothie} my smoothie @{/smoothie}
```

To hand it to the outgoing picture, meet at the start of the next word:

```reel
@{coffee} my coffee @{/coffee~} @{smoothie} my smoothie @{/smoothie}
```

These are alternatives, not two lines for the same Script. In both, the two Selections touch at a
single instant. A plain `@{/coffee} @{smoothie}` instead leaves the gap outside both Windows. Putting
`||` between the phrases changes Caption grouping only, not the visual boundary.
[Material-led picture craft](../playbooks/craft/b-roll.md) decides whether the edit should meet there,
leave the pause visible, or let another picture carry through.

A marker locates meaning; it does not set how long an animation lives. A reveal may leave its answer
on screen afterwards, and a covering picture may fill the whole Selection. [Timing](timing.md)
explains those consuming forms.

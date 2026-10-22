# Caption authoring

Use this page when a video needs a new relationship between its spoken words, their layout and their
motion: a Caption family of its own. Neighboring owners:

| Question | Owner |
| --- | --- |
| Readability and directing judgment | [Caption craft](../playbooks/craft/captions.md) |
| Applying visible and hidden Styles over time | [Caption presentation](caption-presentation.md) |
| Project package wiring | [Track authoring](track-authoring.md) |
| Exact font resources and fallbacks | [Fonts and text](fonts-and-text.md) |
| The final drawing representation | [Component visuals](component-visuals.md) |
| Linking the visual idea to author controls and to the rest of the frame | [Component design](component-design.md) |

## Work out what is genuinely new

Fine Caption (`@clipkin/caption-fine`) already covers text that flows uniformly: exact fonts, Paint,
background boxes, karaoke states, positioning and movement are all built in. If the treatment is uniform, or merely chosen per Role or
per Window, Source and Recipe changes are probably all you need.

A new family is justified when words take on different visual roles inside a Cue:

- a persistent visual role attached to particular display words: mark those words with Script
  attributes and let a project family interpret the role;
- a keyword sitting on its own oversized line;
- words playing distinct visual parts in one phrase;
- a recurring spatial arrangement between speakers.

Never put keyword search, matching or content selection into a Recipe. Building such a family is
normal production work. Name the family after the visual relationship it makes reusable, and name
each Style after one particular treatment within it. A project may equally own a caption composition
used only once, if that is what the video needs.

The output is still Caption as long as the words on screen correspond to the speech and stay close to
its delivery. Free-standing slogans, summaries and titles usually belong to Typography, even when
a Script Moment triggers them.

## Own the visual relationship

Compare the picture side: Visual Clips present placed footage and independent pictures, and a scene component can coordinate
either with diagrams or graphics. Fine and custom Caption families stand in the same relationship to
each other: both take the authored speech and its semantic timing as input, and the implementation
owns spatial structure and motion.

Start from what the viewer should grasp or feel. Perhaps a supporting phrase sets up the thought and a
key word carries the punch. Design how they enter, how they share space, how they respond to speech,
and how they hand over to the next thought. From that come the controls worth offering: which
role a word was given, typefaces, how big each group is relative to the other, where it sits, how it
moves. Directing choices the production actually needs go in the Style or Recipe; keep the arrangement logic in the renderer. A qualitative
mode needs the same justification as a numeric field, and fixed decorative details can stay local.
[Component design](component-design.md#expose-the-choices-the-work-needs) owns that interface call.

The result is an ordinary VisualTrack whose Presents can own trees of text, boxes, images and other
elements. When words and graphics share layout or motion, keep them in one component.
[Component visuals](component-visuals.md#compose-video-and-graphics-in-one-html-visual) describes HTML
visuals with typed media and text children, and that freedom applies to captions as well: hand the
program the resolved caption schedule and explicit resources, and compute its state at the requested
frame. Overlays that are useful on their own stay as peers.

## Keep the existing text and timing chain

```text
Script → CaptionDocument (displayed Words, correspondence Units, authored Cues and word attributes)
NarrativeCaptionBinding + NarrativeProjection → CaptionTiming
Track Uses → resolved time windows, Styles and optional speaker filters
CaptionDocument + complete unit Timing + Uses + family parameters
  → family-owned schedule for the authored Cues → VisualTrack
```

Text rules that are easy to break:

- Read each display word's `separatorBefore` together with its `text`. Never rebuild wording by
  joining speech Tokens with spaces or by guessing from the writing system.
- Drop the separator at the start of a displayed Cue or line.
- Use the same authored boundaries for base glyphs, active layers and backgrounds.
- Separators are display content, not timed Tokens.

Take content timing and Use coverage from `@clipkin/caption`, and Script document types from
`@clipkin/narrative`. The Track of any family takes `document`, the resolved `timing`, `timeline`,
and a sequence of `Use` children:

```reel
<keyword:Track id="captions" document={story.caption} timing={story-captions} timeline={program.timeline}>
  <keyword:Use style={base-style}/>
  <keyword:Use role="GUEST" style={guest-style}/>
  <keyword:Use during={punchline} style={punchline-style}/>
</keyword:Track>
```

The `keyword:` names assume the project has declared that family and its Styles. `during` points at a
named absolute Window declared upstream. A Use means the same thing in every family; `role` limits
whose content it presents inside that window.

For a keyword layout, Script can mark a word as `useful{emphasis}`. That attribute travels in the
CaptionDocument, where the family picks it up and assigns the word its visual role within the whole Cue. The word's role
and the time window answer separate questions; an emphasis attribute does not create a second time
language.

## Give the family its own schedule

Keep measured speech time apart from visible time. Every alignment unit keeps the boundaries and
identity it was measured with; lead, tail, stagger, hold and handoff are all settled into a concrete
schedule ahead of drawing; the renderer only draws that schedule. The Cue's animation keeps its original starting
point, and whichever Use window wins acts only as a visibility mask on top. A window that starts halfway through a Cue
still receives the whole Cue with its original word times, so it can change appearance without
restarting karaoke or the text reveal.

For a "big keyword plus supporting phrase" family, the schedule might record, per Cue, its display
words, the ids of the emphasized words, their measured units, and the visible interval of each group;
the layout then computes both groups together. Decide in advance how the layout copes when a Cue
has zero keywords or several, when the text runs long, and when one pronunciation spans N:M words. Let authors correct things through word
attributes, `||` and Style configuration; never invent missing text or drop words.

Cue structure is fixed upstream:

- The projection publishes absolute boundaries for every complete Unit and does not form Cues.
- The CaptionDocument already groups complete Units into authored Cues.
- A family schedule matches those Cues with Unit timing. From there it can build lines, pages, cards or
  local states; splitting or merging a Cue is off limits.
- Visual line wrapping is a separate step. A narrow width must not quietly rewrite the Script into new
  Cues. The schedule must still know which Words and Units belong to which original Cue.

Display Words mirror Script's lexical units: a Han character is normally one Word, and so is an English
word. How finely time is divided is a separate matter from how words are grouped visually.
Rely on the authored `separatorBefore` and `text` of every word, with its punctuation attached, and never derive gaps from the writing
system. Measure with the selected fonts' real widths. If the family will carry them, test Chinese with
a deliberate space, Korean word spacing, and mixed numeric/Latin spellings.

For emphasis that follows speech, switch each complete unit on at its projected start and off at its
end. A bar that sweeps left to right over the whole Cue tracks the clock and the line's width instead;
that is not the same as tracking the characters being spoken. Wiping inside a glyph is an explicit
visual choice. Check the chosen effect against a short example with uneven unit durations and a pause.

`caption:Hidden` provides a Style with `rendering: null`. It takes part in later-Use-wins precedence,
clearing this Track's presentation within its window, and a later visible Use can restore a narrower
window. Resolve that coverage per Cue and speaker with `captionUseVisibility`. The content projection
keeps every Cue regardless of Style; time that is empty or uncovered simply draws nothing.

## Give Style, layout and rendering clear owners

- The **Style Surface** checks the Recipe and the exact font references, and outputs the shared
  Caption Style shape stamped with this family's name and parameters.
- The **Caption Surface** accepts the document, Timeline and timed Use children. Its Fragment gathers
  the Uses, performs the shared timing join, and runs the family's own schedule and render operations.
- The family's Producers, and any schedule Type it introduces, are registered by its own package.
- The **renderer** is responsible for typography, how the parts relate structurally, their stacking
  and their motion. Build on the existing text shaping and Visual IR tools, passing font resources
  explicitly, selected local font files
  included, so the rendering machine receives exactly the same faces.

Study `surface.ts`, `schedule.ts` and `render.ts` in `@clipkin/caption-fine` one at a time, as three
separate examples. Keep the shared parts and replace the family behavior itself, parameter validation
included. Renaming Fine while keeping its uniform-word assumption will not produce a structural keyword
treatment.

Each family interprets its own Styles: Fine handles uniform-flow Styles, a structural family handles
its layouts. Tracks are independent, so several can deliberately show captions at once or split
coverage between them. If mixed-family rendering is ever useful, the component that implements it owns
it.

If the family supports spatial tracking, take explicit Region Evidence and map it into the actual
composition. Define how subjects are matched and what happens when a region is missing. Detection
belongs to the measurement step in [Caption tracking](../playbooks/craft/caption-tracking.md), never to
this renderer.

## Check what matters

Write a short test Script with one plain phrase, one use of the new structural treatment, a switch of
Role, and one Dual Text unit. Confirm the displayed words and their link to the measured speech. Then look at the
new layout at its target frame size, paying attention to every handoff. Where relevant, try long words,
overflow and seeking directly into the middle. A still can show typography; only the configured
timeline proves timing.

Ship the family with clear vocabulary and a carefully designed preview. The project, not the package,
holds the wording, the fonts, the palette and the roles assigned to words, so all of them stay editable.
What the package adds is a rendering language; Script, Caption and semantic time keep their existing
owners.

To get live Cue Items and Inspector editing, write a
[Studio Companion](studio.md#give-a-project-component-a-useful-companion): whole Cues appear as
timeline Items and the authored Uses appear as Inspector objects. Work from the Track's resolved
Uses, keep each Use's Source range and temporal lineage, and expose the Style that Use references.
Caption Fine's Companion (`@clipkin/caption-fine/studio`) models these relationships well; the new
family's layout logic stays in its renderer.

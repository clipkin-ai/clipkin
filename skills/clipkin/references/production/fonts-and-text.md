# Fonts and independent text

Use this page to choose or locate fonts, bring in a local font file, handle several writing systems or
Emoji, and place titles and labels. Text shown in step with speech, and the reading rhythm of Chinese
and English Cues, belongs to [Caption](../playbooks/craft/captions.md).

Three things combine to produce text on screen, and each can change without disturbing the others:

| Piece | Supplies |
| --- | --- |
| Font resource | The glyph shapes and spacing, which decide how text wraps and how much room it takes |
| Style | Size and treatment |
| Text item | Wording, placement and lifetime |

## Select a face or a fallback stack

```reel
<import as="fonts" from="@clipkin/fontsource@1"/>
<import as="media" from="@clipkin/media@1"/>

<fonts:Face id="headline-font" package="@fontsource/archivo-black" weight="400" style="normal"/>
<fonts:Face id="body-latin" package="@fontsource-variable/inter" weight="700" style="normal"/>
<fonts:Face id="body-han" package="@fontsource-variable/noto-sans-sc" weight="700" style="normal"/>
<media:FontStack id="body-font" primary={body-latin}>
  <media:Fallback font={body-han}/>
</media:FontStack>
```

- A `fonts:Face` is one exact font resource taken from an installed `@fontsource` or
  `@fontsource-variable` package.
- `media:FontStack` keeps an ordered list; here Inter is tried first and Noto Sans SC second. Choose
  fallbacks for the scripts that actually appear in the video.
- The requested `weight` and `style` must exist in that project-installed package. Which families
  and versions are available is decided by the project's `package.json` and lockfile, not by any
  Clipkin catalog. Changing `package` means selecting a different dependency.

### Chinese-led speech

Begin with a face designed for the script you need. Fontsource ships Noto families for Simplified
and for Traditional Chinese as separate packages, plus more expressive display families. Pick by
character: a compact, legible face carries running speech well, while a display face with more personality
fits a playful caption or a brief title. Judge the real words at delivery size, including
punctuation, numerals and any Latin names.

### Fallback order is a design choice

With Inter first and Noto Sans SC second, Latin letters take Inter's shapes and Chinese takes Noto's.
Putting a Chinese face first lets it draw both scripts and gives a more unified line. The same numeric
weight can look quite different across families, so compare a pairing inside one Cue. The renderer
uses exactly the faces supplied; synthetic bold and italic are off unless a Style's Recipe
deliberately sets `synthesis`.

## Use fonts already on the machine or supplied by the user

Fonts installed on the machine are good source material. Locate their real files and declare them as
assets, so the face travels with the Build rather than relying on a family name that may not exist on
the next machine. Here a local brand face sits in front of an explicit Chinese fallback:

```reel
<import as="media" from="@clipkin/media@1"/>
<media:Font id="brand-font" src="./assets/fonts/brand-semibold.woff2" weight="600" style="normal"/>
<fonts:Face id="chinese-font" package="@fontsource-variable/noto-sans-sc" weight="600" style="normal"/>

<caption-fine:Style id="caption-style" recipe={look.caption.primary} font={brand-font}>
  <caption-fine:Fallback font={chinese-font}/>
</caption-fine:Style>
```

The excerpt assumes the `fonts`, `caption-fine` and Recipe imports. `media:Font` takes a file path;
copying the chosen file into the project's `assets/fonts/` keeps the Source portable. State the file's
true `weight` and `style`: calling a regular-only file 700 does not make it bold. A face split into
Unicode-range shards can be declared with `media:Source` children instead of `src`.

Where to look for font files:

| System | Places |
| --- | --- |
| macOS | Font Book, `~/Library/Fonts`, `/Library/Fonts` |
| Windows | the Fonts settings, `%WINDIR%\Fonts`, `%LOCALAPPDATA%\Microsoft\Windows\Fonts` |
| Linux and other Fontconfig systems | `fc-list` |

Search those locations, or use the operating system's font information, to identify both the face and
its file. Standalone `.ttf`, `.otf`, `.woff` and `.woff2` files enter through the same asset path as a
font the user hands you. A `.ttc`/`.otc` collection bundles several faces, and the Font Surface has no way to
pick one face out of a collection. Get the standalone face you want, or extract it with a font tool
where the license allows, before declaring it.

## Look further afield for a face

Look first at the user's brand assets, then at faces already installed in the project or on the
machine. If the piece calls for something else, go to the foundry's or open-font project's official
specimen and download page. Confirm script coverage, the weights and styles on offer, and the
intended use; then copy the selected file into the project and store where it came from and its
license next to it, which matters most when the editable project will be shared. Treating the
download as a project asset suffices; a system-wide install is not required.

Font and treatment are judged together: test them on the real caption wording, at its line width,
looking at character detail and contrast against the picture. A font that covers Han glyphs is not
automatically right for Chinese, and size, spacing or outline values tuned for English rarely
transfer unchanged.

## Emoji presentation

Emoji faces follow the same rule: install or supply the exact face and put it explicitly in a
`media:FontStack`. Some characters have both a text and an Emoji presentation; write the precise
Unicode sequence you want, for example `☎️` (with the variation selector) for the Emoji form.

## Give independent text its own placement and lifetime

Use Typography for titles, labels, verdicts and copy that keeps its own display rhythm. When the
words on screen follow the performance, Script Caption is still the right tool.

This excerpt assumes the named fonts, layout Frames, Timeline and Recipes already exist:

```reel
<import as="copy" from="@clipkin/text@1"/>
<import as="typo" from="@clipkin/text-fine@1"/>

<typo:Style id="headline-style" recipe={look.text.title} font={headline-font}>
  <typo:Fill color="#F1E7D8"/>
</typo:Style>
<copy:Value id="headline">A useful idea, clearly shown.</copy:Value>
<typo:Flow id="opening-title" timeline={speech.timeline} content={headline}
  within={title-frame} style={headline-style} z="20" align="center"
  during={speech.opening}/>
```

Add `opening-title.visual` to Film. Responsibilities divide cleanly:

- the **Style** carries reusable typography and Paint (it needs at least one `Fill` or `Stroke`);
- the **occurrence** carries content, placement, form-specific layout, layer order and absolute time.

For a title that lasts the whole program, use the Timeline's full Window; for a shorter appearance use
another named Window such as `speech.opening`. A semantic or musical domain must project its evidence
to a Window before a fine-text occurrence can use it.

A matching Recipe for the example is `text.title { size: 54; weight: 400; }`, agreeing with the
selected headline face. `z="20"` stays on the occurrence, where its effect on the composition is
visible.

| Placement | Input | Use |
| --- | --- | --- |
| `Point` | a `SpatialPoint` | Text anchored at a position, its box following its content |
| `Flow` | a `SpatialFrame` | Wrapping and fitting inside a bounded region |
| `Path` | a `SpatialPath` | Text along an authored curve |

Run `clipkin vocabulary @clipkin/text-fine --tag Style` to see which Recipe properties a Style accepts; use `--tag Flow`,
`--tag Point` or `--tag Path` for each placement's content, layout and motion fields.
[Spatial layout](spatial.md) explains the geometry those inputs carry.

## Rich text and motion

An occurrence either reads graph Text through `content={...}` or owns an inline document built from
`typo:P`, `typo:Span` and `typo:Break`. Inside a Flow, for example:

```reel
<typo:P>Made for <typo:Span style={accent-style}>this moment</typo:Span>.</typo:P>
```

A Style on a paragraph or Span replaces that run's *entire* typography and Paint, font and size
included. Placement and layer order still come from the outer occurrence.

Typography `Motion` can animate the whole occurrence (`ItemKeyframe`, by frame) or stagger
paragraphs, lines, runs, words or graphemes (`Sequence` with `Keyframe` children, by normalized
progress through one unit). `PathMotion` slides Path text along its curve. Check the installed
Motion vocabulary for exact frame offsets and sequence fields. If you need speech text laid out or
scheduled in a way no existing family offers, [Caption authoring](caption-authoring.md) explains building a family that
reuses the existing Caption document and semantic timing.

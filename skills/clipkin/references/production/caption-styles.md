# Named caption styles

Open this page when the user asks for a caption style by name ("use Neon captions", "captions like
Ticker"), or wants a ready-made caption look to start from. These are the styles shown in Clipkin's
public caption gallery. Each is one Fine Caption Recipe in
[caption-styles.grade](caption-styles.grade), plus the font and Cue length it was designed with.

| Style | Recipe | Shows | Font package | Weight | Words per Cue |
| --- | --- | --- | --- | --- | --- |
| Ticker | `caption.ticker` | One word at a time | `@fontsource/anton` | 400 | 1 |
| Stamp | `caption.stamp` | One word at a time | `@fontsource/archivo-black` | 400 | 1 |
| Scribble | `caption.scribble` | One word at a time | `@fontsource/caveat` | 700 | 1 |
| Stack | `caption.stack` | Builds up | `@fontsource/archivo-black` | 400 | 4 |
| Typewriter | `caption.typewriter` | Builds up | `@fontsource/space-mono` | 700 | 5 |
| Neon | `caption.neon` | Word highlight | `@fontsource/poppins` | 800 | 3 |
| Highlighter | `caption.highlighter` | Word highlight | `@fontsource/poppins` | 800 | 3 |
| Marker | `caption.marker` | Word highlight | `@fontsource/bricolage-grotesque` | 800 | 3 |
| Sing-along | `caption.singalong` | Word highlight | `@fontsource/bricolage-grotesque` | 800 | 4 |
| Subtitle | `caption.subtitle` | Full line | `@fontsource/poppins` | 600 | 6 |
| Cinema | `caption.cinema` | Full line | `@fontsource/dm-serif-display` | 400 | 4 |
| Bubble | `caption.bubble` | Full line | `@fontsource/poppins` | 800 | 3 |

## Use a style in a project

1. Copy the recipe block from `caption-styles.grade` into the project's own `.grade` and give it the
   project's path, for example `caption.primary`. The project owns its copy from then on.
2. Install the font package in the project's `package.json` and declare the face with
   `@clipkin/fontsource` ([Fonts and text](fonts-and-text.md)) at the listed weight:
   `<fonts:Face id="caption-font" package="@fontsource/poppins" weight="800" style="normal"/>`.
3. Write the Script's Cues at about the listed length. One-word styles need a Cue break after every
   word (`one || word || at || a || time`); the others read best at up to the listed number of words, split evenly
   (nine words at four per Cue read 3 + 3 + 3, not 4 + 4 + 1). Cue length is a reading decision, so
   keep a break where the sentence needs one.
4. Use the Style with `<caption-fine:Style id="primary" recipe={recipes.caption.primary} font={caption-font}/>`.

The recipes are sized for a 1080-pixel-wide vertical video with the Caption at `y: 0.62` (Subtitle
sits lower, at `y: 0.8`). Adjust `x`, `y`, `width` and `size` for the picture: keep captions clear of
faces, products and the platform's own buttons. Change colors to the video's palette when the user
asks; the motion and highlight settings are what make each style recognizable.

Typewriter, Subtitle and Bubble size their box to the text (`inline-size: hug`): the box shrinks to
a short line and wraps at `width` like `inline-size: fixed` once the line is longer. Their
`max-words-per-line` sets a deliberate row shape; remove it when you would rather the rows flow by
width.

"Shows" names the behavior: **One word at a time** shows a single word per Cue; **Builds up** reveals
each word as it is spoken (`atom-reveal`); **Word highlight** keeps the line readable and marks the
spoken word (`karaoke` or `active-box`); **Full line** shows the phrase whole and holds it still.

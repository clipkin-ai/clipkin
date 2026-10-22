---
title: Grade Stylesheets
description: Keep a video's look and its prompt settings in one stylesheet, and point components at it by name.
---

A video has many settings that aren't about what happens: the background color, how captions
look, the frame around a product shot, the font size of a title, the camera style of a generated
take. Clipkin keeps them out of the main `.reel` file, in a Grade stylesheet (`.grade`). Each named
block in it is a **Recipe**, and a component that needs settings points at a Recipe by name.

This keeps the look in one place. Restyle every caption in a video, or reuse the same look across
several videos, by editing one file.

## A first stylesheet

```grade
<?reel using="@clipkin/recipe@1"?>

<sheet version="1">
  /* The page behind everything else. */
  film.vertical {
    background: #0B0B12;
  }

  text.title {
    size: 72;
    weight: 800;
    fill: #FFFFFF;
  }
</sheet>
```

- **The first line is required** and must come first in the file, with nothing before it (not even
  a blank line). It tells Clipkin this is a Grade stylesheet; the `.grade` file name alone doesn't.
- **`<sheet version="1">`** wraps everything else. It also accepts an `id`, but nothing reads it.
- **Each block is a Recipe.** Its name is two or more lower-case words joined by dots, such as
  `film.vertical` or `caption.host.large`. The first word is only for your own grouping: `caption.`
  doesn't make something a caption Recipe. What matters is where you use it. Each name appears once.
- **Each line is `property: value;`.** Property names are lower case with `-` between words, and
  every line ends with `;`.
- **Comments** are written `/* like this */`. `//` comments are an error.

Blocks don't nest and don't inherit from each other. Two Recipes that share most settings both
list them in full.

### Values

Grade passes values on as written. The component that uses the Recipe decides whether a value makes
sense, so the same `cover` or `#FFFFFF` can mean different things in different Recipes.

| You write | Clipkin reads |
|---|---|
| `58`, `-1`, `0.96` | A number |
| `true`, `false`, `null` | Yes, no, nothing |
| `"16 24"` or `'16 24'` | Text, without the quotes |
| `[1, 2]` or `{"a": 1}` | A JSON list or object |
| Anything else: `#0B0B12`, `center`, `8f` | Text, exactly as written |

Quote a value when it contains a `;`, or it will end the line early. Some properties also expect
text where you might write a number; the property lists below say which.

## Use it from your video

Import the stylesheet at the top of the `.reel` file with a short name, then refer to a Recipe as
`{short name.recipe name}`:

```reel
<import as="look" source="./look.grade"/>

<film:Film id="main" canvas={vertical.canvas} timeline={speech.timeline}
  appearance={look.film.vertical}>
  <film:Track source={captions.visual}/>
</film:Film>
```

Here `{look.film.vertical}` is the `film.vertical` block from `look.grade`. A project can import
several stylesheets under different names, for example one for the brand and one per video.

## Background

`film:Film` takes a Recipe with exactly one property:

| Property | Value |
|---|---|
| `background` | Required. A color as `#RRGGBB`, or `#RRGGBBAA` with transparency |

The video's size isn't set here. It comes from the `space:Canvas` you give the Film, and the frame
rate comes from its timeline. [Film & Rendering](./composition.md) covers the rest of the Film.

## Captions

The Fine caption style (`caption-fine:Style`) reads its look from a Recipe and its font from the
`.reel` file:

```grade
caption.bold {
  stack-order: 70;
  anchor-x: center;
  anchor-y: bottom;
  x: 0.5;
  y: 0.86;
  width: 0.84;
  size: 64;
  line-height: 1.05;
  align: center;
  fill: #FFFFFF;
  background: #00000099;
  padding: "14 22";
  radius: 18;
  karaoke: current;
  active-fill: #FFD54A;
  atom-enter: pop;
}
```

```reel
<fonts:Face id="caption-font" package="@fontsource-variable/inter" weight="700" style="normal"/>
<caption-fine:Style id="bold-captions" recipe={look.caption.bold} font={caption-font}/>
```

These properties are required in every caption Recipe:

| Property | Value |
|---|---|
| `stack-order` | A whole number, 0 or more. Captions draw above anything with a lower number |
| `x`, `y` | Where the caption sits, from 0 to 1 across and down the area the captions are placed in (their `within` Frame) |
| `width` | Width of the caption area, as a share of that Frame (above 0, up to 1) |
| `size` | Text size in pixels |
| `line-height` | Line spacing, as a multiple of the size |
| `align` | `left`, `center` or `right` |
| `fill` | Text color, `#RRGGBB` or `#RRGGBBAA` |
| `background` | Box color behind the words; use `#00000000` for no box |
| `padding` | Space inside the box in pixels, **in quotes**: `"16"`, or `"14 22"` for top/bottom then left/right |
| `radius` | Corner rounding of the box in pixels |

**Which point `x` and `y` place** is set by `anchor-x` (`left`, `center`, `right`) and `anchor-y`
(`top`, `center`, `bottom`). By default it is the caption's top-left corner. The example above
anchors the bottom center instead, so `x: 0.5; y: 0.86` keeps the caption centered with its bottom
edge at 86% of the way down, however many lines it wraps to. `height` optionally fixes the box
height.

Many optional properties go further. The main groups:

- **Highlighting the word being spoken:** `karaoke` (`off`, `current` or `trail`) with `active-fill`,
  plus `active-box`, `active-underline`, and `active-response` with `active-scale` to make it grow.
- **Motion:** `cue-enter` and `cue-exit` for each caption, `atom-enter` and `atom-exit` for each word,
  using named motions such as `fade`, `pop` or `spring`, each with a `-frames` length; `loop` for an
  ongoing effect such as `pulse` or `float`.
- **Glyph effects:** `stroke-*`, `shadow-*`, `glow-*` and `gradient-*`, each with an `active-` version
  for the highlighted word.
- **Layout:** `max-lines` with `max-words-per-line`, `wrap`, `letter-spacing`, `word-gap`, `direction`,
  `text-transform`.
- **Timing:** `lead-frames` and `tail-frames` to show a caption a little early or keep it a little
  longer.

The caption Recipe has no font properties. The typeface, weight and style all come from the `font`
you pass to the Style, so they can't disagree. See [Fonts](#fonts) below.

### A different look per speaker

Give each speaker their own Recipe, then choose between them with `caption-fine:Use`. The `role`
matches the speaker names in the [Script](./script.md#say-who-is-speaking), and a `Use` without a
role applies to every speaker. When several apply, the later one wins, so put the default first:

```reel
<caption-fine:Style id="maya-captions" recipe={look.caption.maya} font={caption-font}/>
<caption-fine:Style id="leo-captions" recipe={look.caption.leo} font={caption-font}/>

<caption-fine:Caption id="captions" document={story.caption} timing={story-captions}
  timeline={speech.timeline} within={vertical.bounds}>
  <caption-fine:Use style={maya-captions}/>
  <caption-fine:Use role="LEO" style={leo-captions}/>
</caption-fine:Caption>
```

[Tracks](./tracks.md#captions) explains where `timing` comes from and how a `Use` can apply to
only part of the video.

## Framing pictures and video

A picture or video clip on screen can take a treatment Recipe for the frame around it and for simple
image adjustments:

```grade
visual.product {
  clip: rounded;
  radius: 28;
  frame-paint: #14141C;
  border-width: 1;
  border-style: solid;
  border-color: #FFFFFF26;
  shadows: "0 18 40 0 #00000080";
  saturation: 1.1;
}
```

| Property | Value |
|---|---|
| `clip` | `frame` (default) cuts the picture to its frame; `rounded` also rounds the corners by `radius`; `none` doesn't cut it |
| `radius` | Corner rounding in pixels, used with `clip: rounded` |
| `padding` | Inset in pixels, in quotes: `"12"`, `"12 24"` or `"12 24 12 24"` |
| `frame-paint` | What shows behind the picture inside the frame: a color, `linear(…)` or `radial(…)` gradient. Transparent by default |
| `border-width`, `border-style`, `border-color` | A border. Style is `solid`, `dashed` or `dotted`; a color is required once the width is above 0 |
| `shadows` | One or more shadows as `x y blur spread color`. Quote the value, and separate several shadows with `;` inside the quotes |
| `opacity`, `blur` | Transparency (1 is solid) and blur (0 is sharp) |
| `brightness`, `contrast`, `saturation` | Image adjustments; 1 leaves the picture unchanged |

Where the clip goes and how it moves are **not** part of the Recipe. Position, stacking (`z`), how
the picture fits its frame (`fit="cover"`, `contain` and so on) and motion are attributes of the
clip itself, because they change each time you place something. Here the clip shows during
`fix`, a stretch of time declared from the Script's `fix` Selection (see
[Timing & Assembly](./timing.md#_4-turn-script-marks-into-times)):

```reel
<visual:Track id="product-shots" timeline={speech.timeline}>
  <visual:Clip media={product-media.media} frame={product-frame} during={fix}
    z="40" fit="cover" treatment={look.visual.product}/>
</visual:Track>
```

[Tracks](./tracks.md#pictures-and-video-clips) covers frames, fitting, motion and source timing.

## Titles and on-screen text

Text styles (`text:Style`, from `@clipkin/text-fine@1`) hold the typography; where the text sits is
up to the element that places it:

```grade
text.title {
  size: 72;
  weight: 800;
  tracking: -1.5;
  line-height: 1.05;
  fill: #FFFFFF;
}
```

```reel
<fonts:Face id="title-font" package="@fontsource-variable/inter" weight="800" style="normal"/>
<text:Style id="title-style" recipe={look.text.title} font={title-font}/>
<text:Flow id="headline" timeline={speech.timeline} within={title-frame}
  style={title-style} z="90" align="center" during={pain}>
  3 weeks → 10 minutes
</text:Flow>
```

`size` is required, and a text style needs a color: `fill` in the Recipe, or a `text:Fill` or
`text:Stroke` inside the Style. Other common properties:

| Property | Value |
|---|---|
| `weight` | 400 unless set |
| `font-style` | `normal`, `italic` or `oblique` |
| `line-height` | 1.2 unless set |
| `tracking`, `word-spacing` | Extra space between letters and between words, in pixels |
| `transform`, `caps` | Change letter case |
| `language`, `direction` | Language of the text, and `auto`, `ltr` or `rtl` |
| `paragraph-before`, `paragraph-after`, `indent` | Paragraph spacing |

Outlines, shadows, glows and boxes behind the text are child elements of the Style (`text:Stroke`,
`text:Shadow`, `text:Glow`, `text:Box`). [Tracks](./tracks.md#text-on-screen) covers placing text.

## Settings for generated takes

Recipes aren't only for looks. The ready-made prompt templates for generated video (the Seedance
Kits) read their style choices from a Recipe too: how steady the camera is, how fast the edit feels,
how the presenter performs. You choose from fixed options, and the template turns them into prompt
wording.

```grade
speaker.founder {
  composition-stability: soft-locked;
  camera-motion: subtle-punch-in-return;
  edit-rhythm: pause-trim-jump-cuts;
  performance: calm-authority;
  gesture: compact;
}
```

```reel
<import as="wording" from="@clipkin/text@1"/>
<import as="speaker-kit" source="@clipkin/seedance-kits/speaker"/>

<wording:Render id="hook-prompt" template={speaker-kit.speaker-v1} recipe={look.speaker.founder}>
  <wording:Set name="dialogue" text={story.segment.hook.dialogue}/>
</wording:Render>
```

The options each template offers (the first in each list is the default):

| Template | Settings |
|---|---|
| `speaker-v1` | `composition-stability`: soft-locked, flexible-ugc, strict-locked · `camera-motion`: none, subtle-punch-in-return · `edit-rhythm`: continuous-take, pause-trim-jump-cuts · `performance`: natural-explainer, high-energy-ugc, calm-authority, reactive-playful · `gesture`: natural, restrained, compact, expressive |
| `broll-v1` | `material-mode`: practical-real, screen-demo, product-beauty, proof-capture, stylized-vfx · `story-shape`: single-moment, reaction-beat, process-demo, before-after, montage-sequence · `edit-language`: continuous-shot, jump-cut-beats, match-cut-montage, insert-cutaway · `camera-language`: reference-locked, selfie-vlog, handheld-follow, push-reveal, product-macro · `motion-intensity`: readable, micro, lively, impact |
| `podcast-v1`, `call-v1` | `framing`: locked-view, soft-push-in, emphasis-closeup · `edit-language`: speaker-cuts, reaction-cuts · `pacing`: compact, measured, rapid-banter, varied-emphasis · `performance`: natural-banter, high-energy, calm-expert, playful-skeptic · `reaction`: active-listening, subtle-listening, skeptical-reacts, big-reacts · `gesture`: natural, restrained, compact, expressive |
| `street-interview-v1` | `framing`: soft-handheld, locked-scene, subject-push · `pacing`: compact, measured, rapid-qna, varied-emphasis · `performance`: natural-street, high-energy, calm-expert, playful-skeptic · `reaction`: active, subtle, big · `gesture`: natural, restrained, compact, expressive |

Things to know:

- **Leave a setting out** to use its default. Settings a template doesn't know are ignored, so a
  misspelled property name changes nothing. Check the spelling against the table.
- **A misspelled value** (`gesture: big`) isn't caught until the prompt is produced. It then fails
  with a message that no option matched.
- **One-off overrides:** `<wording:Param name="gesture" value="expressive"/>` inside `Render`
  replaces the Recipe's value for that one prompt.
- **The model, resolution, length and reference media** aren't template settings. They stay on the
  generation element itself; see [Media & Generation](./generation.md).

The `wording:` prefix here is `@clipkin/text@1`, which writes prompts. It needs a different short name
from `text:` (`@clipkin/text-fine@1`, which draws text) when a file uses both.

## Fonts

A stylesheet never picks a font file. Fonts are chosen in the `.reel` file, from font packages
installed in your video project, so every render uses exactly the same letters.

```reel
<import as="fonts" from="@clipkin/fontsource@1"/>
<import as="media" from="@clipkin/media@1"/>

<fonts:Face id="latin" package="@fontsource-variable/inter" weight="700" style="normal"/>
<fonts:Face id="chinese" package="@fontsource-variable/noto-sans-sc" weight="700" style="normal"/>
<media:FontStack id="caption-fonts" primary={latin}>
  <media:Fallback font={chinese}/>
</media:FontStack>
```

- **`fonts:Face`** picks one face from a [Fontsource](https://fontsource.org) package. All four
  attributes are required: `id`, `package` (an `@fontsource/…` or `@fontsource-variable/…` name), `weight`
  (one the package offers, or within a variable font's range) and `style` (`normal` or `italic`).
- **Install the package first,** for example `npm install @fontsource-variable/inter` in your video
  project. Clipkin reads the installed files and never downloads fonts while building. A missing
  package is an error that says so.
- **`media:FontStack`** combines a main font with fallbacks for characters it lacks, such as Chinese
  or emoji. Pass the stack wherever a single face would go: `font={caption-fonts}`.
- **Your own font file** (a brand typeface) is a `media:Font`:

  ```reel
  <media:Font id="brand" src="./assets/Brand-Semibold.woff2" weight="600" style="normal"/>
  ```

  `weight` and `style` (`normal`, `italic` or `oblique`) are required, since Clipkin can't tell them
  from the file.

## A complete stylesheet

The look of a short vertical product video: background, two speakers' captions, a product frame, a
title and the presenter's performance.

```grade
<?reel using="@clipkin/recipe@1"?>

<sheet version="1">
  film.vertical {
    background: #0B0B12;
  }

  /* Maya: white captions at the bottom, current word in yellow. */
  caption.maya {
    stack-order: 70;
    anchor-x: center;
    anchor-y: bottom;
    x: 0.5;
    y: 0.86;
    width: 0.84;
    size: 60;
    line-height: 1.05;
    align: center;
    fill: #FFFFFF;
    background: #00000000;
    padding: "0";
    radius: 0;
    stroke-width: 6;
    stroke-color: #000000;
    karaoke: current;
    active-fill: #FFD54A;
  }

  /* Leo: the same placement on a dark box, so viewers can tell the voices apart. */
  caption.leo {
    stack-order: 70;
    anchor-x: center;
    anchor-y: bottom;
    x: 0.5;
    y: 0.86;
    width: 0.84;
    size: 60;
    line-height: 1.05;
    align: center;
    fill: #FFFFFF;
    background: #14141CE6;
    padding: "14 22";
    radius: 18;
    karaoke: current;
    active-fill: #7FE3FF;
  }

  visual.product {
    clip: rounded;
    radius: 28;
    frame-paint: #14141C;
    shadows: "0 18 40 0 #00000080";
  }

  text.title {
    size: 72;
    weight: 800;
    tracking: -1.5;
    line-height: 1.05;
    fill: #FFFFFF;
  }

  speaker.maya {
    performance: high-energy-ugc;
    edit-rhythm: pause-trim-jump-cuts;
    gesture: expressive;
  }
</sheet>
```

Saved as `look.grade` and imported with `<import as="look" source="./look.grade"/>`, its Recipes
are `{look.film.vertical}`, `{look.caption.maya}`, `{look.caption.leo}`, `{look.visual.product}`,
`{look.text.title}` and `{look.speaker.maya}`.

## When something is wrong

Mistakes in the stylesheet itself are caught when it is read, with a code and the place in the file:

| Error | What happened |
|---|---|
| `SOURCE_HEADER_MISSING` | The `<?reel using="@clipkin/recipe@1"?>` line is missing or isn't the very first thing in the file |
| `GRADE_VERSION` | `<sheet>` is missing `version="1"`, or has another version |
| `GRADE_RULE` | A Recipe name with one word only, or capital letters |
| `GRADE_PROPERTY_SEMICOLON` | A line without its closing `;` |
| `GRADE_PROPERTY` | Something that isn't `property: value;`, such as a `//` comment |
| `GRADE_RULE_DUPLICATE` / `GRADE_PROPERTY_DUPLICATE` | The same Recipe name, or the same property in one Recipe, twice |

A Recipe that is written correctly but doesn't suit where it's used (a caption Recipe missing
`align`, an unknown property in a Film Recipe, a bare number for `padding`) is reported by the
component using it when the video is built.

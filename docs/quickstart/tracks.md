---
title: Tracks
description: Put captions, pictures, video, sound, text and animated graphics on the timeline, each as its own layer.
---

A finished video is a stack of layers: the presenter, B-roll on top, captions above that, a title, a
music bed underneath. In Clipkin each of these is a **Track**. Tracks are independent of each other:
each one reads the timeline and the Windows it needs, and the [Film](./composition.md) puts them
all together.

Every example here uses a timeline called `speech` and Windows from the Script, built as in
[Timing & Assembly](./timing.md).

## Rules every Track follows

- **When:** every item has a `during`, a Window on the timeline, and exists only inside it. A Script
  Selection isn't a Window yet: turn it into one with `semantic:Window` first
  ([how](./timing.md#_4-turn-script-marks-into-times)). `{speech.window}` is the whole video.
- **Where:** pictures and graphics go in a `space:Frame`, a rectangle inside the video or inside
  another Frame.
- **On top of what:** a higher `z` (or, for captions, decks and stickers, `stack-order` in a
  stylesheet) is drawn on top. When two are
  equal, Clipkin settles it the same way every time, but give layers different numbers when the order
  matters.
- **Picture and sound are separate.** Showing a video never plays its sound. Add an audio clip for
  that.

### Frames

```reel
<import as="space" from="@clipkin/spatial@1"/>

<space:Canvas id="vertical" width="1080" height="1920"/>
<space:Frame id="top-half" within={vertical.bounds} left="0%" top="0%" right="100%" bottom="50%"/>
<space:Frame id="product-box" within={vertical.bounds} left="8%" top="20%" right="92%" bottom="68%"/>
```

All four edges are measured from the parent's **left and top** edges. They aren't margins as in CSS:
a box covering the middle 84% is `left="8%" right="92%"`. Each edge takes `%` (of the parent's width
across, its height down) or `px`. A bare number is an error, and so is a right edge that isn't past
the left one. `{vertical.bounds}` is the whole picture.

## Captions

Captions take three pieces: the caption text from the Script, the timing of each word, and a style.

```reel
<import as="narrative-caption" from="@clipkin/narrative-caption@1"/>
<import as="caption-fine" from="@clipkin/caption-fine@1"/>
<import as="fonts" from="@clipkin/fontsource@1"/>

<narrative-caption:Timing id="caption-times" document={story.caption}
  binding={story.caption-binding} projection={story-time}/>

<fonts:Face id="caption-font" package="@fontsource-variable/inter" weight="800" style="normal"/>
<caption-fine:Style id="bold" recipe={look.caption.bold} font={caption-font}/>

<caption-fine:Caption id="captions" document={story.caption} timing={caption-times}
  timeline={speech.timeline} within={vertical.bounds}>
  <caption-fine:Use style={bold}/>
</caption-fine:Caption>
```

- **`narrative-caption:Timing`** turns the Script's captions into times, using the word timing from
  [`semantic:Projection`](./timing.md#_4-turn-script-marks-into-times) (`story-time`).
- **`caption-fine:Style`** pairs a stylesheet Recipe with a font. The Recipe's settings are listed in
  [Grade Stylesheets](./styles.md#captions).
- **`caption-fine:Caption`** draws them inside `within`, and gives `{captions.visual}`.

`Use` decides which style applies when. A `Use` with no conditions applies to everyone throughout.
`role="LEO"` limits it to one speaker, and `during={…}` limits it to a Window. Later `Use`s win
where they overlap, so put the general one first:

```reel
<caption-fine:Caption id="captions" document={story.caption} timing={caption-times}
  timeline={speech.timeline} within={vertical.bounds}>
  <caption-fine:Use style={bold}/>
  <caption-fine:Use role="LEO" style={leo-style}/>
  <caption-fine:Use style={big-punch} during={claim-window}/>
  <caption-fine:Use style={no-captions} during={title-card}/>
</caption-fine:Caption>
```

To hide captions for a while, use a style that draws nothing: `<caption:Hidden id="no-captions"/>`
from `@clipkin/caption@1`. Where the words split into separate captions is set in the Script
([caption breaks](./script.md#choose-where-captions-break)).

## Pictures and video clips

A `visual:Track` holds clips: video, still pictures or B-roll. A clip can't stand on its own outside
a Track.

```reel
<import as="visual" from="@clipkin/visual-track@1"/>

<visual:Track id="broll" timeline={speech.timeline}>
  <visual:Clip media={bottle-media.media} during={proof} frame={product-box}
    z="40" fit="cover" treatment={look.visual.product}/>
  <visual:Clip image={logo} extent={logo-size} during={speech.answer} frame={top-half}
    z="45" fit="contain"/>
</visual:Track>
```

Each clip needs:

- **One source:** `media` for a prepared video ([Normalize](./timing.md#_1-prepare-each-take) it first),
  or `image` for a still picture, which also needs an `extent`: its size, declared with
  `<space:Extent id="logo-size" width="1200" height="400"/>`, in the picture's own proportions.
- **`during`, `frame` and `z`.**

Optional settings:

| Attribute | What it does |
|---|---|
| `fit` | How the picture fills its frame: `contain` (all of it shows, the default), `cover` (fills it, cropping edges), `fit-width`, `fit-height`, `native` (actual size), `scale-down` or `stretch` |
| `content-x`, `content-y` | A point in the picture, from 0 to 1 (0.5 is the center), lined up with the `frame-x`/`frame-y` point of the frame as far as the fit allows. With `cover`, `content-y="0.3"` shows more of the top, to keep a face in view |
| `frame-x`, `frame-y` | The point in the frame it lines up with, from 0 to 1 (0.5 by default) |
| `treatment` | Rounded corners, border, shadow and color adjustments from a stylesheet ([settings](./styles.md#framing-pictures-and-video)) |
| `motion` | An animation (below) |

Two clips in one Track can overlap, but can't use the very same Window. Before and after its Window,
a clip isn't there.

### Animate a clip

A `visual:Motion` is a set of key poses across the clip's time, and the clip moves smoothly between
them:

```reel
<visual:Motion id="slide-up">
  <visual:Pose at="start" y="80" opacity="0" easing="ease-out"/>
  <visual:Pose at="8f" y="0" opacity="1"/>
  <visual:Pose at="end" y="0" opacity="1"/>
</visual:Motion>
```

- **`at`** is measured from the clip's own start: `start`, `end`, a frame count such as `8f`,
  `end-6f`, or a share such as `50%`. The first pose is at `start`, the last at `end`, and they go in
  order.
- **Each pose can set** `x` and `y` (offset in pixels), `scale` (or `scale-x` and `scale-y`),
  `rotate` (degrees) and `opacity` (0 to 1). `easing` is `linear`, `ease-in`, `ease-out` or
  `ease-in-out`.

Use it with `motion={slide-up}` on any clip. A Motion is reusable across as many clips as you like.

### Change a clip's speed

By default a video plays at normal speed from its start, and if the Window is longer than the
video, the clip turns transparent once the video ends. A `visual:Map` inside the clip changes that.
An empty `<visual:Map/>` stretches or squeezes the whole video to fit its Window exactly, and its
attributes can pick a part of the source, set a `rate`, or loop a section (`wrap-from`,
`wrap-until`).

## Sound

Voices, music and sound effects go on an `audio:Track`. Each sound is first prepared with
[Normalize](./timing.md#_1-prepare-each-take), which for a file with no picture means
`video="none" audio="default" span-authority="audio"`.

```reel
<import as="audio" from="@clipkin/audio-track@1"/>

<audio:Track id="sound" timeline={speech.timeline}>
  <audio:Clip source={opening-media.media} during={speech.opening}/>
  <audio:Clip source={answer-media.media} during={speech.answer}/>
  <audio:Clip source={music-media.media} during={speech.window} gain="0.25"
    fade-in="1s" fade-out="2s"/>
  <audio:Clip source={whoosh-media.media} during={claim-sting}/>
</audio:Track>
```

- **`gain`** sets the volume as a multiplier: `1` is unchanged, `0.25` a quarter, `2` double (up to
  64). It's a plain number, not decibels.
- **`fade-in` and `fade-out`** take `f`, `ms` or `s`, and must fit inside the clip's Window.
- **Clips overlap freely,** so music plays under the voice. There's no automatic ducking: set the
  music's `gain` lower.
- **To loop music** under a longer Window, add a `<audio:Map wrap-from="start" wrap-until="end"/>`
  inside the clip. Without it, sound simply stops when the file ends.

`{sound.audio}` goes into the Film. You can use several audio Tracks, for example one for voices
and one for music.

## Text on screen

Titles, labels and callouts are text elements from `@clipkin/text-fine@1`. Each one is its own layer;
there's no container.

```reel
<import as="text" from="@clipkin/text-fine@1"/>

<fonts:Face id="title-font" package="@fontsource-variable/inter" weight="800" style="normal"/>
<text:Style id="title" recipe={look.text.title} font={title-font}/>

<space:Frame id="title-area" within={vertical.bounds} left="6%" top="8%" right="94%" bottom="20%"/>

<text:Flow id="headline" timeline={speech.timeline} within={title-area} style={title}
  z="90" during={proof} align="center" overflow="shrink" minimum-scale="0.6">
  3 weeks → 10 minutes
</text:Flow>
```

| Element | Places text | Key attributes |
|---|---|---|
| `text:Flow` | In a box, wrapping onto lines | `within` (the box), `align` (`start`, `center`, `end`, `justify`), `wrap`, `overflow` (`visible`, `clip`, `ellipsis`, or `shrink` with a `minimum-scale` from 0 to 1), `max-lines` (with `ellipsis` or `shrink`) |
| `text:Point` | At a single point, without wrapping | `point`, `anchor-inline`, `anchor-block` |
| `text:Path` | Along a curved line | `path`, `side`, `orientation` |

All of them need `id`, `timeline`, `style`, `z` and `during`. The words go between the tags, or come
from a text with `content={…}`, but not both. The style is described in
[Grade Stylesheets](./styles.md#titles-and-on-screen-text). Each text element gives `{id.visual}`.

## Ranking boards

Ranking videos (top 10 lists, tier lists, podiums) use `@clipkin/ranking@1`, which animates entries
arriving and moving into place, with optional sounds.

| Board | Entries | Looks like |
|---|---|---|
| `ranking:TierBoard` | `ranking:TierItem` | A tier list: S, A, B… rows of icons |
| `ranking:Column` | `ranking:ColumnItem` | A numbered list that fills in |
| `ranking:TopThree` | `ranking:TopThreeItem` | A podium of up to three |

```reel
<import as="ranking" from="@clipkin/ranking@1"/>

<ranking:ColumnStyle id="list-style" recipe={look.ranking.list} font={list-font}/>

<ranking:Column id="top-five" timeline={speech.timeline} within={vertical.bounds}
  frame={list-area} during={speech.window} style={list-style} appear-sound={pop-media.media}>
  <ranking:ColumnItem rank="1" label="Kyoto" icon={kyoto-photo} during={reveal-kyoto}/>
  <ranking:ColumnItem rank="2" label="Lisbon" icon={lisbon-photo} during={reveal-lisbon}/>
  <ranking:ColumnItem rank="3" label="Cusco" preset="true" icon={cusco-photo}/>
</ranking:Column>
```

- **Each board** needs `timeline`, `frame`, `during` and a `style` of its own kind (`ColumnStyle`,
  `TierBoardStyle` or `TopThreeStyle`). TierBoard and Column also need `within`, and TopThree needs
  `terminal` (the Instant the podium completes) instead.
- **`rank`** is the entry's final place, not the order it appears in. Ranks are unique.
- **Each entry either appears at a Window** (`during`, inside the board's Window, not overlapping the
  others) **or is there from the start** (`preset="true"`).
- **Tier entries** take a `tier` and an `icon`. Entries that arrive later also take
  `entry="direct"` or `entry="drop"`.
- **Sounds:** `appear-sound` on all boards, `move-sound` on TierBoard and Column.

`examples/ranking-football` in the Clipkin repository has complete tier-board and column videos.
Install the package in your video project first: `npm install @clipkin/ranking`.

## Card decks

A card deck shows pictures or clips as a stack of cards, each new one arriving on top while the
earlier ones recede. It's good for screenshots, proof or a run of examples.

```reel
<import as="deck" from="@clipkin/depth-stack@1"/>

<deck:DepthStack id="proof-cards" timeline={speech.timeline} frame={product-box}
  until={proof-end} appearance={look.deck.proof}>
  <deck:Card id="card-1" source={review-1} extent={review-size} at={first-review}/>
  <deck:Card id="card-2" source={review-media.media} at={second-review}/>
</deck:DepthStack>
```

- **The deck** needs `timeline`, `frame`, `appearance` (a stylesheet Recipe) and `until`, the Instant
  when the deck leaves.
- **Each card** needs an `id`, a `source` and `at`, the Instant it arrives. A video card uses the
  prepared video (`{….media}` from Normalize); a still picture also needs an `extent`.
- **A caption on a card** is a `deck:Label` (an `id`, the copy, a font stack, and optional `size`,
  `color`, `align`, `block` and `padding`) passed to the card as `label={…}`.

Install the package in your video project first: `npm install @clipkin/depth-stack`.

## Comment stickers

Comment stickers show social-media style comments on screen: the comment, the commenter's name and
picture, and an optional line such as "Featured comment".

```reel
<import as="comment" from="@clipkin/comment-sticker@1"/>

<comment:Style id="social" recipe={look.comment.card} font={ui-fonts}/>

<comment:Track id="comments" timeline={speech.timeline}>
  <comment:Sticker id="first-comment" frame={comment-area} style={social} during={speech.opening}
    author="@maya.makes" meta="Featured comment" avatar={maya-avatar}>
    Wait, this took ten minutes?
  </comment:Sticker>
</comment:Track>
```

- **Each sticker** needs `id`, `frame`, `style` and `during`. The comment goes between the tags or in
  `comment={…}`. `author`, `header`, `meta` and the `avatar` picture are optional, and nothing is made
  up when they're missing.
- **The font** for decks and stickers must be a `media:FontStack`, not a single `fonts:Face`
  ([Fonts](./styles.md#fonts)).

Install the package in your video project first: `npm install @clipkin/comment-sticker`.

## Complete examples

The example projects in the Clipkin repository use these Tracks in full, and each passes
`clipkin check`:

- **`examples/podcast`:** two speakers, a caption style per speaker, and B-roll.
- **`examples/interview`:** three generated takes, sound effects on Script Moments, and captions.
- **`examples/ranking-football`:** a tier list and a ranked column with sounds.

Once the Tracks are ready, [Film & Rendering](./composition.md) combines them into the finished video.

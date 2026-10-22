---
title: Film & Rendering
description: Combine every Track into one film, decide what's on top, and render the finished video or part of it.
---

The last stage gathers the Tracks you've built (picture, captions, text, sound) into a **Film**, and
renders the Film to a video file.

```reel
<import as="space" from="@clipkin/spatial@1"/>
<import as="film" from="@clipkin/film@1"/>
<import as="html" from="@clipkin/html-video@1"/>
```

## Gather the Tracks

```reel
<space:Canvas id="vertical" width="1080" height="1920"/>

<film:Film id="main" canvas={vertical.canvas} timeline={speech.timeline}
  appearance={look.film.vertical}>
  <film:Track source={picture.visual}/>
  <film:Track source={broll.visual}/>
  <film:Track source={captions.visual}/>
  <film:Track source={headline.visual}/>
  <film:Track source={sound.audio}/>
</film:Film>
```

| Attribute | What it is |
|---|---|
| `canvas` | The picture size, from a `space:Canvas`: `width` and `height` in pixels. Use even numbers: the video format needs them, and odd sizes aren't caught until rendering |
| `timeline` | The [timeline](./timing.md) the video runs on, which sets its length and frame rate |
| `appearance` | A [stylesheet Recipe](./styles.md#background) with the background color |

- **Each `film:Track`** adds one picture Track (`{….visual}`) or sound Track (`{….audio}`). Nothing is
  added automatically: a Track you don't list isn't in the video, and listing one twice is an error.
- **A video clip's sound comes from its audio Track,** not from its picture Track. Showing a take and
  hearing it are two separate Tracks, both listed here.
- **The order you list them doesn't matter.** What's on top is decided by stacking, below.

The finished Film is `{main.composition}`.

## What's on top

Every picture item has a stacking number, and higher numbers are drawn over lower ones, across all
Tracks. That's why the order of `film:Track` lines doesn't matter.

| Item | Where its number is set |
|---|---|
| Video and picture clips | `z` on each `visual:Clip` |
| Titles and text | `z` on each `text:Flow`, `text:Point` or `text:Path` |
| Captions | `stack-order` in the caption [Recipe](./styles.md#captions) |
| Card decks, comment stickers | `stack-order` in their Recipe (30 and 62 if you leave it out). A deck's cards stack upward from its number |

A layout that works well for a talking-head video:

| Layer | Number |
|---|---|
| Presenter | 10 |
| B-roll and product shots | 40 |
| Captions | 70 |
| Titles | 90 |

When two items have the same number, Clipkin decides the same way every time, but give them different
numbers whenever it matters which one is on top.

## Render the video

```reel
<html:Video id="final" composition={main.composition} timeline={speech.timeline}/>
```

`{final.video}` is the finished video: an MP4 with H.264 picture and AAC sound. A video with no sound
Track still gets a silent sound track, so it plays everywhere. Rendering quality (`draft`,
`standard` or `high`) is the `quality` setting of the local renderer in your [Runtime](./run.md),
not an attribute of the element.

Rendering happens on your computer, in a headless Chrome browser, with FFmpeg combining picture
and sound. Install FFmpeg yourself; `clipkin runtime up` installs the browser Clipkin manages, unless
your Runtime points at a Chrome you already have.

### Render only part of it

To check a section quickly, render a range of frames:

```reel
<html:Video id="middle" composition={main.composition} timeline={speech.timeline}
  start-frame="240" end-frame-exclusive="360"/>
```

At 30 frames a second this renders from 8 seconds up to (not including) 12 seconds. Everything in it
is exactly as it is in the full video: an animation that started earlier is already in motion. Give
both attributes, and keep the end within the timeline.

## A film with no voice

A Film doesn't need speech or takes, only a timeline. An animated title card, for example:

```reel
<import as="time" from="@clipkin/timeline-author@1"/>
<import as="text" from="@clipkin/text-fine@1"/>
<import as="fonts" from="@clipkin/fontsource@1"/>

<time:Clock id="clock" frame-rate="30"/>
<time:Timeline id="card" clock={clock} end="4s">
  <time:Window id="title" from="0.5s" until="end"/>
</time:Timeline>

<space:Canvas id="square" width="1080" height="1080"/>
<space:Frame id="band" within={square.bounds} left="10%" top="40%" right="90%" bottom="60%"/>

<fonts:Face id="title-font" package="@fontsource-variable/inter" weight="800" style="normal"/>
<text:Style id="title-style" recipe={look.text.title} font={title-font}/>
<text:Flow id="headline" timeline={card.timeline} within={band} style={title-style}
  z="90" during={card.title}>
  Launching Monday
</text:Flow>

<film:Film id="main" canvas={square.canvas} timeline={card.timeline}
  appearance={look.film.vertical}>
  <film:Track source={headline.visual}/>
</film:Film>
<html:Video id="final" composition={main.composition} timeline={card.timeline}/>
```

`look` is the stylesheet from [Grade Stylesheets](./styles.md#a-complete-stylesheet); its
`text.title` Recipe sets the `fill` color a text style needs.

The `examples/semantic-composition` project in the Clipkin repository goes further: an animated chat
conversation drawn entirely by a component of its own, with no generated media at all.

## The Run file

The `.reel` file describes the video. A small **Run file** (`.slate`) says which result to make:

```slate
<?reel using="@clipkin/markup/run@1"?>
<slate version="1">
  <author source="./main.reel"/>
  <target output="final.video"/>
</slate>
```

`target` names an output of the `.reel` file, here `{final.video}`. A Run file can also reuse
results from earlier builds so nothing is generated twice; see [Run Source & Builds](./run.md).

## Check, then build

```bash
clipkin check build.slate
clipkin plan build.slate
clipkin pricing build.slate
clipkin build build.slate --follow
```

- **`check`** reads every file and confirms the pieces fit together: names, types, required
  attributes. It calls no services and costs nothing. It works on a `.reel` file or a Run file.
- **`plan`** lists every request the build would make (each generation, alignment, render). With a
  [Runtime](./run.md) selected, it also shows which service would handle each one and flags anything
  your setup can't do.
- **`pricing`** estimates what those requests cost before you spend anything. It needs a Runtime.
- **`build`** runs it. [Run Source & Builds](./run.md) covers builds, getting the finished file out,
  and reusing results.

A few mistakes only show up at `plan`, not `check`: for example, a frame range that runs past the end
of the timeline.

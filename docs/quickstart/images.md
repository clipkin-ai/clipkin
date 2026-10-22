---
title: Image Operations
description: Combine, crop, resize and correct pictures before they are used, and cut a person out of a video.
---

A picture often needs work before it's useful: a product shot cropped to the right shape, a logo
placed on a background, a generated image cleaned up, two pictures combined into one reference.
Image Operations do that, and every result is an ordinary picture you can use anywhere a picture
goes: as a model reference, a first frame, or a picture on screen.

```reel
<import as="image" from="@clipkin/image-operations@1"/>
```

**Where it runs:** image operations run on your own computer, using OpenCV in Python. Install
[uv](https://docs.astral.sh/uv/), then run `clipkin runtime up` once to set it up. Nothing is uploaded
and nothing is charged. In Clipkin's hosted app they're already set up, and
they cost no credits there either.

## Combine pictures into one

`image:Compose` lays pictures on top of each other on a canvas, in the order you write them, the
first one at the back:

```reel
<space:Canvas id="square" width="1080" height="1080"/>
<space:Frame id="whole" within={square.bounds} left="0%" top="0%" right="100%" bottom="100%"/>
<space:Frame id="center" within={square.bounds} left="20%" top="15%" right="80%" bottom="85%"/>

<image:Compose id="hero" canvas={square.canvas}>
  <image:Layer source={backdrop} frame={whole} fit="cover"/>
  <image:Layer source={product} frame={center} fit="contain"/>
</image:Compose>
```

The result is `{hero.image}`, a PNG that keeps transparency.

- **`canvas`** sets the output size. **`background`** is the color behind everything, written with
  transparency as `#RRGGBBAA`: `#FFFFFFFF` is white, and the default `#00000000` is see-through.
- **Each `image:Layer`** needs a `source` picture and a `frame` saying where it goes. A compose takes
  1 to 64 layers, and anything outside the canvas is cut off.
- **`fit`** is `contain` (the whole picture shows, the default), `cover` (fills the frame, cropping the
  edges) or `stretch`.
- **`opacity`** runs from 0 to 1. **`interpolation`** sets how pictures are scaled: `lanczos` (the
  sharp default), `cubic`, `linear`, `area` or `nearest`.

[Tracks](./tracks.md#frames) explains how `space:Frame` edges work.

## Fix up a picture

An `image:Program` is a list of steps. An `image:Transform` applies a Program to one picture.
Because they're separate, you write a treatment once and reuse it on every picture that needs it:

```reel
<image:Program id="clean-product">
  <image:Crop x="0.1" y="0.05" width="0.8" height="0.9"/>
  <image:Resize width="1080" height="1350" fit="cover"/>
  <image:Color exposure-stops="0.3" saturation="1.1"/>
  <image:Sharpen amount="0.6"/>
  <image:Encode format="jpeg" quality="90" background="#FFFFFFFF"/>
</image:Program>

<image:Transform id="product-clean" source={product} program={clean-product}/>
<image:Transform id="product-alt-clean" source={product-alt} program={clean-product}/>
```

Each Transform gives `{id.image}`. The steps run in the order written:

| Step | Attributes | Notes |
|---|---|---|
| `Crop` | `x`, `y`, `width`, `height` (required); `unit` | Shares of the picture from 0 to 1 by default; `unit="pixel"` for whole pixels. Must stay inside the picture |
| `Resize` | `width`, `height` (required); `fit`, `interpolation`, `background` | 1 to 16384 pixels. `fit` is `contain` unless set; `background` fills the space `contain` leaves |
| `Rotate` | `degrees` (required) | `90`, `180` or `270`, clockwise |
| `Flip` | `axis` | `horizontal` (default), `vertical` or `both` |
| `Color` | `exposure-stops`, `contrast`, `saturation`, `temperature`, `tint`, `gamma` | All optional. Exposure from −8 to 8 stops (0 is unchanged). Contrast and saturation 0 to 4 (1 is unchanged; saturation 0 is greyscale). Temperature (toward amber or blue) and tint (toward green or magenta) −1 to 1. Gamma 0.1 to 10; above 1 brightens |
| `Denoise` | `luma`, `chroma`, `template-window`, `search-window`, `saturation-recovery` | All optional; `<image:Denoise/>` alone uses sensible defaults. Good for cleaning up generated images |
| `Sharpen` | `amount`, `radius`, `threshold` | Amount 0 to 5 (0.5 by default) |
| `Blur` | `sigma` (required) | Blur strength, 0.1 to 100 |
| `Alpha` | `mode`, `background` | `preserve` keeps transparency (default). `flatten` fills it with `background`, which is then required |
| `Encode` | `format`, `quality`, `background` | `png` (default), `jpeg` or `webp`. `quality` 1 to 100 for jpeg and webp. `background` only for jpeg |

- **Encode is optional.** Without it you get a PNG. If you use it, there's only one, and it goes last.
- **JPEG has no transparency.** Encoding a transparent picture as `jpeg` needs a `background`, or the
  run fails.
- A Program on its own does nothing until a Transform uses it.

## Cut a person out of a video

To put a presenter over a different background, remove the background from their video first.
BRIA background removal runs through Replicate, so it works on a Clipkin account and the default
setup:

```reel
<import as="bria" from="@clipkin/bria-matting@1"/>

<bria:RemoveBackground id="cutout" source={presenter-take.video} preserve-audio="true"/>
```

- **The source can be up to 60 seconds**, in MP4, MOV, WebM or AVI. Longer clips are refused before
  anything is uploaded.
- **The cutout is silent unless you set `preserve-audio="true"`.** Keep the sound when the person is
  speaking.
- **`format`** is `WEBM` (the default) or `MOV`. Both keep the transparency.

The result `{cutout.video}` is a video like any other. Prepare it with `mediaop:Normalize` and place
it with a `visual:Clip` on top of the new background, as in [Timing & Assembly](./timing.md). Use
`audio="default"` when you kept the sound, or `audio="none"` when you didn't. A spoken cutout can be
aligned to its Script Segment like any other take.

For clips longer than 60 seconds, the Volcengine portrait cutout (`matte:Portrait` from
`@clipkin/volcengine-matting@1`) handles up to 20 minutes. It needs your own Volcengine AI MediaKit
key, so it isn't available on a Clipkin account, and it has no `preserve-audio` option.

There's no background removal for still pictures. To get a picture with a transparent background,
generate one that way: GPT Image (`Image` from `@clipkin/gpt-image@1`) accepts
`background="transparent"`.

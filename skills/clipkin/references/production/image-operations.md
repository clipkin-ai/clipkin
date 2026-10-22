# Preparing generated images

Use this page when a generated or supplied image needs combining, correcting, resizing or cropping
first, and only then serves as a model reference or a Track item. What the image should communicate belongs to
[image direction](../playbooks/craft/image-direction.md); Canvas, Frame and fit belong to
[spatial layout](spatial.md).

Every image operation publishes another ordinary image Output. That result can feed Seedance, a
Visual Clip, a further image operation or any compatible project component. Put the operation in
Source whenever the transformation is part of the production's reproducible relationships.

## Flatten a fixed still-image arrangement

Image Compose does exactly one thing: it freezes a deliberately rigid 2D arrangement of existing
still images into a single PNG. Comparison boards, contact sheets and intentionally hard-edged
collages are its natural uses.

Declare the Canvas and every rectangular destination yourself:

```reel
<import as="space" from="@clipkin/spatial@1"/>
<import as="image" from="@clipkin/image-operations@1"/>

<space:Canvas id="comparison-canvas" width="2048" height="1024"/>
<space:Frame id="before-panel" within={comparison-canvas.bounds}
  left="0%" top="0%" right="50%" bottom="100%"/>
<space:Frame id="after-panel" within={comparison-canvas.bounds}
  left="50%" top="0%" right="100%" bottom="100%"/>

<image:Compose id="comparison" canvas={comparison-canvas.canvas} background="#EEEAE2FF">
  <image:Layer source={before.image} frame={before-panel} fit="contain"/>
  <image:Layer source={after.image} frame={after-panel} fit="contain"/>
</image:Compose>
```

How it behaves:

- Children paint in document order (1 to 64 Layers). A Frame reaching past the Canvas is clipped.
- Each Layer states its source image, destination Frame, `fit` (`contain` default, `cover`,
  `stretch`), optional `opacity` and optional `interpolation` (the resampling filter: `nearest`,
  `linear`, `cubic`, `area`, `lanczos` default).
- `background` is `#RRGGBBAA`; the default `#00000000` is transparent.
- `{comparison.image}` is one flattened PNG, not a Track.

**Know its limits.** Compose has no idea of people, objects or camera space. It will not reconcile
perspective, depth, lighting, subject scale, background continuity or a believable seam.

| You want | Use instead |
| --- | --- |
| Several references merged into one coherent camera image | Ask the image model to create that image |
| Layers that stay independently timed, clipped, moved or revisable in the video | Keep them as separate Tracks in Film |

## Apply a reusable correction program

Image Transform keeps the ordered list of corrections apart from the image it runs on:

```reel
<import as="image" from="@clipkin/image-operations@1"/>

<image:Program id="delivery-crop">
  <image:Crop x="0" y="0" width="1080" height="1920" unit="pixel"/>
  <image:Resize width="1080" height="1920" fit="cover"/>
  <image:Encode format="png"/>
</image:Program>

<image:Transform id="prepared-shot" source={shot.image} program={delivery-crop}/>
```

Operations run in the order written. A Program is plain authored data: it makes no pixels until a
Transform applies it, and one Program can serve many Transforms. `{prepared-shot.image}` is the
result.

Available operations: `Crop` (fractions by default, or `unit="pixel"`), `Resize`, `Rotate` (90/180/270),
`Flip`, `Denoise`, `Color` (exposure, contrast, saturation, temperature, tint, gamma), `Sharpen`,
`Blur`, `Alpha` (preserve or flatten onto a background) and `Encode` (PNG, JPEG or WebP, at most once
and always last). Run `clipkin vocabulary @clipkin/image-operations --tag Program` for their installed
fields, defaults and limits.

Use correction to carry out a production choice you already know. A prompt that produced the wrong
image is still the image direction's and its Prompt Kit's problem; a different composition is still
owned by the shot or reference relationship.

## Change the pixels, or only their presentation

| Choose | When |
| --- | --- |
| An image operation (Compose or Transform) | The reusable pixels themselves should change, and several downstream consumers should get the same prepared image |
| A Visual Clip | The change is only about how this video presents the image: placing it in a Frame for a Window, perhaps animating that occurrence |

Check the package vocabulary before using optional fields. The examples above give the stable Source
shapes; which Endpoint runs them, its credentials and its capacity are Runtime concerns.

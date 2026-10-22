# Spatial layout

Use this page whenever you position or fit media, text or a project component. It owns destination
geometry for Visual Clips and project scenes alike. Time is a separate axis, covered in
[Timing](timing.md). Deciding which content shares layout or motion is
[component design](component-design.md); the camera view inside a generated source is
[image direction](../playbooks/craft/image-direction.md).

## Canvas, extent and destination

Three ideas carry the whole page:

| Concept | What it states |
| --- | --- |
| **Canvas** | The final image's pixel size. The shared `@1` picture-plane convention supplies the coordinate basis. |
| **IntrinsicExtent** | The real pixel dimensions of one source image. |
| **Frame** | The destination rectangle a consumer should occupy. |

Frames and component scopes are organizing tools. They need not tile the canvas or stay disjoint:
components may overlap, share motion and keep their own local trees, and each visual contribution
publishes Presents with its own paint order.

Because extent and Frame are separate, a landscape image keeps its real extent while appearing inside
a portrait composition. Nothing dictates a Frame or crop for an A-roll source. When a performance will
mostly fill the screen, its intended final aspect can guide how the source is directed; later insets
or splits are still free placement choices. If the source needs particular framing, turn that into
visible camera facts before generating it.

```reel
<import as="space" from="@clipkin/spatial@1"/>

<space:Canvas id="canvas" width="1080" height="1920"/>
<space:Extent id="photo-size" width="1600" height="1200"/>
<space:Frame id="content" within={canvas.bounds}
  left="6%" top="8%" right="94%" bottom="90%"/>
```

Coordinate rules:

- The origin is the top-left corner; x grows to the right and y grows downward; pixels are square.
- All four Frame edges are measured from the parent's *left* or *top*. So `right="94%"` puts the right
  edge at 94% of the parent's width, which leaves a 6% margin on that side.
- Percentages on x use the parent's width, on y the parent's height. Nesting a Frame changes which
  rectangle that is. Pixel lengths are written with `px`.
- `canvas.bounds` is the full-picture Frame; `canvas.canvas` is the viewport Film consumes.

## Anchor an object or preserve its aspect

```reel
<space:AnchoredFrame id="label" within={content}
  x="50%" y="85%" width="80%" height="12%" anchor="center"/>
<space:AspectFrame id="photo-frame" within={content}
  x="100%" y="0%" width="45%" aspect={photo-size} anchor="top-right"/>
```

- **AnchoredFrame** has a size and pins one of its nine anchor points (`top-left` through
  `bottom-right`) to `x`/`y` in the parent.
- **AspectFrame** keeps a ratio. Write exactly one of `width` or `height`; the other follows from
  `aspect`, which is either an Extent reference or a written ratio such as `4/3`.
- `offset-x` and `offset-y` add a further pixel nudge to either kind.
- An anchored Frame may hang partly or wholly outside its parent when the composition wants that.

Text uses two more primitives: `space:Point` for a pixel position, and `space:Path` for authored
`Move`, `Line`, `Quadratic`, `Cubic` and `Close` commands. [Fonts and text](fonts-and-text.md)
shows which Typography placement reads each.

## Map a source plane and treat its Frame

A Visual Clip keeps three spatial facts apart:

1. The source's **IntrinsicExtent** bounds its own local pixel plane.
2. A **SpatialMap2D** carries positions from that local plane into the program picture plane.
3. The destination **Frame** is the Clip's outer boundary for treatment and clipping.

Ordinary `fit` attributes compute the SpatialMap2D once both the source Extent and the Clip Frame
are known. The resolved Visual Program stores that map, not a second "fitted rectangle". That is
why a still needs an Extent; normalized video and compositable Surfaces bring their own size. The
fit calculation subtracts a deterministic inset derived from border and padding; that inset is not
another Frame you author.

**Worked example** (no border or padding): a `1600 × 900` image in a `600 × 600` Frame.

- `contain` scales it to `600 × 337.5`; centered, it leaves bands above and below.
- `cover` scales it to roughly `1066.7 × 600`; the Frame clip shows the middle square.
- Moving the Frame moves the whole Clip. Changing content alignment changes *which part* of the image
  fills the square.

Fit modes, written directly on the Clip:

| `fit` | Behavior |
| --- | --- |
| `contain` (default, centered) | Whole image visible; may leave space around it |
| `cover` | Fills the destination; may crop |
| `stretch` | Distorts proportions to fill the destination |
| `fit-width` / `fit-height` | One dimension sets the scale |
| `native` | The source's own pixel size |
| `scale-down` | Native size unless that would overflow, then contain |

`stretch` only changes spatial size. Timed-source sampling is a different, partial relation
documented in [Visual Clips](visual-clips.md); fit never implies anything about time.

### The open escape hatch: an explicit map

When the fit vocabulary cannot express what you need, author the map itself and pass it with
`mapping`. It can rotate, skew, reflect, or put the source outside its Clip Frame. The matrix takes
source-local pixels straight to program-picture pixels:

```reel
<space:Map id="turned" xx="0" xy="-0.5" yx="0.5" yy="0" tx="920" ty="180"/>

<visual:Track id="graphic" timeline={program.timeline}>
  <visual:Clip image={poster} extent={poster-size} during={program.title}
    frame={layout.full} z="20" mapping={turned}/>
</visual:Track>
```

The equations are `x' = xx*x + xy*y + tx` and `y' = yx*x + yy*y + ty`. Because the map is already in
program coordinates, it cannot be combined with any fit or alignment attribute. The Frame keeps
clipping, border, padding, shadow and whole-Clip motion, and never rewrites the map. Project
components can build the same `SpatialMap2D` through the public package API and share one value with
every consumer that needs the identical projection.

## Align the picture inside its destination

The fit shorthand matches a point on the scaled source to a point in the fitting area:

| Clip attribute | Meaning |
| --- | --- |
| `frame-x`, `frame-y` | Destination alignment point, `0` to `1` across the fitting area |
| `content-x`, `content-y` | Point on the scaled source that lands there, also `0` to `1` |
| `fit-offset-x`, `fit-offset-y` | Additional pixel shift of the source (positive values move it right / down) |
| `fit-constraint` | `bounded` clamps the fitted rectangle to its permitted range; `free` keeps your alignment and offsets as written |

All four point values default to `0.5` and offsets to zero. To pin a `cover` crop to the top, set
`frame-y="0"` and `content-y="0"`. These fractions only align content *within* the fitting area;
to move the whole card or inset, move its Frame.

Under `bounded`, a source larger than the area keeps that axis covered and a smaller source stays
inside it, so an offset may be clamped, even to zero when sizes match. Choose `free` when revealing
space through an offset is part of the design. Pick alignment from the real subject and
composition: these numbers are your crop decision.

## Shape the outer frame

Clipping, border, padding, shadow and frame paint all belong to the outer Frame, set in the optional
treatment Recipe:

| Recipe property | Effect |
| --- | --- |
| `clip: frame` / `clip: rounded` / `clip: none` | Rectangular clip, rounded clip, or show overflow |
| `radius` | Corner radius in pixels; only takes effect with `clip: rounded` |
| `padding` | Quoted pixels: `"12"` all sides, `"8 12"` vertical/horizontal, `"8 12 16 12"` top/right/bottom/left |
| `border-width`, `border-style`, `border-color` | Outline of the Frame |
| `shadows` | Shadows behind the Frame |
| `frame-paint` | Color behind the source, including space left over by fitting |
| `opacity`, `blur`, `brightness`, `contrast`, `saturation` | Treatment of the sampled picture only |

A circular presenter inset, assuming the normalized media, local domain and namespaces exist:

```reel
<space:AnchoredFrame id="presenter-frame" within={canvas.bounds}
  x="94%" y="94%" width="320px" height="320px" anchor="bottom-right"/>
<time:Clock id="clock" frame-rate="30"/>
<time:Timeline id="speech" clock={clock} end="opening.end">
  <time:Window id="opening" from="start" for={opening-media.extent}/>
</time:Timeline>
<visual:Track id="presenter" timeline={speech.timeline}>
  <visual:Clip id="opening" media={opening-media.media} during={speech.opening}
    frame={presenter-frame} z="20" fit="cover" treatment={look.presenter}/>
</visual:Track>
```

```grade
look.presenter {
  clip: rounded;
  radius: 160;
  border-width: 3;
  border-color: #D8C7A8;
}
```

Notes on that result:

- A square Frame with a radius of half its side is a circle. This is a geometric crop; a
  subject-shaped cutout has to come from prepared transparent media.
- For a rounded card, size the radius to the card.
- Rounding follows the Frame, not the picture. A smaller `contain` picture sitting away from the
  corners keeps square corners of its own. For rounded corners that hug the picture, make the Frame
  match the displayed aspect and place the content flush.
- Border and padding both shrink the fitting area while the outer Frame keeps its size. Padding moves
  where fitting happens; the clip still follows the outer Frame.
- A border traces the Frame's edge and a shadow falls behind the Frame. Opacity and filter values
  change only the sampled picture; frame paint and decoration look the same regardless.

An authored `space:Path` given as the Clip's `clip` attribute replaces the treatment clip with that
shape, in program-picture pixels.

## Move the frame or move its contents

Two different motions:

- A typed **`Motion`** (Pose keyframes) moves or fades the entire framed occurrence, border and paint
  included.
- **`Sampling`** children pan, zoom or rotate the mapped picture *underneath* a still frame. Use it for
  a travelling crop or a slow push-in while the card outline holds.

```reel
<visual:Clip media={prepared.media} during={detail}
  frame={detail-frame} z="20" fit="cover" treatment={look.detail}>
  <visual:Sampling at="start" zoom="1"/>
  <visual:Sampling at="end" zoom="1.08" y="-18"/>
</visual:Clip>
```

This sits inside a Visual Track, with prepared media, a resolved Window, a Frame and a Recipe already
declared. The fields move the sampled source: `x` and `y` shift it in pixels, `rotate` turns it
in degrees, `zoom` is a scale, `easing` shapes the interval, and `at` runs over the source unit's active
span from `start` to `end`, with percentages in between. Sampling applies after the resolved static
mapping, so its movement can reveal empty space inside the Frame; choose crop and motion together so
coverage holds.

[Visual Track](visual-clips.md) places explicit footage and owns source-time inputs; its installed
vocabulary lists every appearance and motion field. When a scene must coordinate the viewport with
surrounding graphics, let its
[component program](component-visuals.md#compose-video-and-graphics-in-one-html-visual) own the
shared motion.

## Carry measured regions through explicit peer evidence

Region Evidence (`@clipkin/region-evidence`) carries pre-measured boxes, one entry per Timeline
Frame, and sits outside static spatial geometry. Each box in its Recipe is a normalized
`[x, y, width, height]`, with `null` where nothing was measured, resolved inside an explicit
Frame. A measurement taken in source-local coordinates only positions text correctly after you
account for its real time placement and for the source-to-picture mapping of the actual visual
occurrence.

[Caption tracking](../playbooks/craft/caption-tracking.md) explains producing and applying head
regions. When you build a new component, its visual element tree positions every child against its
parent; [component visuals](component-visuals.md) documents that last layout boundary.

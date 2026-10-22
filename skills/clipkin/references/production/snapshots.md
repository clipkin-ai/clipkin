# Inspect the current picture

Reach for `clipkin snapshot` first whenever the question is about the visible state, layout or motion
of an existing production. It captures chosen frames of the current picture through the Runtime
Profile's `rasterize-frames` Endpoint. Pick the view that can actually establish what you need:

| View | Establishes |
| --- | --- |
| Snapshot frames | Exact picture states, geometry, typography and motion sequence |
| Studio playback | Motion together with sound, as experienced |
| An encoded video | Facts about the delivered file |

## Capture the work already open in Studio

Open the actual Run in [Studio](studio.md). Once its current preview is ready:

```bash
clipkin snapshot --studio http://localhost:5191 \
  --at-frame 240 --to evidence/comparison-detail

clipkin snapshot --studio http://localhost:5191 \
  --at-frame 240,255,269 --grid 3x1 --cell 480 --to evidence/comparison-states

clipkin snapshot --studio http://localhost:5191 \
  --start-frame 240 --end-frame-exclusive 270 --step-frames 1 \
  --grid 4x3 --cell 480 --to evidence/comparison-motion
```

Use the address of the Studio session that is already running, and frame numbers located in its
current `HtmlProgram`; the values above only demonstrate the options. Find meaningful events through
the Script, the Timeline or the Studio playhead, then pass those frame positions to the command.
Choosing frames never changes the authored timing.

What happens in the call:

- Studio hands over its already-compiled `HtmlProgram` and the material the Run selected. Nothing is
  lost on the way: declared fonts and images, video sampling, transparent Surfaces, and assets a
  component references from its HTML visual all arrive intact.
- One immediate request is sent, keeping the `HtmlProgram` clock and any component-local clocks.
- Images are written straight into the chosen directory.
- No Build is created, nothing is generated and nothing is encoded.

Add `--runtime <profile>` and `--project <project>` when you need an explicit selection; otherwise run
it inside the project that already chose its Profile. The command names the selected Endpoint before
running. When several Endpoints offer frame capture, choose one with the Profile's
`@clipkin/html-program@1#rasterize-frames` binding. Browser preparation belongs to that Provider; see
[local tools](../environment/local-tools.md#prepare-the-local-rendering-browser).

## Size the evidence to the question

- `--at-frame` takes one frame or a strictly increasing comma list.
- A range runs from `--start-frame` up to, but not including, `--end-frame-exclusive`; `--step-frames 1` keeps every
  frame. Indices start at zero on the `HtmlProgram` clock.
- Each chosen frame lands on disk as a PNG at full resolution. Open single ones to judge type, edges and geometry.
- `--grid <columns>x<rows>` adds paginated contact sheets. `--cell` sets each picture's width in the
  sheet (default 480); a label under each cell gives its original frame index and time. The full-size
  PNGs are still there.
- `--json` reports output paths and frame positions for follow-up inspection.

Match the scale to the question: widen the interval to understand a handoff, take every frame to
understand a movement, enlarge to judge small detail. When comparing with a reference, line up the
*corresponding event* in each, since different performances can put it at different seconds. Finally,
play the full passage in Studio, with sound, to judge whether the states you inspected hold
together in motion.

## Existing HTML and source video

Snapshot only works from Studio's typed program: it takes `--studio <url>` and refuses a bare HTML
file or URL, because raw HTML is not reverse-compiled into an `HtmlProgram`. Open the work in Studio
first. Snapshot is an `HtmlProgram` frame operation; screenshots of ordinary websites and apps belong
to [browser capture](browser-capture.md).

For an existing source video or an encoded Result, use the media commands. With `--every-frame` they
decode each requested interval a single time and label frames with their true source timestamps,
which also holds for variable-frame-rate files:

```bash
clipkin media tiles reference.mp4 --start 8 --end 9 --every-frame \
  --columns 4 --rows 3 --cell 480 --to evidence/reference-motion
```

- `clipkin media frames --every-frame` saves individual images instead of grids.
- `clipkin media tiles --ranges ranges.json --every-frame` walks several chosen intervals.
- `--transcript <json>` prints the words around each real frame; `--around <phrase>` with a transcript
  finds the interval for you.

[Reference understanding](../creation/reference-video.md) ties these views to coarse and fine
observation.

## After a composition change

This is the preferred picture-review loop:

1. Keep the accepted material selected in the Run.
2. Let Studio compile the updated Source.
3. Capture the affected states and the handoffs around them.
4. Carry what you learn back to the owning Source, component or Treatment.

When a short encoded clip with sound is the evidence or the deliverable, use a
[range render](rendering.md#choose-a-render-interval-in-frames). For final export, render the whole
file and inspect it.

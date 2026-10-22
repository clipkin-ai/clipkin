# Composition and rendering

Use this page when you assemble the deliverable, or render a range of frames to review it. The
contributing layers are explained in [Tracks](tracks.md); choosing existing media for this execution
is explained in [Runs](runs.md).

The pipeline has three stages:

1. **Components** author picture and sound contributions.
2. **Film** combines the chosen contributions with a Timeline and a Canvas into a Composition.
3. **Rendering** evaluates that Composition over a frame interval and encodes the media.

Because the Composition sits in the middle, the same work can be inspected in Studio, rendered in
part, or rendered whole.

## Assemble the picture and sound

With the named inputs already declared:

```reel
<import as="film" from="@clipkin/film@1"/>
<import as="html" from="@clipkin/html-video@1"/>

<film:Film id="main" canvas={canvas.canvas} timeline={speech.timeline}
  appearance={look.film.main}>
  <film:Track source={picture.visual}/>
  <film:Track source={mix.audio}/>
  <film:Track source={coverage.visual}/>
  <film:Track source={captions.visual}/>
  <film:Track source={music.audio}/>
</film:Film>
<html:Video id="final" composition={main.composition} timeline={speech.timeline}/>
```

- The Film Recipe carries exactly one property, `background`, as a hex color, for example
  `film.main { background: #18212A; }`. It is the flat fill behind everything.
- Canvas sets the picture size; the Timeline sets program time.
- `picture.visual` comes from a Visual Track and `mix.audio` from an Audio Track. Nothing is included
  implicitly. A normalized clip contributes picture *and* sound only when it is placed twice: once
  as a Visual Clip, once as an Audio Clip.
- Stacking order is authored in the Visual Tracks' Presents (their `z`). Reordering `film:Track`
  children does not reorder the picture.
- Studio opens `main.composition`, the assembled whole. `final.video` requests an encoded
  file. HTML Video accepts any compatible Composition, including one assembled by another component.

A talking-head piece with nothing else can get by with a single Visual Clip, a single Audio Clip and,
optionally, Caption. The extra
coverage and graphics above just illustrate optional independent contributions.

## Compose an authored animation

Every Film needs a time axis, with or without speech or prepared media.

- **Speech-led piece:** keep passing `timeline={speech.timeline}`. That Timeline defines the film's full
  duration and is also where Tracks look up Script references.
- **Pure motion-graphics piece:** write your own Timeline whose `end` is stated outright, and hand it to the
  components, Film and HTML Video.

```reel
<import as="time" from="@clipkin/timeline-author@1"/>
<time:Clock id="animation-clock" frame-rate="30"/>
<time:Timeline id="animation" clock={animation-clock} end="8s">
  <time:Instant id="question" at="0.5s"/>
  <time:Instant id="answer" at="2s"/>
</time:Timeline>

<!-- conversation is the project's own visual component. -->
<chat:Scene id="conversation" timeline={animation.timeline} within={canvas.bounds} font={font}
  during={animation.window} title="Launch crew">
  <chat:Message id="question" sender="Maya" side="left" at={animation.question} text="Ready?"/>
  <chat:Message id="answer" sender="Leo" side="right" at={animation.answer} text="Let's go."/>
</chat:Scene>
<film:Film id="main" canvas={canvas.canvas} timeline={animation.timeline} appearance={look.film.main}>
  <film:Track source={conversation.visual}/>
</film:Film>
<html:Video id="final" composition={main.composition} timeline={animation.timeline}/>
```

This assumes the Canvas, font, Film Recipe and project package are declared. Points to remember:

- `end` accepts seconds, milliseconds or frames and must fall on a frame boundary.
- `Clock` is still the separate, duration-free input used to normalize real media.
- Drawing code produces the picture for each requested frame; the Film background supplies the canvas
  color.
- A Film without any AudioTrack renders as a silent file.
- Render ranges and worker settings behave exactly as they do for spoken work.

Media, Typography, Audio and graphic Tracks all accept this same Timeline. Visual and Audio Clips
still receive media and Windows explicitly: the Timeline never contains or discovers media. Caption
draws on its document tied to speech; the chat scene owns its own authored messages. The working
example `examples/semantic-composition/chat.reel`, with its `@example/chat-scene` package, shows a
complete code-only composition in which messages arrive at any authored time and the thread scrolls.

## Choose a render interval in frames

```reel
<html:Video id="detail" composition={main.composition} timeline={speech.timeline}
  start-frame="240" end-frame-exclusive="360"/>
```

- Both bounds are frames on the original program clock, and both must be written together. Omit both
  for the whole program.
- The interval includes frame 240 and stops before 360: 120 frames, which is seconds 8 to 12 at
  30 fps.
- For a rational frame rate, convert using its numerator and denominator; do not round the rate first.

Program time is untouched and picture and sound share the interval. Here the renderer evaluates the
original page at seconds 8 to 12 and encodes those frames as a four-second clip that starts at zero.
An animation already under way at second 8 keeps its state. A short Run can target `detail.video`
while the normal Run keeps targeting `final.video`.

**A range limits only the final render; upstream generation still follows the selected graph.** Keep
usable normalized media and alignment evidence selected as Run Candidates while you iterate on a
Caption or motion-graphics revision. Check `clipkin plan` for the work that remains before you submit,
and `clipkin pricing <run>` if any paid request is still in it.
[Authoring](authoring.md#reuse-produced-work-explicitly) explains how to choose the reuse boundary.

## How a render executes

Rendering is three separate needs, which a Runtime can bind to different compatible Endpoints:

1. the HTML program compiler lowers the Composition and the selected rasterization Provider draws
   its picture;
2. Timeline audio is prepared from the included AudioTracks;
3. picture and sound are muxed into the delivered file.

Before the first local render, or any time the browser cannot start because its executable is absent, follow
[browser preparation](../environment/local-tools.md#prepare-the-local-rendering-browser); installing
the browser and configuring its download are that Provider's responsibility.

The local HTML Provider (`@clipkin/provider-html-local`) accepts range requests and can split one
program across several browser workers. Browser choice, download settings and worker capacity are
configured in that Provider's Profile entry; [Runtime profiles](../environment/profile.md) and the
Provider's README own those settings, and the Source keeps the same render declaration. Another
Provider declares which request forms its deployment supports.

What a short interval saves, and what it does not:

- It cuts frame capture and source-frame extraction.
- Every asset the document declares is still prepared, and typed Surfaces are still checked.
- Extra browsers help only while the machine has capacity for them; preparation and final encoding
  cost time on their own.
- Reusing media through the Run avoids generation, but a previous render's temporary preparation is
  not kept.

**Working order for a local composition change.** Start with a [snapshot](snapshots.md) of Studio's current `HtmlProgram` to
verify the edited relationship and the transitions around it, with the approved material still
selected in the Run. Render a range when you need an encoded clip; render the full deliverable once
the composition is ready.

**While rendering**, keep the user informed about which stage is running and how far along it is. The Provider
emits stage events (decoding, browser startup, capture, encoding, storage), and `clipkin logs <build-id>` keeps those
timings and details for investigating a slow or failed stage.

**Failures.**

- An image that fails to decode, or a declared font that fails to load, stops capture with an error.
  Fix the named resource in the Source or component that owns it, then retry with accepted media
  still selected in the Run.
- When a local render times out, that attempt is over; its capacity is released once the work has
  stopped. The failure and any Outputs already finished belong to that Build's Result. Continue with
  a new Run and Build that reuse the available media explicitly, as described in [Runs](runs.md).

Submit, follow and retrieve `final.video` or `detail.video` with [Builds and Results](builds.md).
Judge the interval or the full deliverable against the intended work with [Review](review.md).

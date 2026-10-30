# Preparing media for a production

Open this page when you bring files into a project, wire generated media onward, pick streams, or
edit a clip before a component or a model reference consumes it. Related owners:

- independent picture placement and playback: [Visual Clips](visual-clips.md);
- every other content relationship: [Tracks](tracks.md);
- a source video that lives behind a link: [video download](video-downloads.md);
- website screenshots, page recordings and local HTML graphics: [browser capture](browser-capture.md).

## Start from what the next consumer needs

Three things stay separate on this page: what the source *is*, how you *prepare* it, and how the
production *uses* it. Decide preparation by looking at the consumer:

| Material or intended use | What has to reach the consumer |
| --- | --- |
| A still image (a transparent cutout included) | The bytes plus their true pixel dimensions, so it can be placed on its own; the component decides the display Window. |
| Video, with or without sound or alpha | Chosen streams, a local duration and a frame clock, whenever it feeds a prepared-media input. |
| Audio | One chosen audio stream and its prepared local time. It may serve as a Script performance, music, narration or an effect. |
| A compositable surface | Its declared pixels, extent and any animation data. Feed the producing package's output straight in. |
| Text, shapes or a scene drawn in code | The component's data and resources. It draws directly; no intermediate media file is needed. |
| A model reference | Exactly the image, video or audio input that model's Surface accepts. Normalization is not a blanket prerequisite. |

Files, generated Outputs and earlier Results are all just *sources* of these values. A reference
never has to appear in the finished film. Footage of a person carries no semantic meaning by
default either: the author creates that link by aligning one Script Segment to the footage's local
domain. Explicit reuse of a Result belongs to [Runs](runs.md); still-image preparation belongs to
[Image operations](image-operations.md).

Two distinct steps can attach time to moving media:

1. **Normalization** fixes the frame clock and the local domain, and selects the picture and audio
   streams.
2. **`NarrativeAlignment`** adds one Script Segment's word and boundary positions inside that local
   domain.

[Timeline construction](timeline.md) can read the prepared Extent, and a domain projector can map the
local domain onto a Timeline Window of the same length. Neither step alters the media value itself.

## Files and generated Outputs

Each file declaration publishes a **Blob** (a reference to the file's bytes) under the element's
own id:

```reel
<import as="media" from="@clipkin/media@1"/>

<media:Image id="product" src="./assets/product.png"/>
<media:Video id="performance" src="./assets/performance.mp4"/>
<media:Audio id="music" src="./assets/music.wav"/>
```

Pass `{product}`, `{performance}` and `{music}` to any input that takes a Blob. Model Surfaces
expose the same kind of value on one of their ports, for example `{portrait.image}` or `{opening.video}`;
the package vocabulary names that path. `src` resolves relative to the Source that declares it, and
[project setup](../creation/project-files.md#establish-the-project-boundary) describes the project
boundaries that apply. A file whose extension does not identify its type takes `media-type`.

### Supplied recordings

A recording the user hands you can play three parts: a reference for new work, an independent
picture or sound, or footage the finished piece keeps. When the passage should keep its real
recorded delivery, the recording itself can carry the Script; nothing has to be regenerated.

When only part of the file belongs in the piece, make a new local file with `clipkin media cut`:

```bash
clipkin media probe assets/recording.mp4
clipkin media cut assets/recording.mp4 --start 12.4 --end 19.8 --to assets/opening.mp4
clipkin media cut assets/recording.mp4 --keep 12.4:15.7 --keep 16.2:19.8 --to assets/opening-edited.mp4
clipkin media cut assets/voice.wav --keep 0.3:4.1 --keep 4.6:9.2 --to assets/narration-edited.wav
```

- `--start`/`--end` keeps one stretch.
- Repeating `--keep` joins several stretches of the *same* source, in order.
- Picture and sound travel together. An audio-only result is written as WAV; MP4 suits video.
- Outputs never overwrite an existing path. `clipkin media --help` is the authority on options.

Declare the result as `media:Video` or `media:Audio`, according to its job. If the edited delivery
is a Script performance, normalize it, then align its local domain when something else needs
positions inside that performance (see below). Footage that is merely shown can go straight into a
Visual Clip or another visual component, with its own sound included when the piece wants it. A
file cut never decides Script or Segment boundaries.

`clipkin transcribe <audio|video> --to <transcript.json> --language <code>` helps you inspect what a
recording says. Its word times refer to that input file. A retained, edited performance gets its
own semantic alignment inside the Build when the composition actually uses that timing.

### Stills

An image reference can feed a model as it is. A still placed in a Visual Clip also needs its real
IntrinsicExtent: read the dimensions with `clipkin media probe <file>` and declare them with
`space:Extent`. [Spatial layout](spatial.md) explains how an extent differs from a destination Frame.

## Prepare moving media on the program clock

Clips arrive with mismatched frame rates, extra streams, or picture and sound of different
lengths. `Normalize` picks the streams you intend and re-times them onto the program's frame clock;
after that, durations add up and playback lines up exactly.

This excerpt prepares one performance and one separate soundtrack:

```reel
<import as="mediaop" from="@clipkin/media-operations@1"/>

<time:Clock id="clock" frame-rate="30"/>
<mediaop:Normalize id="performance-media" source={performance} clock={clock}
  video="primary-moving" audio="default" span-authority="video"/>
<mediaop:Normalize id="music-media" source={music} clock={clock}
  video="none" audio="default" span-authority="audio"/>
```

The Clock is only an authored rate; the prepared media determines the length. Every piece of media
that will join one program should share the same Clock.

| Attribute | Values and meaning |
| --- | --- |
| `video` | `primary-moving`, `none` (audio-only material) or `stream:<index>` |
| `audio` | `default`, `none` (carry no sound) or `stream:<index>` |
| `span-authority` | `video` or `audio`: which selected stream sets the duration when lengths disagree; the other is trimmed or padded |
| `clock` | Always an explicit reference |

`primary-moving` skips attached cover art, prefers a declared default and fails rather than guess in
an ambiguous container. `default` audio takes the default or the only plausible stream; name a
`stream:<index>` when the container really holds several candidates you know about. A clip that has no
sound at all, such as a generation made with `generate-audio="false"`, has no audio stream to take:
prepare it with `audio="none"` and leave it out of every Audio Clip, or the build stops. Instead of the
direct attributes you may supply a `recipe` carrying the same policy (one or the other, never both).
Run `clipkin vocabulary @clipkin/media-operations --tag Normalize` for the current selectors.

Normalize reads the bytes and publishes three ports:

- `{performance-media.media}`: `SynchronizedMedia`: a precise number of local frames on the chosen
  Clock, carrying picture, audio, or both;
- `{performance-media.domain}`: its source-local temporal domain;
- `{performance-media.extent}`: its unpositioned length.

Audio becomes a 48 kHz render stem at its original level. Balance, fades and ducking stay mix
decisions, covered in [Audio Track and sound mix](../playbooks/craft/sound-mix.md). Selecting
embedded audio is a media fact only; it claims nothing about who speaks.

## Associate a performance with Script when its timing is consumed

In performance-led work, Script holds the wording and the meaningful events. Once Caption, a
semantic picture change, a sound event or any other consumer needs to know *where* those happen,
alignment finds them on the accepted media's local domain:

```reel
<import as="whisperx" from="@clipkin/whisperx@1"/>

<whisperx:Alignment id="opening-semantic" narrative={story}
  segment={story.segment.opening} media={performance-media.media}
  domain={performance-media.domain} language="en"/>
```

`language` is the spoken language, written as an explicit lowercase code that the selected WhisperX
Endpoint supports; it is never guessed from the Script or the audio. WhisperX supplies timed
evidence and a deterministic step maps it onto the Script. The output,
`opening-semantic.alignment`, is a `NarrativeAlignment`: Segment and Token boundaries on that named
local domain, with no media and no Timeline position attached.

Then project it, in one explicit step, by pairing the alignment and its complete local domain with a
Window of equal length:

```reel
<import as="semantic" from="@clipkin/narrative-temporal@1"/>

<time:Timeline id="program" clock={clock} end="opening.end">
  <time:Window id="opening" from="start" for={performance-media.extent}/>
</time:Timeline>
<semantic:Projection id="story-time" narrative={story} timeline={program.timeline}>
  <semantic:Map alignment={opening-semantic.alignment}
    domain={performance-media.domain} window={program.opening}/>
</semantic:Projection>
```

From here on, the picture and sound Tracks consume plain normalized media placed in explicit
absolute Windows; they neither keep nor read the semantic relation. Audio-only A-roll follows exactly the same chain
and needs no placeholder picture.

## Project a wordless Segment when its identity is consumed

When a consumer needs the boundaries of a Segment that has no words, align it straight to its whole
local domain; no transcription is involved. Write the `whisperx:Alignment` with `narrative`,
`segment` and `domain`, and leave out `media` and `language`. It contributes the real start and end
identities of the Segment and no Tokens. The media Extent alone can still build the Timeline without
it. A silent action inside such a passage needs its own authored or measured event if some other
component must react to it.

## Give a still a duration when that is its role

A still B-roll Clip already lives inside an authored Window, so it does not need this. Use
`StillVideo` when one or more images must *become* a time-bearing video Artifact:

```reel
<import as="mediaop" from="@clipkin/media-operations@1"/>

<mediaop:StillVideo id="opening-still" source={product} duration="6s" clock={clock}/>
<mediaop:Normalize id="opening-media" source={opening-still.video}
  video="primary-moving" audio="none" span-authority="video" clock={clock}/>
```

The result is a video-only MP4 Blob at `.video`. For several images, write `mediaop:Still` children
instead of `source`; the duration is split among them by their optional `weight` (equal shares
otherwise), in whole frames, and each image holds at least one frame. Images of differing sizes are
letterboxed on black into the first image's frame. `duration` must land on a whole frame of the
Clock. Normalize the output before using it as prepared moving media. Its role comes from the
downstream Source relationships, like any other video.

## Change the bytes with graph operations

```reel
<mediaop:Transform id="edited" source={performance-media.media}>
  <mediaop:Trim tail="0.25s"/>
  <mediaop:Retime rate="1.05"/>
</mediaop:Transform>
<mediaop:ExtractAudio id="voice-reference" source={edited.video} audio="default"/>
<mediaop:ExtractFrame id="frame-reference" source={edited.video}
  video="primary-moving" at="last"/>
```

- `Transform` takes normalized `SynchronizedMedia` and runs its `Trim` and `Retime` children in the
  order written. `Trim` accepts `start`, `end` or `tail` (never `end` with `tail`); `Retime` changes
  tempo while keeping pitch.
- `ExtractAudio` writes a 48 kHz stereo WAV; `ExtractFrame` writes a PNG and accepts `at` values
  `first`, `last`, `frame:<index>` or `time:<seconds>`.
- All of these publish Blobs. Normalize an edited clip again before it enters a prepared-media
  input, and realign an edited performance when its timing moved and something downstream reads
  that alignment. Extracted audio or a frame can feed a compatible model reference port directly.

Graph operations are for repeatable preparation that belongs to the production. `clipkin media`
commands are for inspection and for evidence you deliberately export. Still-image geometry changes
and compositing live in one installed vocabulary, `@clipkin/image-operations`; choose the operation
that fits how the asset will be used.

## Keep original and processed material explicit

A crop, a background removal or a flattened composite each produce a *selected* asset. Normalize
that output, and keep the original wherever the production may still want its pixels. Transparent
video goes through the same Normalize and Visual Clip path as opaque video. A circular Clip or a
rounded Frame is different: it masks the Clip's geometry and does not remove any background.

When the original and the processed picture both appear on screen, keep both and wire each one as
its own explicit media input. If a picture-only change keeps the same frame-for-frame
correspondence, a preparation component in the project can carry over the accepted local domain and
alignment and publish the result as a fresh visual source. That is a relation the author writes; variants never inherit
it automatically.

### Isolating a subject

| Material | Route |
| --- | --- |
| Moving subject (the starter's route) | `@clipkin/bria-matting` exposes `RemoveBackground`, served by the starter's `replicate.default`: `<bria:RemoveBackground id="cutout" source={performance.video}/>`, then read `cutout.video`. `format` chooses `WEBM` (VP9 with alpha, default) or `MOV` (ProRes 4444); the cutout is silent unless `preserve-audio="true"`. Sources over 60 seconds are refused before upload: cut a longer performance into parts of at most 60 s, matte each, and place the parts in sequence. |
| Moving portrait, when `volcengine.default` is declared | `@clipkin/volcengine-matting` exposes `Portrait` with the same `source` and `format` ports (`<matte:Portrait id="cutout" source={performance.video}/>`), takes sources up to 20 minutes, and needs a Volcengine key; it is not in the starter. Only the import, the tag and `preserve-audio` differ from BRIA, so the rest of the Source stays unchanged. |
| Footage that is already transparent | Feed it to Normalize as it is. |
| Still reference | Removing its background does *not* make generated video transparent. |
| Fixed flat arrangement of stills | [Image Compose](image-operations.md#flatten-a-fixed-still-image-arrangement), when a flattened image is the output you want. |

Match the operation to what it actually accepts: a moving silhouette needs a video matte or a
suitable keying step, and deterministic Image Operations will not quietly turn into one.
[Video direction](../playbooks/craft/video-direction.md#prepare-footage-for-subject-isolation)
covers preparing and judging footage for isolation.

Order of operations depends on the implementation you select. With the current local Media
Provider, Normalize keeps input alpha (transparent input becomes VP9 WebM), but Transform writes an
opaque MP4. So trim or retime a performance *before* matting it. Read each operation's output
behavior instead of assuming every video step keeps transparency.

Trimming, retiming or replacing a performance changes its local temporal relation, so it needs a new
local domain, and new semantic timing too when downstream consumers read it.
[Reuse boundaries](authoring.md#reuse-produced-work-explicitly) say which completed Output can stay
selected.

### Source shape

Pick the source's proportions and framing for the footage the piece actually needs. A full-frame
talking piece can be generated at the final aspect ratio; a later inset or split screen does not
dictate the generated source's shape. [Spatial layout](spatial.md) owns destination geometry, and
image and video direction own the camera view. Hand those prompts visible, performable facts, not
motion-graphics instructions that the model cannot turn into a camera image.

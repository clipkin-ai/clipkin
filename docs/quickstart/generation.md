---
title: Media & Generation
description: Bring in your own pictures, sound and video, write prompts, and generate new takes with Seedance and the other models.
---

Everything a video is made of arrives in one of two ways. Either you supply it (a product photo,
a logo, a voice recording, a clip you shot) or a model generates it from a prompt. This page covers
both, and the prompt templates that make generated takes consistent.

```reel
<import as="media" from="@clipkin/media@1"/>
<import as="text" from="@clipkin/text@1"/>
<import as="seedance" from="@clipkin/seedance@1"/>
```

## Bring in your own files

Declare each file once, with an id, and use that id wherever the file is needed:

```reel
<media:Image id="product" src="./assets/product.png"/>
<media:Image id="presenter" src="./assets/presenter.jpg"/>
<media:Audio id="voice-sample" src="./assets/voice-sample.mp3"/>
<media:Video id="dance" src="./assets/dance-moves.mp4"/>
```

- **Refer to the file by its id alone:** `{product}`, not `{product.image}`.
- **Paths start with `./` or `../`** and are read relative to the `.reel` file. The file has to be
  inside your project folder, or one you allow with `--asset-root`. Web addresses aren't accepted:
  download the file into the project first. Files from an installed package use `package:@scope/name/path`.
- **File types** are recognized from the extension. Images: `.png`, `.jpg`/`.jpeg`, `.webp`, `.gif`,
  `.avif`. Audio: `.mp3`, `.wav`, `.m4a`, `.aac`, `.flac`, `.ogg`, `.opus`. Video: `.mp4`, `.mov`,
  `.webm`, `.m4v`. For anything else, add `media-type` (for example `media-type="image/png"`).
- **What a file means depends on where it's used.** The same image can be a reference for a model, a
  picture on screen or a layer in a composite, and the same audio can be a voice sample or a
  soundtrack.

Fonts are files too; they're covered in [Grade Stylesheets](./styles.md#fonts).

## Write a prompt

`text:Value` holds a piece of text, usually a prompt, that one or more models can read:

```reel
<text:Value id="product-shot">
  Slow push-in on a matte black water bottle on a concrete ledge at golden hour.
  Condensation on the surface, soft city bokeh behind. No text, no logos.
</text:Value>
```

Use it as `prompt={product-shot}`. Clipkin tidies the text the way you'd expect: the shared
indentation and the blank lines at the start and end are removed, and line breaks inside are kept.
Write `&lt;` for a literal `<`. Comments (`<!-- … -->`) are left out.

For prompts built from a template plus the Script's lines, see [Prompt templates](#prompt-templates)
below.

## Generate video with Seedance

Seedance comes in three forms, depending on what you give it:

| Element | You give it | Good for |
|---|---|---|
| `seedance:TextVideo` | A prompt only | Scenes you can describe without a particular look to keep |
| `seedance:FrameVideo` | A first frame, and optionally a last frame | Bringing a still to life, or moving from one image to another |
| `seedance:ReferenceVideo` | Reference images, videos and audio | Keeping a product, place or voice consistent across takes |

Each produces a video, `{id.video}`, which you then prepare and place as in
[Timing & Assembly](./timing.md).

```reel
<seedance:TextVideo id="bottle-shot" model="fast" prompt={product-shot}
  duration="6" resolution="720p" aspect-ratio="9:16"/>

<seedance:FrameVideo id="bottle-open" model="fast" prompt={opening-motion} duration="5"
  first-frame={product} first-frame-person-reference="false"/>

<seedance:ReferenceVideo id="bottle-hike" model="mini" prompt={hike-scene} duration="8"
  generate-audio="true">
  <seedance:Reference image={product} person-reference="false"/>
  <seedance:Reference image={trail} person-reference="false"/>
</seedance:ReferenceVideo>
```

### Settings

| Attribute | Required | Values |
|---|---|---|
| `model` | yes | `standard`, `fast`, `mini` (Seedance 2.0 in three sizes) or `2.5` |
| `prompt` | yes | A text, such as a `text:Value` |
| `duration` | yes | Whole seconds: 4–15, or 4–30 on `2.5` (where `-1` lets the model choose) |
| `resolution` | no | `720p` unless set. `480p` and `720p` on all models; `1080p` on `standard` and `2.5`; `4k` on `standard` |
| `aspect-ratio` | no | `9:16` unless set. Also `1:1`, `4:3`, `3:4`, `16:9`, `21:9` and `adaptive` |
| `generate-audio` | no | **`false` unless set**, so takes are silent by default. Set `true` for speech or sound |

`TextVideo` also takes `web-search` (not offered through Replicate or BytePlus). `FrameVideo` needs
`first-frame` with `first-frame-person-reference`, plus `last-frame` with
`last-frame-person-reference` if you give a last frame.

### How long a take should be

`duration` is a plain number of seconds (`duration="7"`, not `"7s"`). For a spoken take, estimate how
long the line runs before choosing it:

```bash
clipkin estimate main.reel --segment hook --language en --pace normal --rounding ceil
```

The estimate counts the Segment's syllables (or the equivalent for other languages) at a speaking pace (`slow`, `normal` or `fast`, or an
exact `--rate`) and calls no service. It understands English, Chinese, Japanese and Spanish
(`--language auto` guesses), and `--padding` adds breathing room. Round up to a whole second the
model accepts. The take's real length, and where each word falls, come from the generated take itself.

### References

Each `seedance:Reference` gives one `image`, `video` or `audio`:

- **Images** carry appearance: a product, a place, a costume, a person.
- **Videos** carry movement: a dance, a physical action or a camera move to imitate. The clip's length
  doesn't set the take's length.
- **Audio** carries a voice or a sound. On Seedance 2.0 it needs at least one image or video alongside
  it. Any common audio format works except `.m4a`: convert that to MP3 or WAV first.

Seedance 2.0 takes up to 9 images, 3 videos and 3 audio clips, 12 in all. Seedance 2.5 takes up to
30 images, 10 videos and 10 audio clips. The services also limit how long reference clips can be:
15 seconds of video and audio combined on Replicate; on BytePlus, 2 to 15 seconds each and 15 in
total (30 on 2.5). Clipkin doesn't measure this for you, so a clip over the limit is refused by the
service.
A reference's position matters: prompts refer to them in order, as `@image1`, `@audio1` and so on.

### References that show a person

Every image and video reference states whether it shows a person, with `person-reference="true"` or
`"false"`. This isn't optional, because services treat real people differently:

- **Replicate**, which a Clipkin account and the default setup use, **refuses any reference marked as
  showing a person.** Product, place and object references work normally.
- **BytePlus**, Seedance's own service, accepts them only when a host application provides an
  approved way to share the image with it. A BytePlus account on its own isn't enough.

**For a real presenter from a photo, use MiniMax H3** (`minimax-h3:ReferenceVideo` or
`FrameVideo`), which accepts a person's photo through Replicate, so it works on a Clipkin account.
PixVerse V6 accepts a person's photo as a first frame only. Mark Seedance references truthfully
either way: `clipkin plan --runtime <profile>` shows a refusal before anything is paid for.

### Where each model runs

| | Replicate (default, Clipkin account) | BytePlus (your own account) |
|---|---|---|
| Seedance 2.0 `standard`, `fast`, `mini` | Yes, up to 720p (4k only when the operator sets a price for it) | Yes, every resolution |
| Seedance 2.5 | No | Yes |
| References showing a person | No | Only with a host-provided asset link |
| `web-search` | No | No (only through Volcengine) |
| Prompts over 4,000 characters | No | Yes |

[Models and Providers](../guide/providers.md) explains how to add a service to your setup.

### Reuse a take's voice

To keep a narrator's voice consistent, take the sound from one generated take and give it to the
next as a reference. The take it comes from must be declared above:

```reel
<import as="mediaop" from="@clipkin/media-operations@1"/>

<seedance:TextVideo id="intro-take" model="fast" prompt={intro-prompt} duration="6"
  generate-audio="true"/>

<mediaop:ExtractAudio id="narrator-voice" source={intro-take.video} audio="default"/>

<seedance:ReferenceVideo id="next-take" model="mini" prompt={next-prompt} duration="6"
  generate-audio="true">
  <seedance:Reference image={studio-set} person-reference="false"/>
  <seedance:Reference audio={narrator-voice.audio}/>
</seedance:ReferenceVideo>
```

The same package can also trim or retime a video (`mediaop:Transform`) and pull a still out of one
(`mediaop:ExtractFrame`). Both run on your computer with FFmpeg.

## Prompt templates

Writing a good video prompt from scratch every time is slow, and takes drift apart. The Seedance Kits
are ready-made prompt templates for common formats. You fill in the parts that change (the lines,
the action) and pick a few style settings, and the template writes the rest of the prompt the same
way every time.

| Format | Import | Template | You fill in | References, in this order |
|---|---|---|---|---|
| Talking to camera | `speaker` | `speaker-v1` | `dialogue`, optional `action` | Image 1: the speaker in the scene. Audio 1: their voice |
| Silent B-roll | `broll` | `broll-v1` | `story` | One or more images |
| Two-person podcast | `podcast` | `podcast-v1` | `dialogue`, optional `action` | Images 1 and 2: views of A and B. Audio 1 and 2: their voices |
| Video call | `call` | `call-v1` | `dialogue`, optional `action` | Image 1: A in the main tile. Image 2: B in the main tile. Audio 1 and 2: A and B |
| Street interview | `street-interview` | `street-interview-v1` | `dialogue`, optional `action` | Images 1–3: interviewer A, guest B, both together. Audio 1 and 2: A and B. A holds the mic |
| Copy a movement | `motion-reference` | `motion-reference-v1` | optional `direction` | Image 1: the subject. Video 1: the movement |
| Copy a camera move | `camera-reference` | `camera-reference-v1` | optional `direction` | Image 1: the subject. Video 1: the camera move |

A template is used with `text:Render`. Here a B-roll shot of a product, which works on any setup:

```reel
<import as="look" source="./look.grade"/>
<import as="broll-kit" source="@clipkin/seedance-kits/broll"/>

<text:Value id="bottle-story">
  The bottle is filled at a mountain stream, clipped to a backpack, then drunk from at the summit.
</text:Value>

<text:Render id="bottle-prompt" template={broll-kit.broll-v1} recipe={look.broll.outdoor}>
  <text:Set name="story" text={bottle-story}/>
</text:Render>

<seedance:ReferenceVideo id="bottle-broll" model="mini" prompt={bottle-prompt} duration="6">
  <seedance:Reference image={product} person-reference="false"/>
  <seedance:Reference image={trail} person-reference="false"/>
</seedance:ReferenceVideo>
```

- **`Set`** fills a part of the template with text: a `text:Value`, or a Script Segment such as
  `{story.segment.hook.dialogue}`.
- **`recipe`** points at the style settings in your stylesheet, such as camera language or
  performance. [Grade Stylesheets](./styles.md#settings-for-generated-takes) lists every template's
  settings and their options. Leave it out to use the defaults.
- **Give the references in the order the table lists.** The template's wording depends on it.

### Spoken formats and the Script

For speaking formats, `dialogue` comes from the [Script](./script.md):
`{story.segment.hook.dialogue}` gives that Segment's lines with the speaker names in front, as
`HOST: …`. The two-person templates talk about speakers **A** and **B**, so either name the Script's
speakers `<A>` and `<B>`, or say in the `action` who is who.

```reel
<import as="speaker-kit" source="@clipkin/seedance-kits/speaker"/>

<text:Value id="hook-action">
  Leans in on the first line, then relaxes and smiles on the last.
</text:Value>

<text:Render id="hook-prompt" template={speaker-kit.speaker-v1} recipe={look.speaker.founder}>
  <text:Set name="dialogue" text={story.segment.hook.dialogue}/>
  <text:Set name="action" text={hook-action}/>
</text:Render>

<seedance:ReferenceVideo id="hook-take" model="mini" prompt={hook-prompt} duration="8"
  generate-audio="true">
  <seedance:Reference image={presenter} person-reference="true"/>
  <seedance:Reference audio={voice-sample}/>
</seedance:ReferenceVideo>
```

This take shows a person, so it is refused on Replicate and a Clipkin account (see
[above](#references-that-show-a-person)). The same template wording works as the prompt for
MiniMax H3.

A misspelled setting value or a missing required part isn't caught by `clipkin check`; `clipkin plan`
reports it before anything is generated. A misspelled setting *name* is silently ignored, so check
names against the [settings table](./styles.md#settings-for-generated-takes).

## Other models

Seedance isn't the only option. These are also available through Replicate, so they work on a Clipkin
account and the default setup, within the limits noted:

| Kind | Model | Package | Elements | Through Replicate |
|---|---|---|---|---|
| Images | Seedream | `@clipkin/seedream` | `TextImage`, `ReferenceImage` | Yes |
| Images | GPT Image | `@clipkin/gpt-image` | `Image` | 1K only, at auto, 1:1, 3:2 or 2:3 |
| Images | Nano Banana | `@clipkin/nano-banana` | `Image`, `ProImage` | Yes |
| Images | Wan | `@clipkin/wan` | `Image`, `ProImage` | Yes |
| Video | MiniMax H3 | `@clipkin/minimax-h3` | `TextVideo`, `FrameVideo`, `ReferenceVideo` | Yes, including photos of people |
| Video | PixVerse | `@clipkin/pixverse` | `Video`, `ReferenceVideo` | V6 only, no reference images or videos |
| Video | Grok Imagine | `@clipkin/grok-imagine` | `Video` | Prompt only, no reference images |
| Voices | Qwen3 TTS | `@clipkin/qwen3-speech` | `VoiceDesign`, `VoiceClone`, `Speech` | Yes |
| Voices | MiniMax speech | `@clipkin/minimax-speech` | `Speech`, `ClonedVoice`, `ClonedSpeech` | Yes |
| Background removal | BRIA | `@clipkin/bria-matting` | `RemoveBackground` | Yes, up to 60 seconds |

Most outputs are `{id.image}`, `{id.video}` or `{id.audio}`. A few aren't: a designed Qwen3 voice is
`{id.reference}`, and a MiniMax cloned voice is `{id.voice}` (with a sample at `{id.preview}`),
which you then pass to `ClonedSpeech`. To see every attribute of one, run
`clipkin vocabulary @clipkin/<package>`, for example `clipkin vocabulary @clipkin/seedream`.
[Image Operations](./images.md#cut-a-person-out-of-a-video) covers background removal.

## When something is wrong

| Message | What to do |
|---|---|
| "duration has to be a whole number" | Write seconds as a number: `duration="7"` |
| "… has to be from 4 to 15 seconds" | Choose a length the model accepts |
| "resolution for seedance-2-mini only takes 480p, 720p" | Lower the resolution, or use `standard` or `2.5` on a service that offers 1080p (not Replicate) |
| "model only takes standard, fast, mini or 2.5" | Use one of those names (`"2"` isn't one) |
| "has to use the package: asset scheme" | The file path doesn't start with `./` or `../` |
| "cannot be m4a" | Convert the reference audio to MP3 or WAV |
| "port referenceAudio needs one or more of referenceImage, referenceVideo" | Add an image or video reference next to the audio |
| "would use 13 of the 12 it allows" | Too many references in total |
| "Text binding dialogue has no value" | A template part wasn't filled in with `Set` |
| "Text choice found no matching case" | A misspelled template setting value |

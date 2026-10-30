---
title: Timing & Assembly
description: Lay generated takes out in time, find where each word was spoken, and turn the Script's marks into times the picture can follow.
---

Nobody knows how long a video is until its voice exists. A generated take might run 6.8 seconds or
7.4, and a pause can land anywhere. So in Clipkin you never type times for speech. You say what
follows what, and the times come from the takes themselves once they are made.

Assembling a spoken video takes five steps, and each one does a single job:

1. **Prepare each take:** put it on the project frame rate and decide which picture and sound it
   brings.
2. **Lay the takes out:** place them one after another, or with gaps or overlaps, on a timeline.
3. **Find the words:** measure where each word falls inside each take. Only needed when something
   follows the words, such as captions.
4. **Turn Script marks into times:** convert the Script's Selections and Moments into stretches and
   points on the timeline.
5. **Put picture and sound on the timeline.**

Because the steps are separate, changing one doesn't disturb the others. Swapping the order of two
takes moves them on the timeline without re-measuring their words. Reframing a picture leaves the
sound alone. An animation with no voice and no recorded sound skips steps 1, 3 and 4 entirely.

The examples on this page build one short video: a presenter's opening take and answer take,
generated earlier as `opening-take` and `answer-take`, and this Script:

```reel
<script id="story">
  <opening>
    <HOST> Editing used to eat my whole week.
  </opening>
  <answer>
    <HOST> @{proof}Now one paragraph becomes a finished cut.@{/proof} @{claim!}Ten minutes.
  </answer>
</script>
```

They use these packages:

```reel
<import from="@clipkin/script@1"/>
<import as="space" from="@clipkin/spatial@1"/>
<import as="time" from="@clipkin/timeline-author@1"/>
<import as="mediaop" from="@clipkin/media-operations@1"/>
<import as="whisperx" from="@clipkin/whisperx@1"/>
<import as="semantic" from="@clipkin/narrative-temporal@1"/>
<import as="visual" from="@clipkin/visual-track@1"/>
<import as="audio" from="@clipkin/audio-track@1"/>
```

## 1. Prepare each take

First choose the frame rate for the whole video with a `time:Clock`. Then prepare each take with
`mediaop:Normalize`, which puts it on that frame rate and fixes which of its picture and sound you
are using.

```reel
<time:Clock id="clock" frame-rate="30"/>

<mediaop:Normalize id="opening-media" source={opening-take.video} clock={clock}
  video="primary-moving" audio="default" span-authority="video"/>
<mediaop:Normalize id="answer-media" source={answer-take.video} clock={clock}
  video="primary-moving" audio="default" span-authority="video"/>
```

- **`frame-rate`** is a whole number such as `30`, or a fraction such as `30000/1001` (29.97). A
  decimal like `29.97` is an error.
- **`source`** is the file: a generated video (`{opening-take.video}`) or one you supplied with
  `media:Video` or `media:Audio`, written by its id alone (`{intro-clip}`).
- **`video`** is `primary-moving` (the main picture), `none`, or `stream:<n>` for a specific one.
  **`audio`** is `default`, `none` or `stream:<n>`.
- **`span-authority`** is `video` or `audio`: whichever is the take's real length. The other is
  trimmed or padded to match.

You can put those three choices in a [stylesheet](./styles.md) Recipe and write `recipe={…}`
instead, but it's one or the other. A music or voice file with no picture uses
`video="none" audio="default" span-authority="audio"`. A silent generated video needs
`audio="none"`, because there is no sound for `default` to pick.

Each prepared take gives you three things for the next steps: `.media` (the prepared picture and
sound), `.extent` (its length) and `.domain` (its own frame count, starting at 0, which word timing
is measured against).

## 2. Lay the takes out on a timeline

A timeline is just a frame rate and a length. Inside it you name stretches of time, called
**Windows**, and describe where each one goes relative to the others:

```reel
<time:Timeline id="speech" clock={clock} end="answer.end">
  <time:Window id="opening" from="start" for={opening-media.extent}/>
  <time:Window id="answer" from="opening.end+0.5s" for={answer-media.extent}/>
</time:Timeline>
```

Here the opening starts at the beginning and lasts exactly as long as its take. The answer starts
half a second after the opening ends and also lasts as long as its take. The video ends when the
answer does. Re-generate a take and everything after it moves to fit.

Each Window takes two of `from`, `until` and `for`. Inside a timeline you can write:

| Write | Meaning |
|---|---|
| `start`, `end` | The beginning and end of the timeline |
| `opening.start`, `opening.end` | The edges of the Window called `opening` |
| `hook` | An Instant called `hook` (see below) |
| `12f`, `250ms`, `1.5s` | A length in frames, milliseconds or seconds |
| `opening.end+0.5s`, `opening.end-12f` | A point moved later or earlier |
| `latest(a.end,b.end)`, `earliest(…)` | Whichever point comes last, or first |
| `for={opening-media.extent}` | Exactly the length of a prepared take |

A `time:Instant id="…" at="…"` inside the timeline names a single point the same way.

Rules worth knowing:

- **`end` is required** and must be after the start.
- **Times must land on whole frames.** At 30 fps, `250ms` is 7.5 frames and is rejected; use `8f`
  or `300ms`. At `30000/1001`, even `8s` isn't a whole number of frames.
- **Names are used once,** and `start`, `end`, `timeline` and `window` are reserved. Windows can
  refer to ones declared later, but not in a circle.
- **No percentages or leading minus signs:** `50%` and `-12f` aren't valid.
- **Overlaps are allowed.** `from="opening.end-12f"` starts the answer 12 frames early. If both
  takes keep their sound, both play during the overlap.
- **Keep every Window inside `end`.** A Window that runs past the end passes `clipkin check` but fails
  when the video is built.

Other parts of the project read the timeline as `{speech.timeline}`, and each Window as
`{speech.opening}`, with `.start` and `.end` for its edges. A project can declare more than one
timeline; each Track names the one it uses.

## 3. Find the words in each take

To place anything by the words, such as captions, a graphic on a key phrase or a sound effect on a
beat, Clipkin first measures where each word of the Script was actually spoken in each take. That's
`whisperx:Alignment`, one per Segment:

```reel
<whisperx:Alignment id="opening-words" narrative={story} segment={story.segment.opening}
  media={opening-media.media} domain={opening-media.domain} language="en"/>
<whisperx:Alignment id="answer-words" narrative={story} segment={story.segment.answer}
  media={answer-media.media} domain={answer-media.domain} language="en"/>
```

- **`language`** is the spoken language as a lower-case code such as `en`, `de`, `zh` or `ko`.
  `auto` isn't accepted. Whether a language works depends on the word-timing service.
- **Where it runs** is set in your Runtime Profile: through your Clipkin account (the default), or
  WhisperX on your own computer.
  [Run Source & Builds](./run.md) covers Profiles.
- **A Segment with no words** (`<beat/>`) still gets an Alignment, but leave out both `media` and
  `language`. It just spans the whole take, and nothing is sent to a service.
- **The result** (`{opening-words.alignment}`) gives word and Segment positions inside that one take,
  counted from its own first frame. Step 4 turns those into times on the timeline.

You can skip this step when nothing follows the words: the timeline only needs each take's length.

## 4. Turn Script marks into times

A `semantic:Projection` combines the word positions with where each take sits on the timeline.
Then any Selection or Moment from the Script can become a Window or a point on the timeline:

```reel
<semantic:Projection id="story-time" narrative={story} timeline={speech.timeline}>
  <semantic:Map alignment={opening-words.alignment} domain={opening-media.domain}
    window={speech.opening}/>
  <semantic:Map alignment={answer-words.alignment} domain={answer-media.domain}
    window={speech.answer}/>
</semantic:Projection>

<semantic:Window id="proof" projection={story-time} during={story.selection.proof}/>
<semantic:Instant id="claim" projection={story-time} at={story.moment.claim}/>
```

- **One `Map` per take** links its word positions (`alignment`, `domain`) to its Window on the
  timeline. A Segment can be in only one Map. Segments you never ask about don't need a Map, but
  asking for a mark inside an unmapped Segment is an error.
- **The take's Window must be exactly as long as the take,** frame for frame, because words keep
  their exact positions: nothing is stretched. Building the Window with
  `for={opening-media.extent}` guarantees this. If you shorten or pad that Window afterwards, the
  build fails with a message that the Window "covers only part" of the take.
- **`semantic:Window`** turns a Selection (or a whole Segment) into a Window: `{proof}`, with
  `{proof.start}` and `{proof.end}`.
- **`semantic:Instant`** turns a Moment into a point: `{claim}`. For a Selection or Segment, add
  `boundary="start"` or `boundary="end"` to say which edge.

From there, build ordinary timing around the marks. A sound effect that starts 5 frames after the
claim and lasts 20 frames:

```reel
<time:Instant id="after-claim" timeline={speech.timeline} at={claim} offset="+5f"/>
<time:Window id="claim-sting" timeline={speech.timeline} from={after-claim} for="20f"/>
```

`offset` always has a sign (`+5f`, `-3f`) and only works when `at` points at another Instant.

## 5. Put picture and sound on the timeline

Finally, place the prepared takes. Picture and sound are placed separately:

```reel
<space:Canvas id="vertical" width="1080" height="1920"/>
<space:Frame id="full" within={vertical.bounds} left="0%" top="0%" right="100%" bottom="100%"/>

<visual:Track id="picture" timeline={speech.timeline}>
  <visual:Clip media={opening-media.media} during={speech.opening} frame={full} z="10" fit="cover"/>
  <visual:Clip media={answer-media.media} during={speech.answer} frame={full} z="10" fit="cover"/>
</visual:Track>

<audio:Track id="voice" timeline={speech.timeline}>
  <audio:Clip source={opening-media.media} during={speech.opening}/>
  <audio:Clip source={answer-media.media} during={speech.answer}/>
</audio:Track>
```

**Using a take's picture never brings its sound along.** Each needs its own clip, and both tracks then
go into the Film. This is deliberate: you can show a take silently under a voiceover, or keep a
take's sound under B-roll.

Audio clips also take `gain` (1 is unchanged) and `fade-in` / `fade-out` (for example `"6f"`). If a
Window is longer than its clip, the picture turns transparent and the sound goes quiet once the clip
runs out; nothing is looped or frozen.

[Tracks](./tracks.md) covers captions, B-roll, text and graphics on these timelines, and
[Film & Rendering](./composition.md) puts the tracks together into the finished video.

## A video with no voice

An animation doesn't need takes, words or a Script. Give the timeline a fixed
length and name the points the animation uses:

```reel
<time:Clock id="clock" frame-rate="30"/>
<time:Timeline id="animation" clock={clock} end="8s">
  <time:Instant id="question" at="0.5s"/>
  <time:Instant id="reply" at="2s"/>
</time:Timeline>
```

Components then read `{animation.timeline}`, `{animation.question}` and `{animation.reply}`.

## A complete working example

`examples/interview/reference.reel` in the Clipkin repository follows these steps for a three-take
interview. It prepares a soundtrack, a reveal sound effect and three generated takes, aligns their words, lays them out
back to back, turns the Script's Moments into times for sound effects and flashes, and places
picture and sound.

## When something is wrong

`clipkin check` catches most timing mistakes before anything is generated. The rows marked
*at build* only show up once the video is being built. These are the messages you're most likely to
see:

| Message | What to do |
|---|---|
| "Timeline expression refers to …, which is not declared" | A misspelled Window or Instant name |
| "… does not name an Instant" | A percentage or leading minus; write a point such as `opening.end-12f` |
| "… has to resolve to an exact frame extent" | A time that isn't a whole number of frames at this frame rate |
| "… Span cannot be empty" (at build) | A Window that ends before it starts |
| "… needs either recipe or video/audio/span-authority" | Normalize needs all three choices, or a Recipe |
| "Default audio: no stream qualifies" (at build) | The take has no sound; use `audio="none"` |
| "whisperx:Alignment requires language" | Add `language="en"` (or the right code) |
| "… covers only part of the local temporal domain" (at build) | A take's Window was shortened or padded after it was sized from `.extent` |
| "The projected temporal Instant lies outside the Timeline" (at build) | Something runs past the timeline's `end` |

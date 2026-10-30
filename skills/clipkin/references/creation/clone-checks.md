# Cloning right the first time

A clone is judged against its original, side by side, by someone who can watch and hear both. You
can't, so measure. Every check below runs before the step it protects: a voice sample or a still costs
a credit or two to redo, a speaking clip costs a hundred times that. Three commands do the measuring;
they need `ffmpeg` and `ffprobe`, and only the transcription inside them calls a model.

## 1. Blueprint the reference: `clipkin shots`

```sh
clipkin shots references/source.mp4 --to references/shots --language en
```

It writes `shots.md` (every shot with its times, length, speaking pitch and the words said in it), a
full-size frame per shot in `frames/`, a contact sheet and `shots.json`. Open every frame and fill the
last three columns:

- **On screen and framing:** both people or one, whose close-up, where each looks (at each other,
  never the camera in an interview), what is behind them.
- **Captions and graphics:** colour, and position as a share of the frame ("her captions: pink,
  centred, top at 14%").
- **Light:** sunny with hard shadows, overcast, night.

Note each speaker's times from the words column. Plan one generated shot, or one cut inside a
generation, per row, and cut the edit at these times. Don't plan from your memory of the video.

## 2. Check the cheap material before any video

**Stills.** Make the shared view first (both people in their real positions, with the setting behind
them) and derive each close-up from it, so faces, light and setting match. Put each still next to its
shot's frame and fix framing, gaze, light and props until they match.

**Voice samples: `clipkin voice-check`.** Write each speaker's sex and rough age into the voice
description, make a short sample (about 5 seconds), then measure it against that speaker's lines:

```sh
clipkin voice-check voices/interviewer.wav --like references/source.mp4 --at 0-2.1,10-10.8,15.8-17
```

Within 15% passes. Anything else is the wrong voice: the check says whether to describe it lower or
higher; redesign it and check again. Pitch is measured over one speaker's own times on purpose: an
excited man can speak as high as a woman, so a whole mix can't tell them apart.

Show the user the stills and samples before the paid step.

## 3. Generate and edit to the blueprint

Every row needs footage framed like it. Where the original cuts to a close-up for a line, generate
that close-up; don't hold a two-shot across lines the original cuts between. When one request holds
several cuts, write each with its time, framing and speaker. Then cut at the blueprint's times, put
each line on the shot the original uses, and place captions at the measured positions in each
speaker's colour. Lay the original's background sound (from moments nobody speaks) under the voices
and match its loudness.

## 4. Measure the draft: `clipkin compare`

```sh
clipkin compare references/source.mp4 exports/draft.mp4 --frames exports/compare-shots.png
```

It checks length, cuts (each original cut against the nearest draft cut), loudness, the room under
the voices, how much of the time someone speaks, and the words that differ, and writes a frame per
shot with the original above the draft. Look at that sheet. Then check each speaker inside the draft:

```sh
clipkin voice-check exports/draft.mp4 --sample-at 0-1.5,4-5.5 --like references/source.mp4 --at 0-2.1,10-10.8
```

Fix what needs no new footage (loudness, the room, timing and cuts, caption positions). If a fix
would need new footage, an earlier step was skipped: tell the user what differs, why, and what it
would cost. Deliver with the results: each ✗ you couldn't fix, each ? explained (for example the words
the user asked to change), and the frame sheet.

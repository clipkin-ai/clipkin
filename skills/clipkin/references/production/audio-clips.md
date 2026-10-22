# Place sound through Audio Track

Use this page for normalized speech, music, ambience and effects. Mix judgment lives in
[sound direction](../playbooks/craft/sound-mix.md); this page covers the plain authoring relation.

## Place one ordinary Clip occurrence

```text
Audio Clip  = normalized audio source + absolute Window + source-time + mix
Audio Track = additive set of Audio Clips on one completed Timeline
```

```reel
<import as="audio" from="@clipkin/audio-track@1"/>

<time:Window id="reveal-hit-window" timeline={program.timeline}
  from={reveal} for="600ms"/>

<audio:Track id="mix" timeline={program.timeline}>
  <audio:Clip id="voice" source={speaker-media.media} during={program.speaker}/>
  <audio:Clip id="music" source={music-media.media} during={program.window}
    gain="0.18" fade-in="12f" fade-out="18f">
    <audio:Map target-at="end" source-at="end" rate="1"
      wrap-from="start" wrap-until="end"/>
  </audio:Clip>
  <audio:Clip id="reveal-hit" source={hit-media.media}
    during={reveal-hit-window} gain="0.45" fade-out="3f"/>
</audio:Track>
```

Voice, music, room tone and hits all use this one Clip form. `during` takes a named absolute Window
made upstream by Timeline authoring or by a domain projector (semantic, beat or otherwise).

Two consequences are easy to miss:

- A source that sets the Timeline's duration is still silent until an Audio Clip places it.
- Placing the same source in two Clips gives two audible copies.

## Keep sampling and mix explicit

**Source time.** Without a Map you get bounded native playback from the start of the source; when the
source ends before the Window, the remainder is silence. `audio:Map` takes target and source bounds,
paired anchors, a `rate` and optional periodic wrap (`wrap-from`, `wrap-until`). Audio rates are
always positive and pitch-preserving, so there is no reverse playback here. A fit Map (bounds but
no rate, anchors or wrap) stretches its source interval over the target while keeping pitch;
`min-rate` and `max-rate` set how far that stretch may go. Non-overlapping Maps combine into one
piecewise relation, and uncovered target samples are silent. A reusable relation can be declared
as `audio:SourceTime` and passed with `source-time`.

**Mix.** `gain` is a linear multiplier (default `1`). `fade-in` and `fade-out` are exact lengths
measured against the whole Clip Window (default `0f`). Overlapping Clips sum as equals.

## Put shared behavior in a component

Ducking, crossfades, speaker handoffs and anything else that spans several Clips belong in a project
or reusable component. Such a component may compute envelopes or publish its own `AudioTrack` for
Film.

Two ports come out of Audio Track: `.audio`, which Film consumes, and `.program`, which declared
tooling such as Studio reads. Film only includes the audio outputs you list. Putting synchronized media into a [Visual Track](visual-clips.md) does not
select its sound, so author exactly one intended voice path and check that nothing plays twice.

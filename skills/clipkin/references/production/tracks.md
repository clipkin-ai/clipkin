# Choose and compose picture and sound

Use this page to decide how a piece of content reaches the finished picture or the mix.
For the overall model see [System](system.md). Shared inputs are covered by
[media preparation](media.md), [timing](timing.md) and [spatial layout](spatial.md).

## Start from the relationship

| What you need | Start with | Publishes |
| --- | --- | --- |
| An image, normalized video or surface placed in the frame | [Visual Clip](visual-clips.md) | VisualTrack |
| Speech, music, narration, ambience or effects placed in the mix | [Audio Clip](audio-clips.md) | AudioTrack |
| Script display words shown at resolved Cue times | [Caption](caption-presentation.md) | A package-owned VisualTrack |
| Free-standing written text | [Typography/Text](fonts-and-text.md) | A package-owned VisualTrack |
| Continuing sources, transitions, ducking, layout or state that must be coordinated | [Project component](track-authoring.md) | Its declared VisualTrack and/or AudioTrack |

Treat these as entry points rather than a fixed list of what visuals may be. When images, text and
video behave together, they can share one scene.

## One synchronized medium, independent occurrences

Normalization can put a picture stream and a sound stream on one local domain. Timeline may use that
medium's Extent, while Visual and Audio Clips each pair the medium with an absolute Window on their own:

```text
normalized media + Window + visual sampling -> Visual Clip -> VisualTrack
normalized media + Window + audio sampling  -> Audio Clip  -> AudioTrack
```

That is what makes A-roll flexible: picture and sound are not welded together. The speaker's picture
can be covered or reframed while the speech keeps going, and material that is only audio or only
picture contributes just what it really has.

## Let shared behavior set the scope

A picture can fill a projected Selection, a sound can answer a Moment, and a board can keep its answer
on screen after the reveal. Every component is simply handed the absolute times it uses. Motion or state
that must be shared argues for a single component; independent contributions can stay peers even while they
react to the same event.

## Assemble the intended film

Film takes the Canvas, the Timeline and each selected visual and audio output. Components decide
appearance and paint order. List picture and sound explicitly, and give every audible source exactly
one intended route into the mix, so nothing plays twice or goes missing.

[Rendering](rendering.md#assemble-the-picture-and-sound) shows Film assembly and delivery;
[Review](review.md) judges the resulting picture, performance and full mix.

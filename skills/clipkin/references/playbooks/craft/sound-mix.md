# Sound and mix

Use this page to decide what the audience hears over a passage or the whole Film, and how the sound the
work already has relates to any music or effects you add. Who performs the words and where that voice
comes from belong to [Voice and performance](voice-and-performance.md).

## Start with the sound the material already carries

Know what each kind of material brings before adding anything:

| Material | Its sound |
| --- | --- |
| Speaking-video A-roll | Picture, words and voice are one performed media. The sound keeps running at the current Timeline position while B-roll, graphics or another view replaces the picture. |
| Audio-only A-roll | Supplies performed speech; the picture is authored separately. |
| Wordless performance | May carry its own sound or be silent. |
| B-roll | A still, a silent video, or video with useful source sound. |

Play each selected source's audio through an [Audio Clip](../../production/audio-clips.md), according to
what this passage should actually let the audience hear.

B-roll's visual role never decides whether its sound is heard. From a lifestyle shot you might keep a
single door slam, a footstep or a laugh; a shot laid over a presenter's explanation might add no sound at
all. Because an [Audio Clip](../../production/audio-clips.md) makes source audio an explicit
choice, the chosen performance voice stays available under a silent picture.

Listen to what the material already gives you before adding sound. Then add only for a job:

- **Music** can carry pace, mood or a turn in the thought.
- **A short effect** can give a contact, a reveal or a transition an audible edge.
- **A sustained environmental sound** can establish a place or stitch cuts together when the material does
  not already do so.

These are jobs in the work, not layers that must be filled. The performance may already contain the
environment, and a long sound is not a different kind of asset from a short effect just because of its
length. Deliberate quiet can be as expressive as anything you add.

Clipkin gives you the means to prepare, place and mix audio; it does not maintain a stock library of
background music, short effects or long ambiences. Pick or produce exactly the material this work needs,
whether it is supplied by the user, recorded, generated, sourced elsewhere or already a project Output. Treatment
records why it belongs; Source and the chosen components express how it is used.

## Shape what leads the ear

When speech carries the idea, the important words must be easy to understand in the finished mix. Let music
and effects duck under a key name or figure, a claim, a punchline or a soft reaction, and open up again
in a pause or in a passage driven by action or music. Shape that balance with level, placement, fades,
arrangement and the choice of source, rather than assuming every moment needs the same mix. Normalization
only prepares a source; the balance the audience hears is decided in the composition.

Every added sound needs an expressive reason. Two sides of a comparison might share one motif; a reveal
might deserve a single, precisely placed accent. A tactile process may be carried better by its own small contact sounds than by a big impact.
Repeating an effect just because another cut happened drains its meaning; vary it when the event's
dramatic role changes. Let the piece's character set the sound palette.

## Attach sound to the event it answers

Time each sound from what causes it:

| What triggers the sound | Timing relationship |
| --- | --- |
| Spoken meaning | A Script Selection or Moment; the sound then travels with the accepted performance |
| A component's own entrance, state change or handoff | That event, inside the component |
| Music or another independently directed event | An authored span of the Film |

A visual event and the sound that goes with it can share one cause without being pushed into separate
timing schemes.

Ownership follows the same relationship:

- an [Audio Clip](../../production/audio-clips.md) presents time-bearing source audio and places
  independent audio on an Audio Track (`@clipkin/audio-track`);
- a project component can publish audio tied to its own picture and events;
- Film lists the wanted audio contributions explicitly.

These are composition choices. The installed packages own the exact playback, trigger and gain syntax
(the `@clipkin/audio-track` README covers `gain`, fades and `Map`). For orientation, with
`<import as="audio" from="@clipkin/audio-track@1"/>`, a placed effect is
`<audio:Clip id="reveal-hit" source={hit-media.media} during={reveal-hit-window} gain="0.45"/>`
inside an `audio:Track`.

## Preserve continuity across picture changes

A picture cut does not have to cut the acoustic world. Room tone can carry across several views of one
place, music can bind a montage together, and a speaking performance can stay audible while another
picture takes the frame. Conversely, a change of place, of the speaker's perspective or of narrative state
may want an audible handoff even when the picture changes softly. Follow the listener's sense of where they
are and who they are with.

Where voices, on-screen action sounds and the decay of effects run into each other, shape the join to the
scene's rhythm; silence, fades or overlaps can make a handoff audible. Then review the actual Film where these sounds overlap and
check that:

- the chosen voice stays clear wherever it carries meaning;
- each effect belongs to its event;
- the soundtrack keeps the work's intended character across the whole passage.

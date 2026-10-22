# UGC and talking-head performance

Someone worth watching talks straight to the viewer. The piece rides on their attitude, with Caption,
evidence and MG there so the audience can follow. A ranking board is one possible companion, not part of the definition of
UGC.

- With a board, combine this page with [Ranking](ranking-listicle.md).
- If demonstrations and MG that keep developing do a large share of the arguing, read
  [Presenter-led visual explainers](presenter-led-explainer.md) for their relationship to the performance.

Everything here follows the speaking performance, whether its footage is newly generated or kept from
a recording.

## A single image can carry the performance

Create a character-and-scene image that already has the presence, camera distance, posture and free
graphic space the video needs. If the performance will mostly fill the frame, start from the final
aspect ratio. Keep enough body and gesture room for every later use; the viewports around that same
footage can change later. [Image direction](../craft/image-direction.md) owns this craft.

Placing the person slightly right leaves room for an icon on the left. The image prompt covers only the
person and what can be seen of the setting; the icon belongs to its component. A table, or the angle of a seated
body, can make that off-center placement feel natural. Choose what suits this work.

For a reusable frontal speaking image, say explicitly that the face points at the lens with no head
tilt or turn. A vivid attitude and a relaxed speaking gesture keep that settled view alive. The
[idle principle](../craft/image-direction.md#choose-an-idle-state-for-the-encounter) connects this pose
to addressing the viewer; the generated performance is free to move and react within the encounter.

Cast the vocal appeal with [Voice direction](../craft/voice-direction.md). From then on, every ordinary
talking clip uses that same image and the same recurring voice reference. Each clip returns to the same
useful visual premise and adds another piece of the edited performance. By default that reference is
one Qwen3 `VoiceDesign` clip served by the starter's Replicate Endpoint
([speech packages](../craft/voice-and-performance.md#choose-between-visible-and-audio-only-a-roll));
keep it short, since Replicate caps Seedance reference audio at 15 seconds in total.

**Natural cuts are the goal, not a flaw.** A slight change of pose between passages makes the video
feel like a creator's edited recording. Because the work wants edited speech rather than a simulated
unbroken take, stable character-and-scene references can drive each clip independently.

## When the Speaker Kit fits

For one presenter returning to a single camera image through natural edited cuts, `speaker-v1` from
`@clipkin/seedance-kits` is a tested fit. It combines the character-and-scene image (`@image1`), one voice
reference (`@audio1`), the Script dialogue, a Recipe holding the direction that repeats from clip to
clip, and, if wanted, action Text specific to the passage. How these are assembled, in which reference order, and with which Recipe choices is defined by the
installed Kit.
[Generated video direction](../craft/video-direction.md) explains what the image, the voice, the dialogue
and the passage direction each contribute. A work with a different camera, cast or performance
relationship can use another Kit or plain authored direction. The presenter image is a person
reference (`person-reference="true"`), which the starter's Replicate Seedance refuses; check the
route with `clipkin plan` and see
[Model and provider](../../environment/model-and-provider.md#inputs-some-providers-refuse-until-the-request-changes)
for the alternatives before the Kit is chosen.

For this edited talking-head form, begin with `edit-rhythm: pause-trim-jump-cuts` in the Speaker
Recipe. The camera may remain locked while the performer stays expressive.
[Video direction](../craft/video-direction.md#direct-camera-and-cuts-as-part-of-the-passage) explains
picking the rhythm for a passage, and the installed Kit documents the exact wording the option supplies.

**Action says what the scene means to this person.** A ranking host who enjoys needling their subject
is better served by amused disbelief, a knowing look and a small dismissive gesture; these beat a joint-by-joint animation plan. Give
each of a few actions a reason: a shrug waves off an argument; a quick lean-in makes a punchline
personal. Leave exact numbers to speech, Caption or MG while the hand makes a clear, emphatic gesture.

One useful action direction to sit alongside the Script dialogue:

```text
Deliver this like a friendly takedown from someone who has followed the subject for years. Open with
easy confidence, let the comparison earn a quick look of disbelief, and finish the last line with a
small, knowing shrug. The free hand makes loose, emphatic gestures; the microphone stays relaxed and
steady.
```

The example models an attitude and a handful of visible beats; it is not a personality every creator
should adopt. Listeners, gestures and cuts are covered in
[Generated video direction](../craft/video-direction.md).

## Speech and graphics have different jobs

Write the Script in natural stages.

- **Newly generated clips:** run the estimate on each Segment first, then pick the literal duration to
  request.
- **Retained recorded speech:** the edited delivery supplies the real duration;
  [media preparation](../../production/media.md) explains preparing and aligning it.

Inside one Segment there can be several edited shots, `||` Cue breaks, graphic changes and turns of
speech; draw its boundaries around the performance it carries.

The pipeline for each speaking clip: normalize the produced media, align its own audio to its Segment,
create a Timeline Window of the same length, then carry that alignment across via the local
domain/Window relation. Keep the performance's sound when B-roll covers its picture. Evidence goes on Selections;
reveals go on whatever timing inputs the component declares. A board that persists can stay put across a cut
even as the portrait, the evidence picture and the Caption are replaced.

**Review for engagement.** Does the person feel engaged, and do the visual layers support that? Stable
identity and a coherent setting matter; an identical pose at every seam does not. A frozen expression,
gestures repeated mechanically or relentless intensity can sink the result even when every requested
word is there.

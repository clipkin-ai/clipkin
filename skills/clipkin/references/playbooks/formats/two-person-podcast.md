# Two-person podcast

What carries the argument is the relationship between two people: a question invites a claim, a
reaction shifts its meaning, a reply pays it off. Let that relationship drive both framing and
performance.

## Start from one strong host view

Generate the main host first, in the real setting. From that image, derive the other host's
complementary view:

- opposite screen position and opposite gaze;
- microphone coming in from the other side;
- a different visible sector of the same place.

The shared world comes from the first host's view; the complementary view alters what the second camera
has in front of it.

Both are [idle views](../craft/image-direction.md#choose-an-idle-state-for-the-encounter): each host
sits relaxed and angled toward the other, face still legible to the chosen camera. Attitude is already
visible in this pose, and it can grow over the course of the turns.

The worked restaurant example uses this reference structure:

```text
main host in restaurant ──> other host in restaurant
main host + product ──────> main host holding product
other host + product ─────> other host holding product
main host (+ logo) ───────> each lifestyle scene
both host views ──────────> optional split-screen opening image
```

Rules the structure follows:

- Most new views are one step from their useful parent.
- Lifestyle scenes come from the main host, never from each other.
- A product-holding view inherits its own host's camera and adds the real product reference. Keep the
  gaze, the established setting and the microphone placement; change only the intended prop state.
- File imports are valid inputs, even for images generated outside the Source.

[Podcast and interview image examples](../craft/examples/conversation-images.md) preserve the actual
English production prompts and spell out the job each reference does.

## Direct conversation inside a generated clip

`podcast-v1` (from `@clipkin/seedance-kits`) takes two finished camera views and two voices, in matching
A/B order. Each voice is that host's own accepted Voice Reference, by default a Qwen3 `VoiceDesign`
clip ([speech packages](../craft/voice-and-performance.md#choose-between-visible-and-audio-only-a-roll));
on Replicate the two together must stay within Seedance's 15 seconds of reference audio. In the action direction, map the Script's actual Role names onto those hosts explicitly. The
Script stays the only dialogue text, and one Segment can hold several turns and speaker cuts. Its camera views are person references, which the starter's Replicate Seedance refuses; see
[Model and provider](../../environment/model-and-provider.md#inputs-some-providers-refuse-until-the-request-changes)
for the route before choosing it.

The Kit's Recipe provides the recurring choices: framing, editing, pace, performance, reaction and
gesture. Action adds what belongs to this passage: who is making the claim, who doubts it, when a
reaction earns the other view, and who is holding the product. Keep a silent listener physically alive
with a small posture shift, a quick glance down and back, or an attentive expression, while they stay
silent.

**Handoffs need visible possession.** The main host offers the product toward the partner; the partner
receives it in the complementary view; later shots show who has it now. A few clear relationships do
more than scripting every finger. Cuts can carry the exchange without serialized frame-continuation
generation.

Action for a product-offer passage might read:

```text
MAYA is Host A and LEO is Host B. She recommends it with breezy confidence; he answers with
good-natured disbelief, never annoyance. She passes the product toward the left edge of her view. In
his complementary view it comes in from the right; he takes it and holds on to it. Back on her, her
hands are empty. Keep it relaxed, gestures compact, and add no extra lines.
```

That direction assumes those particular view and prop inputs. If the product is, say, a link sent by
phone, direct the matching screen or conversational interaction instead of a physical handoff.

## Introduce both hosts in the opening

A top-and-bottom split screen can reveal the pair before the first question even finishes. One panel
holds the speaker while the listener in the other looks down, settles in their seat and looks back up.
Those small silent actions make it feel like a conversation already under way.

```text
Hold the supplied upper/lower split exactly as given. In the top panel, the man puts the question to
his partner. In the bottom panel, the woman glances down, shifts into a comfortable position and looks
back up at him while he talks; she says nothing. Both halves should read as one conversation already in
progress, with no big gestures and no frozen listener.
```

The split reference and its matching video direction make one authored opening clip that can carry both
people and a change of speaker; the podcast example keeps that wording in a project Text Template
(`examples/podcast/kits/split-opening.grade`). The ordinary two-view Podcast Kit suits the exchange that
follows. Use a split opening when that attention device serves the work; a different layout calls for a
different component or request shape.

## Cover the thought, not each noun

In the example, three lifestyle scenes are generated together as one short silent montage. That single
clip is placed over a Selection that spans the host's examples and the start of the partner's reply. The
viewer grasps the broader habit even though each cut isn't synchronized to its noun.

- Leave enough time for one full pass at normal speed, so the final scene isn't cut short.
- The Selection may run slightly past the clip; let the underlying picture come back when playback ends.
- The partner's voice can arrive before that return, a useful J-cut.
- Avoid a frozen tail, and don't retime the clip just to fill the Selection.
- Take playback choices from the B-roll craft as it stands today; an older project's Recipe is not a
  rule.

When each scene must line up with its own cue (especially in reconstruction), use separate clips.
Generate each within the selected model's real range and use only the section you need. [B-roll](../craft/b-roll.md) covers source length, explicit source-time relations, short windows and
intentional boundaries.

Giving each host a Caption color keeps the speaker obvious, even when full-frame B-roll is up. Match it
to the scene palette and the product treatment, and pick the colors for this particular pair. Judge the whole
exchange for timing that answers itself, reactions kept in check, props that stay consistent, and a
payoff the conversation has earned.

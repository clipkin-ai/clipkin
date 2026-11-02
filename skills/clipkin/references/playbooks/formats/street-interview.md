# Street interview

An interviewer stops a stranger with a life of their own, asks something, and gets back an answer
worth watching. Most of the time the guest is the story, and the interviewer's job is to let the viewer
find it.

## Build the encounter first, then the close views

**The three-view method.**

1. Generate one shared image with both people in their real spatial relationship.
2. Derive the guest close view directly from it.
3. Derive the interviewer close view directly from it, keeping a sliver of the guest at the opposite
   edge so the exchange stays readable.

```text
shared street scene ──> guest close view
                    └─> interviewer close view, retaining part of guest
```

The guest looks toward the interviewer, and the interviewer looks back along the same screen axis.
That mutual attention, plus a comfortable microphone position, is the
[idle state](../craft/image-direction.md#choose-an-idle-state-for-the-encounter) of the reusable views.
Opening, reaction and departure actions then grow out of this encounter in their own video passages.
Once the shared image does its work, the derived prompts can be very short; the
[worked image directions](../craft/examples/conversation-images.md#street-interview-views) demonstrate this.

**The Kit.** `street-interview-v1` from `@clipkin/seedance-kits` takes this set in a fixed order:
interviewer A, guest B, the shared view, then the two voices in A/B order (each a compact Voice
Reference, by default a Qwen3 `VoiceDesign` clip; both together stay within Seedance's
15 seconds of reference audio). Every ordinary generated clip
reuses it. The three-view limit is how this Kit is designed; it does not restrict street interviews in
general or Clipkin. The interviewer keeps hold of the microphone and moves it toward whoever is talking;
extending it to the guest does not hand it over. Its camera views are person references, which Seedance refuses; see
[Model and provider](../../environment/model-and-provider.md#inputs-some-providers-refuse-until-the-request-changes)
for the route before choosing it.

## Cut to whoever matters right now

Cut by attention, not on a timer:

| Moment | View |
| --- | --- |
| guest answers | usually the guest close view |
| a quick, neutral question from the interviewer | the shared view is enough |
| the interviewer's disbelief, or a challenge that matters emotionally | justifies the interviewer close view |

Action direction can call cuts between the Kit's supplied setups. A single Segment, and a single
generated clip, can hold several rounds of question and answer. Keep each setup's framing behavior consistent and cut straight to
the next; inventing a travelling shot between cameras breaks the scene's grammar.

## Start before the question, end after the answer

**Opening.** The guest is busy with something believable: rummaging in a bag, checking an object,
looking down. The interviewer steps in a little and puts the question; in reply the guest lifts their head or
turns to face them. Let the exchange start naturally rather than inserting a fixed silent pause before every
line.

**Ending.** Bring attention back to the guest and let them start to turn away after their last
thought.

These small actions suggest a life that continues outside the clip. They work because each has a cause,
not because every interview needs the same bag check and the same exit direction.

Action written alongside the Script can make the opening's chain of cause and effect concrete:

```text
DAD is interviewer A; GRANDMA is guest B. Open on the shared setup. She is checking her shopping
list as he steps a little closer and starts the question; she glances up at him in response. Cut
straight to her supplied close view for her answer. Stay in the shared view for his quick follow-up,
and move to his supplied close view when her unexpected answer earns his disbelief. Keep his reaction
curious and spontaneous, not theatrical; he keeps holding and angling the microphone throughout.
```

For the last passage, one more brief line of direction can cut back to her close-up and have her start
to leave once the punchline lands. Opening and ending actions belong only to those passages; the clips in
between carry the behavior of their own exchange.

In between, a handful of clear gestures, each with a motive, is enough: amused certainty, a slight
shrug, a look that takes in an unexpected answer. Stay away from overplayed emotion, nonstop movement
and finger poses that spell out exact numbers. The performer should look like they are responding, not working through an animation checklist.

## One reveal, many layers

A single answer Moment can fill one slot in an emoji strip, start a short sound and fire a colored
flash. Earlier answers stay visible; answers still to come remain question marks. Point all these
consumers at the same Script Moment, so that even when the delivery changes, the reveal still lands as
one event.

Design the Caption colors, the placeholder and answer icons, the flash colors and the character of the
sound as one visual and rhythmic treatment. The role an icon plays may suggest an accent color; the
layers do not all need one shared color. Use real image assets when the icon's exact shape and color matter.

This answer strip is ordinary author vocabulary, not special machinery; the interview example uses the
installable `@clipkin/interview-emoji-reveal` package, and a project component could do the same job.
Its outer Window controls visibility, its reveal Instants (projected from the child Moments) control the
reveals, and its implementation owns the state that persists afterwards. See
[Track authoring](../../production/track-authoring.md) for that distinction and other Track roles.

## Head-following Caption for the guest

When tracked placement suits the work, first produce the speaking footage with ordinary Caption
placement. Face detection on that footage then supplies boxes; enlarge the chosen person's boxes to
cover the head and render again with Caption anchored above them, reusing the media you already paid
for.

[Caption tracking](../craft/caption-tracking.md) covers this when the placement serves the piece. It is
a particular production loop that includes a measurement done outside the render, and interviews do
not need to begin with it. A fixed interviewer Caption and a tracked guest Caption can coexist. Fine styles handle these
cases; a genuinely new structural Caption treatment can be a project Caption family that uses the shared
Script, Caption data and semantic timing.

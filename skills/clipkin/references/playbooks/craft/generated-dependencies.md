# Reference relationships

Each image request asks the model to paint a complete picture. Connected references lend that
painting a visual memory: how a person looks, the form of a product, the mood and layout of a place,
a camera relationship, a physical state. Some of those facts must carry over closely; others are a
world for the painter to reinterpret from a new angle. For every request, direct what the new picture
inherits and what it now shows. The graph of images that results should follow those creative
needs, not a fixed pipeline.

## Let one picture open another view

Take a podcast. A single camera view of one host can set up the person, the encounter and the
restaurant that surrounds it. The other host's image can anchor on it while changing several parts
of the picture at once:

| Part of the new picture | What the new view takes from the first host image |
| --- | --- |
| Capture | The same phone-video photographic language. |
| Person | Nothing of her appearance: the other host is cast with their own look, inside the shared encounter. |
| Shot | The conversational geometry: the new host sits on the opposite side, looks toward their partner and gets the microphone from the matching side. |
| Setting | The same Korean street-side restaurant and palette, but this camera sees a different stretch of its architecture, furniture and activity. |

The model paints a whole new view. The shared world and the conversational geometry link the two
pictures even though the person, the composition and the visible background all differ. The
symmetry lives in the encounter; the second camera simply sees whatever part of the place its
position allows.

What carries over is the relationship, not a copied backdrop. A two-person encounter can carry who
faces whom, which side the microphone comes from and which part of the place each camera sees.
Separate feeds of a video call or a reaction setup may be in different rooms entirely; what they
share is who is speaking to or reacting to whom, not a wall.

The same first host view can also be paired with a product image in a different request. There,
the host and most of the camera view stay, while her hands, the phone and what it displays change.
One reference can support very different variations because each new picture has its own purpose.
The [podcast and interview image examples](examples/conversation-images.md) give the real prompts and
inputs behind these relationships.

## Give each new picture the references it needs

**Start from a useful first camera image.** It can establish the person and the place together, and
it may show one person, several, or the whole encounter. When another view needs that world, bring
along its mood, palette, materials and spatial layout, applied to whatever the new camera should see.
Several video requests can then share the resulting images.

**Moving to a new location.** Begin with a camera image that already puts the people in the new
setting. Their established views can lend identity or styling; a product or a prop that continues can
lend its form and state. The new picture sets location and composition together, while earlier
images carry the facts that persist across the move. If the new place does not need a key image of
its own, a character reference can carry identity straight into the video direction.

**Inherit only what still matters.** Say one character walks out of a living-room argument holding a
phone. If that moment deserves an image, the hallway view takes over who the person is and whatever
state of the phone still matters. The living room's furniture and camera angle have done their job and stay
behind. A deliberate change of outfit, time or place likewise changes which facts the next picture
must carry. Grow a view from the prior story view when the state that is changing matters; branch it from a
character reference when the earlier settings have nothing to add.

**Pick the parent by the relationship needed.**

| The next picture needs | A good parent |
| --- | --- |
| Identity, with new clothes, action and place | A portrait |
| Nearly the same view, with hands and object changed | The view itself (product-holding variation) |
| No person at all | A product, place, graphic or composition reference |

Staying close to the image that actually holds the needed relationship also stops incidental details
from unrelated intermediate scenes from piling up.

**Wiring references into a request.** An existing image may already serve the intended view; use it
directly. When the work asks for a new picture, connect the images that hold the facts it needs and
say in the prompt what each one is for. When a request has several references, "reference 2" simply
refers to whichever image is connected second; the actual connected input is what gives the phrase its meaning.
For `gpt:Image`, that is the second `gpt:Reference` child:

```reel
<gpt:Image id="host-with-app" prompt={host-with-app-prompt} aspect-ratio="9:16" resolution="2K">
  <gpt:Reference image={host.image}/>
  <gpt:Reference image={app-icon.image}/>
</gpt:Image>
```

When the references already establish most of the picture, a short direction for the change may be
enough. The chosen image package owns the exact reference-input syntax, and the serving Endpoint its
sizes: this `9:16` / `2K` request needs GPT Image on `openai.default`, since Replicate renders it only
at `1K` and `auto`, `1:1`, `3:2` or `2:3`
([refusals](../../environment/model-and-provider.md#inputs-some-providers-refuse-until-the-request-changes)).

Keep useful prompts and source images in the project whenever later views may need the same
relationship. The picture's casting, framing, palette and capture language are covered in
[Image direction](image-direction.md); reusing completed Outputs is covered in
[Run Candidates](../../production/authoring.md#reuse-produced-work-explicitly).

## Carry the shared world into motion

The image graph records which visual facts to carry forward. It does not record the video's shot
order or where its requests begin and end. One camera image can guide a passage with several views,
or several generated clips set in the same world; several images can contribute different facts to a
single request. A video excerpt can carry a performed action or camera behavior that no still can
show; [video direction](video-direction.md#let-footage-carry-temporal-behavior-that-matters) covers
those input choices and the requested action. The roles the resulting footage plays in the work are
covered in [Voice and performance](voice-and-performance.md) and [B-roll](b-roll.md).

Voices follow the same shallow graph as pictures. One accepted Voice Reference per recurring speaker
(by default a Qwen3 `VoiceDesign` clip, or a cut of supplied audio) feeds both the A-roll video
requests and every independent line (Qwen3 `VoiceClone`, or a MiniMax `ClonedVoice` made once and
spoken through `ClonedSpeech`). Never chain a line's output into the next line's clone: each line
depends on the accepted reference, not on the previous line.

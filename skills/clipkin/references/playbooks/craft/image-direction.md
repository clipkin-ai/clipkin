# Directing generated images

Treat an image model as a painter you are briefing. It can deliver whatever visual world the piece
calls for: a presenter seen through a phone camera, a room that looks lived in, a product, an icon,
or something impossible recorded as if by an ordinary camera. Every request asks for one finished
picture. Your job is to set the subject, the aesthetic pressure and the visible relationships; the
model's job is to invent the countless small details that turn those decisions into pixels. A
connected reference is simply more material for the same painting: it hands over specific visual
facts you want the new picture to honor.

Two shortcuts exist for the most common case, the phone-video portrait:

- The [phone-UGC Kit](#use-a-concrete-capture-direction) already holds tested capture wording, so
  you only write the person, the camera encounter and the place.
- The [worked examples](examples/image-direction.md) pair full prompts with descriptions of what
  they produced.

## Two ideas behind every sentence

Hold these two principles while writing any line of an image prompt.

**1. The painter has defaults, and vague words hand control to them.** Write "a person at a desk"
and the model fills in the face, the styling, the way the person meets the camera and the room
from its own most typical associations. A single deliberate choice moves the whole picture: the
noun you cast with, the type and intensity of beauty, a haircut, the social flavor of a location.
Pick the handful of dimensions that matter for this particular piece, state them with conviction,
and trust the model with the remainder.

**2. A handful of decisive strokes outweighs an inventory.** What those strokes are depends on the
subject:

| Subject | The strokes that carry it |
| --- | --- |
| Presenter | A face worth looking at, and an unambiguous camera encounter |
| Product | Its defining shape and how it is used |
| Icon | One visual idea that reads instantly |
| Place | A few revealing objects and how they sit in space |

Those choices set up the picture far more than a long catalog of incidental items. Put words where
they change the outcome; let the model handle everything else. "A handful" counts important
decisions, not words: a prompt can be long if every sentence is doing directing work. The
[balcony portrait](examples/image-direction.md#japanese-sailor-on-an-apartment-balcony) separates
the anchors the author wrote from the details the model contributed on its own.

When the piece needs a presenter viewers want to keep watching, direct attractiveness boldly and at
the character's real age. A photograph can be fully believable and still show remarkable beauty.
That is a default, not a rule: tiredness, comic awkwardness or an unflattering expression belong in
the picture when the character or the moment needs them.

## Four paragraphs, four responsibilities

For a phone-UGC image that introduces a person inside a scene, the tested arrangement is the Kit's
fixed **Capture** paragraph, then **Person**, **Shot** and **Setting**. Think of these as four areas
of directing responsibility, not a form with one field per attribute. A reference may already have
settled the person or the place, and an image of a different kind may want a different arrangement
entirely.

| Paragraph | The author decides |
| --- | --- |
| Capture | The photographic language. For phone video, [the Kit](#use-a-concrete-capture-direction) provides the tested text. |
| Person | Who this is, what makes them compelling, and the few appearance choices that make them specific. |
| Shot | What they are doing, who they are talking to, and how the camera meets their face, body and surroundings. |
| Setting | Where this takes place, its palette, and the visible details that make it feel occupied. |

The paragraphs leak into one another, and that is fine. Clothing is part of the palette; a table
in the setting can justify an off-center framing in the shot. Keep each paragraph on its topic
without pretending the borders are sealed.

## Seven questions for a presenter image

When building a full person-in-a-place image, run through these to find the decisions that pay:

1. What kind of captured image is this?
2. Who is this person, and what kind of appeal do they have, at what strength?
3. Which visible choices make them recognizable instead of generic?
4. What ongoing activity or disposition can the following video moment pick up and continue?
5. How does the camera frame the encounter: face, body, gaze direction, spare room?
6. What visible relationships tie this person to this place?
7. Which colors give the whole frame its character?

A single phrase can settle several questions at once, and the brief or a reference may have
answered some already. Use the list to notice what matters in this picture; it is not a quota of
seven sentences.

## Cast the person with force

**Casting noun.** For an adult presenter in this GPT Image 2 phone-video direction, open with
**girl** or **boy** and then state the person's true adult age. In testing, this wording has given
appealing, believable adult faces: the noun pushes the portrait in a useful direction while the
explicit age and the role keep the person who they are. For instance: *a Chinese girl in her
mid-forties, exceptionally beautiful, carrying herself like a leading actress of her generation*,
or *an Indian boy in his late thirties, strikingly handsome, with the relaxed assurance of a leading
man of that age*. If a reference already fixes how the person looks, let that reference carry the
identity into the new picture instead.

**Beauty needs a strength and a kind.** "Attractive" barely steers. *Exceptionally, strikingly
beautiful, with the looks of a top Japanese idol* tells the model both how far to go and in which
direction. Another age, culture or role deserves its own comparison of the same strength. Heritage, how
strong the appeal is, and an aesthetic or social archetype (jirai-kei, soft goth, clean girl, a
certain breed of founder) combine well, but spend words only on the choices that define this
character. A job title on its own seldom decides a face.

**Visible anchors.** Pick a few concrete features that realize the direction: hair framing the
face, eye makeup or the quality of the gaze, one memorable garment or accessory.

**Proportion anchor.** For a human presenter seen from the waist up, *very broad shoulders and
excellent head-to-shoulder proportions* is a dependable structural phrase that counters the
big-head, narrow-shoulder look models drift toward. What it buys is the proportion; it does not
mean the shoulders must be bare or fully shown.

**Working from a portrait.** An existing portrait can lend identity, a selected appearance cue or a
useful camera view. Say what the new picture takes from it and what changes: the view, the styling,
the setting. [Reference relationships](generated-dependencies.md) shows one image anchoring a whole
new view while the person, composition and visible surroundings change.

## Choose an idle state for the encounter

A character image that later clips will reuse should hand the video a state it can keep going.
Talking toward the viewer while the free hand gestures is an activity in progress, not a frozen
pose. An alluring, curious or teasing presence can last across several beats. A big laugh or a
shocked face, by contrast, pins the image to a single instant. That is the right choice when the
instant is what the shot is about. Let the performance you intend decide which kind of state to
paint.

For a presenter addressing the viewer directly, the tested line is: *face points straight toward the
lens, with no head tilt or rotation*. It gives a reliable starting view, and the body is still free to turn and the
hands to work. Podcast co-hosts and interview partners are different: their gaze belongs to each
other. Their reference images should set up that mutual gaze while keeping each face readable from
the camera angle the piece needs.

## Frame the image for what it will become

Decide framing, camera distance, body arrangement, face angle and position in frame together, as
one encounter. A close waist-up presenter makes face, shoulders and gestures easy to read; a wider
view has room for an action or a second person. Put the face where the eventual composition wants
it, but describe only the physical scene the model should paint. An off-center position feels
natural when something real occupies the other side, such as a table, a second person or a doorway
that also belongs to the story. It is equally valid as a plain camera choice.

When the camera view will later share the screen with motion graphics, describe only the
photographed scene the viewer will actually see:

- An icon painted on a sign or shown on a phone screen is part of that photograph and moves with
  it.
- A ranking icon that should appear or animate on its own is better made as a separate image
  Resource. A component can then position and animate that Resource, or draw the icon itself.
- Describe what the person really does with the people and objects in their scene.

Choose a source view that contains the body, gestures and setting the performance needs;
[spatial fitting and crop](../../production/spatial.md) can then present it inside other viewports.
How the picture relates to surrounding content belongs to
[graphic composition](graphic-compositions.md#give-material-and-graphics-room-together).

## Establish the place with a few details

A setting should suggest a social world, not act as a colored backdrop behind a face. Name a place
people would recognize, plus a few details that explain why this person is in it: café tables and a
dessert someone has started, a record shelf running off into an aisle, a classroom door with
student posters. A window or doorway behind the person that opens onto something farther away
gives the frame depth. Pick objects for what they say and how they look, then let the model fill in
the ordinary rest.

Give the place an intentional palette, and let the real things in the scene carry it. *Coral red
and yellow* or *terracotta and green* should live in the architecture, clothing, plants and props,
not in a flat painted wall. A large light or dark area becomes interesting through the place's own
surfaces and contents (wood grain, tiles, shopfronts, foliage) when those genuinely belong there.

Write color as color and material. The Kit already supplies natural-light capture wording, so do
not restate lighting by habit. Mention time of day, weather or a specific lighting event only when
the story or a reference depends on the viewer seeing it.

## Use a concrete capture direction

For a frame that should read as phone video, `@clipkin/gpt-image-kits/phone-ugc-v1` keeps the tested
iPhone capture paragraph. Leave that paragraph untouched and write the picture's content in plain
prose after it. Even a fantastical character can live in a photographed world this way. An
illustration, a product render or any other visual goal needs capture language written for that
goal, which means a different template.

The Kit places `person`, `shot` and `setting` after its fixed paragraph, in that order:

```reel
<import as="text" from="@clipkin/text@1"/>
<import as="gpt" from="@clipkin/gpt-image@1"/>
<import as="ugc" source="@clipkin/gpt-image-kits/phone-ugc-v1"/>

<text:Render id="portrait-prompt" template={ugc.phone-ugc-v1}>
  <text:Set name="person" text={portrait-person}/>
  <text:Set name="shot" text={portrait-shot}/>
  <text:Set name="setting" text={portrait-setting}/>
</text:Render>

<gpt:Image id="portrait" prompt={portrait-prompt} aspect-ratio="9:16" resolution="2K"/>
```

Practical points:

- Each slot takes a paragraph of direction, not a single appearance attribute.
- `shot` is required. `person` and `setting` are optional, so drop them when a connected reference
  already supplies those facts; an omitted slot leaves no empty paragraph.
- Pass `{portrait-prompt}` to the image Surface and attach reference images there as `gpt:Reference`
  children, in the order the prompt refers to them. The Text itself binds no media.
- GPT Image 2 is the usual model for this direction. `2K` generally suits a full-screen picture or a
  video reference; `1K` can be enough for an inset.
- Check the size before choosing GPT Image. Through `clipkin.default`, GPT Image 2 renders only
  `1K` at `auto`, `1:1`, `3:2` or `2:3`, so the `9:16` / `2K` request above is refused
  ([refusals](../../environment/model-and-provider.md#inputs-some-providers-refuse-until-the-request-changes)).
  Keep the same prompt and references on `nano:Image` / `nano:ProImage` (Nano Banana), which renders
  `9:16` at `2K`.
- Aspect ratio and resolution are model parameters (`aspect-ratio`, `resolution`), never words in the
  prompt.
- The Kit package README is the authority on its assembly interface.

## Let references supply the facts they own

Different references settle different facts: a supplied portrait settles identity, a camera view
settles a shared place, a product image settles the product. In the prompt, name what each
reference contributes and what the new picture should show, and connect the actual image files on
the Source. Once references cover the hard visual facts, the prompt is free to spend its words on
the new encounter or the new viewpoint. The model still paints the entire view, keeping the facts the work needs
and inventing the new ones.

When the next view stays in the same photographic world, carry the phone-video capture direction
along with it. Multi-view branching is covered in [Reference relationships](generated-dependencies.md);
swapping a face or product throughout a video is covered in
[transformations](../../creation/transformations.md).

Read the finished prompt back as a description of one picture: a clear subject, visible
relationships and a visual character, with its words spent on the decisions that make the image
useful to this work. The examples keep complete prompts as a record of those specific pictures.
They are evidence, not boilerplate to paste unchanged into the next one.

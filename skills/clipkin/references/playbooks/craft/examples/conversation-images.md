# Podcast and interview image direction examples

This page records the image directions behind two conversation productions, a restaurant podcast
and a street interview, rendered in English. The output aspect ratio has been taken out of the prose
and belongs on the model parameter. What makes these examples worth studying is kept: strong
aesthetic direction, specific wardrobe, specific places and deliberate spatial choices.

Each case lists its own inputs. Borrow the relationships between images, not the characters,
products or prop lists; none of this is a template for every conversation. Some of the images in
the original productions were generated elsewhere and brought in as files.

## Shared capture language

This photographic language comes from `phone-ugc-v1` in `@clipkin/gpt-image-kits`. Its fixed
paragraph reads:

```text
A photograph captured as a single frame from a video actually shot on an iPhone, with the texture of real iPhone footage. The image looks real, without an oily, overprocessed finish. The background is clearly visible, with no depth-of-field blur. Skin texture is natural and fine, and the lighting is natural. The image is coherent and free of visual artifacts.
```

To rebuild one of these directions with the current Kit:

- Slot assignment: who the person is and how they look goes to `person`; how the camera meets
  them goes to `shot`; the place around them goes to `setting`. Write reference responsibilities into whichever slot they affect.
- A derived view can be short when its references already establish the facts; `person` and
  `setting` may be left out entirely. The Kit adds the capture paragraph once.
- Set the output aspect ratio (for example `9:16`) on the model, and connect each stated reference
  image as an actual model input.

The directions below keep their production order and wording style, so they do not follow the
slot order. They also keep time-of-day, brightness, exposure or lighting phrases that served those
particular shots. For a new phone-video image, start from the current Craft page and the Kit, and
add such language only when the scene itself needs that visible fact. A runnable version of the
podcast case, built on the Kit, is in `examples/podcast/reference.reel` in the Clipkin repository.
That project predates the Replicate starter: keep its image direction, but take voice and
person-reference choices from the current Craft pages, since its Fish Audio voices and Seedance person
references are not served by the starter.

## Restaurant podcast views

### Main host: establish a person and a place together

**Inputs:** text only.

Her beauty, the contrast of a muscular body, her styling and the relaxed social setting are
directed as one idea. The table in the lower left balances her position on the right and hints at
where her unseen partner sits.

```text
Create a close half-body podcast photograph. The woman is seated toward the right side of the
frame, body angled a little to the left, eyes turned left as if in conversation with someone just
out of frame. Most of her face is visible from the front, lit by natural light. She leans back on a
comfortable fabric sofa, legs crossed.

The location is the welcoming outdoor seating of a Korean street-side restaurant. Behind her: a
handsome dark wooden exterior wall with visible grain, coral-red architectural trim, a few plants
and other tables. A strawberry bingsu, half eaten, sits on the table in the lower left. A podcast
microphone reaches in from the left, branded CLIPKIN in a well-designed uppercase typeface.

She is a muscular woman with extraordinarily beautiful Japanese-American features: very large,
lovely eyes, very fair skin, a small refined face with smooth planes, and the beauty of a Korean
girl-group idol. Her long straight black hair has blunt bangs, and she wears striking blue contact
lenses.

Her body makes a striking contrast with her face: a powerful, muscular build in a black strapless
top printed with angel wings. Her arms are muscular, with clearly visible veins and definition. She
wears loose, light-colored tweed trousers with an asymmetric stripe pattern. Her shoulders are very
broad and her head-to-shoulder proportions are excellent. She is close to the camera yet stays
fully contained in the frame.
```

### Other host: a complementary view of the same place

**Input 1:** main-host image.

The useful world of the parent image carries over; what changes is the host, the gaze direction,
the side the microphone enters from and the part of the background in view. "Symmetrical" refers to
the conversational arrangement. It does not ask for a mirrored copy of the same wall.

```text
Create a fully symmetrical counterpart to the reference podcast half-body photograph, with pose and
composition mirrored to match. The person now sits toward the left and looks to the right. The
microphone now reaches in from the right and still reads CLIPKIN. Keep the light natural.

This is still outside the same Korean restaurant, but the background shows a different set of
objects because this camera faces the other side of the space.

Replace the woman with a skinny American high-school boy with a nerdy look. He wears a pale printed
T-shirt with an abstract little-devil graphic, black trousers and a cool necklace. His curly hair
is messy and he wears black-framed glasses, yet his face is still handsome.
```

### Main host holding the product

**Input 1:** main-host image. **Input 2:** the real app icon.

Hands are described by side of the image as the viewer sees it. "Her left hand" becomes ambiguous
once camera views multiply; "the hand on the left side of the image" does not.

```text
Keep the natural light across the whole image and leave the microphone exactly where it is. The
woman holds a phone whose screen shows a square image: the icon from reference image 2. She is
still looking left, as if speaking to the person there. The hand on the right side of the image
lifts the phone, and the hand on the left side of the image points at it.
```

### Other host holding the product

**Input 1:** other-host image. **Input 2:** the same icon.

Derive this from his own view, not from her product pose. Holding the same phone does not give him
her camera geometry.

```text
Keep the natural light across the whole image and leave the microphone exactly where it is. The
boy holds a phone whose screen shows a square image: the icon from reference image 2. He is still
looking right, as if speaking to the person there, and lifts the phone with the hand on the left
side of the image.
```

## Main host in everyday life

Each image in this section is fed two inputs: the main-host image first, then the logo of the
relevant company or product. Each is its own branch from the main host, not a step in a chain. Each
keeps her recognizable beauty and strong build while changing the situation, outfit, camera and
place.

### Company reception selfie

```text
Create a raised-arm selfie. The woman from the reference is in a company's reception area, turning
toward the phone she holds up to take the picture. She now wears a light-gray sleeveless lightweight
hooded sports cardigan over a coral-red bandeau top, with the hood up and a baseball cap on as well.
She pulls a lively face and flashes a peace sign.

Other people are suggested somewhere in the office. Her build and arms are still powerful, and she
is still strikingly beautiful. The company logo is the logo in reference image 2. The light reads as
the room's real light, including on her face.
```

### Playful mirror selfie in a shop

```text
Create a mirror selfie. The woman from the reference stands in a small street-side shop, pointing
her phone at a mirror. She now wears an expensive coral-red tank top and gray-black over-ear
headphones. In her other hand is a refined art object designed after the logo in reference image 2.

Her expression is lively, mouth a little open, as if she is about to playfully bite the object. Her
build is still powerful, her arms very muscular, and she is still exceptionally beautiful. Her phone
has a cute CASETiFY case with a small rabbit pattern. She looks at the phone screen. Part of the
street outside shows through the window.

The light looks real, including on her face. The composition feels lively, not stiff.
```

### Low-angle study scene

```text
Create a low-angle photograph. The woman from the reference is in her study at home. The phone
seems to be resting on the desk, looking up at her as she works seriously on a laptop. She now wears
a cute coral-red camisole-style bib-overall outfit, with a white clip holding back some of her hair.
She is still exceptionally beautiful.

The laptop is light-colored, and the logo on its lid is the logo from reference image 2, in coral
red. The room has a warm, modern Korean interior. Real afternoon sun fills the home with bright
golden light, and her face is believably lit by it too.
```

## Optional split-screen opening

**Inputs:** both finished host views. The output shape is still a model parameter.

```text
Make a top-and-bottom split screen: the boy in the upper half, the woman in the lower half. Both
are close views centered on their upper bodies.
```

Because the references already fix the people and the setting, the direction can be this short.
In the matching video request, the woman who is not speaking gets a small posture shift and an
attentive look. That movement is video direction; it does not belong in a longer still-image
prompt.

## Street interview views

### Shared scene: establish both people before choosing a close view

**Inputs:** text only.

One image sets up the whole encounter: both people, who holds the microphone toward whom, the car,
and the line of sight between them. The luxury styling suits this particular guest; it is not a
requirement of street interviews.

```text
Create a close street-interview photograph. On an affluent New York street, a matte light-green
Porsche is parked by the curb. Left of center, a mob wife stands by the front of the car, partly
turned to the camera, sunglasses pushed up on her forehead, hands at chest height. The car's nose
points left, and the Porsche badge shows between the two people near the bottom of the frame.

Her luxurious black hair falls in long loose waves. She wears an expensive-looking dark fur coat over
a leopard-print strapless mini dress, and a gold-inlaid cross necklace. The hand on the left side of
the image carries an exceptionally expensive Hermès bag. She is about twenty, very young and
extraordinarily beautiful, with Japanese-Italian features, very fair skin and a clear, refined,
moneyed presence, her beauty at the level of a Hollywood film star.

On the right is a cheerful young American college guy, seen from the side. He wears a funny backward
cap, a coral-red designer graphic T-shirt, a spiked belt and fashionable flared jeans. He is
handsome, with curls escaping from under the cap. Both people are framed from roughly the top
seventy percent of their bodies. He holds a microphone labeled CLIPKIN toward the woman's mouth.
No one else is in the image.
```

### Guest close view

**Input 1:** shared scene.

The person and the encounter are inherited; only the attention and the crop change.

```text
Make the woman from the reference the focus of the image. Put her in the center of the frame,
looking toward the right side of the image.
```

### Interviewer close view

**Input 1:** shared scene, used directly rather than the guest close view.

The sliver of the woman still in frame keeps his close view tied to the encounter.

```text
Make the man from the reference the focus of the image. Put him in the center, a little larger in
the frame. He keeps looking left and holding the microphone up in the same pose. Part of the
woman's body stays visible along the left side of the image.
```

A runnable interview built along these lines is in `examples/interview/reference.reel`.

## What to transfer to another production

Carry over the decisions, not the decoration:

1. Begin with a useful person inside a world.
2. Derive only the views the piece needs.
3. For each derived view, say what its parent keeps.
4. Where the production depends on exact private or factual identity (a real person, a real logo),
   connect the authoritative reference.

The podcast branches change the camera, the prop state or the day-to-day situation, each for its
own reason. The interview branches change only where attention falls while sharing one encounter.
Neither set of images calls for a chain of generated video end frames, and neither requires
repainting every image for every generated clip.

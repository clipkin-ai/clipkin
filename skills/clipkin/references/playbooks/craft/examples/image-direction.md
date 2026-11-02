# Image direction examples

Companion to [Directing generated images](../image-direction.md). Every prompt below follows the
same four-part shape: Capture, Person, Shot, Setting. The Kit supplies the Capture paragraph and
appends `person`, `shot` and `setting` in that order; the
[Craft page](../image-direction.md#use-a-concrete-capture-direction) covers the assembly. These are
full-screen portraits, so set `aspect-ratio="9:16"` on `gpt:Image`, normally with `resolution="2K"`.
GPT Image renders only about one megapixel here, so at that size use Nano Banana with the same
prompt and references (see the
[Craft page](../image-direction.md#use-a-concrete-capture-direction) for the alternatives).

Six portraits are recorded here: the balcony portrait a user chose from production, and five
reviewed character portraits in distinct styles (soft goth, clean girl, coquette, Harajuku decora,
streetwear). All six share the identical capture paragraph and differ in person, framing and place.
The style label in each organizes an overall look; the specific details chosen under it are what
make that look concrete.

How to read the prompts:

- The capture paragraph is the Kit's fixed text, reproduced exactly.
- Certain phrases recur word for word because they are the tested formulas: the
  *exceptionally, strikingly beautiful/handsome, with the looks of ...* comparison; *very broad
  shoulders and excellent head-to-shoulder proportions*; *speaking directly to the viewer, with
  her/his free hand gesturing*; the frontal-face line (*... face points straight toward the lens,
  with no head tilt or rotation*); and the closing *The background color scheme is ...* line. Keep them intact when you
  adapt a prompt.
- The other sentences are renditions of the production direction. Every casting, styling,
  placement, prop and palette decision is preserved; adapt those decisions, not the wording.
- Each prompt is followed by a description of what came back, so you can see which details the
  author directed and which the model invented.

Note on casting nouns: these recorded prompts open with *woman* / *man* plus an age. For a new
portrait in this direction, the Craft page's casting advice (*girl* / *boy* followed by the true
adult age) is the starting point.

## Japanese sailor on an apartment balcony

**Why it worked.** This is the prompt behind the result the user picked. Person gives a precise
casting direction, strong beauty and the shoulder-proportion anchor, then long straight hair and
sailor styling. Shot sets the frontal talking state, the gesturing free hand and where the face sits.
The small table gives the off-center composition something physical to balance against.

**What came back.** A seated presenter on a balcony, upper right of frame. Navy clothing,
terracotta tiles and green plants each held a separate color role. The glass door, the railing and
the neighboring buildings beyond gave the place several depths. The individual tiles, leaves,
reflections and fabric details were the model's own contributions inside the authored direction;
do not treat those incidental arrangements as requirements for the next portrait.

```text
A photograph captured as a single frame from a video actually shot on an iPhone, with the texture of real iPhone footage. The image looks real, without an oily, overprocessed finish. The background is clearly visible, with no depth-of-field blur. Skin texture is natural and fine, and the lighting is natural. The image is coherent and free of visual artifacts.

A Japanese woman in her early twenties. She is exceptionally, strikingly beautiful, with the looks of a top Korean girl-group idol and very fair skin. Her long black hair is straight and beautiful, cut with blunt bangs, and her makeup is pretty, with bold eye makeup that makes her gaze intensely alluring. She has a beautiful figure, very broad shoulders and excellent head-to-shoulder proportions. Her outfit is a sweet-but-edgy navy-blue sailor-style look with white trim, topped by a matching sailor cap.

Generate a vertical medium half-body shot. She is seated on a chair fairly close to the camera, holding a handheld microphone and speaking directly to the viewer, with her free hand gesturing. Her face points straight toward the lens, with no head tilt or rotation, and is placed toward the upper-right part of the frame. A small wooden table at her side comes into the lower-left corner.

The scene is an apartment balcony. Behind her: a sliding glass door, textured exterior tiles, metal railings and green plants, with the neighboring buildings visible past the balcony. The background color scheme is terracotta and green.
```

**What transfers.** The frontal face and the speaking gesture are a reusable direct-to-viewer state.
The upper-right face and lower-left table are composition choices specific to this frame. A centered
standing version would keep the casting and the proportion anchor but change posture, placement and
how the person relates to the scene. A podcast version would instead turn her attention toward her
partner. See [Choose an idle state](../image-direction.md#choose-an-idle-state-for-the-encounter).

## Goth girl outside a Korean cafe

**Why it worked.** Soft goth styling gives her a strong visual identity inside an everyday café.
The half-finished grape bingsu on the neighboring table explains her rightward placement and says
the visit is already in progress.

**What came back.** A goth presenter seated outside a café whose surroundings read navy and yellow,
microphone in hand, the dessert table beside her.

```text
A photograph captured as a single frame from a video actually shot on an iPhone, with the texture of real iPhone footage. The image looks real, without an oily, overprocessed finish. The background is clearly visible, with no depth-of-field blur. Skin texture is natural and fine, and the lighting is natural. The image is coherent and free of visual artifacts.

A Japanese-American woman in her early twenties. She is exceptionally, strikingly beautiful, with the looks of a top Korean girl-group idol and very fair skin. She has beautiful long, straight black hair with blunt bangs and soft goth makeup; bold eye makeup gives her gaze an intensely alluring quality. She has a beautiful figure, very broad shoulders and excellent head-to-shoulder proportions. She wears a sweet-but-edgy black beret, a black goth outfit and a few silver jewelry pieces.

Generate a vertical medium half-body shot. She is seated on a chair fairly close to the camera, holding a handheld microphone and speaking directly to the viewer, with her free hand gesturing. Her face points straight toward the lens, with no head tilt or rotation, and is placed toward the upper-right part of the frame. A small wooden table at her side comes into the lower-left corner, a half-eaten grape bingsu resting on it.

She sits outside a street-side café in Korea. Behind her: entrance steps, a wooden shopfront, metal railings, green plants and several other tables. The background color scheme is navy blue and yellow.
```

## Clean Girl in a Korean cafe

**Why it worked.** Clean-girl makeup, a sleek high ponytail and a navy knit establish the style.
The wooden counter and the iced latte tie the seated pose to the café, and the pistachio-green and
walnut palette supports the navy outfit.

**What came back.** A presenter in navy knitwear seated by a café counter, with green tiles and
wooden shelving behind her.

```text
A photograph captured as a single frame from a video actually shot on an iPhone, with the texture of real iPhone footage. The image looks real, without an oily, overprocessed finish. The background is clearly visible, with no depth-of-field blur. Skin texture is natural and fine, and the lighting is natural. The image is coherent and free of visual artifacts.

A Korean-Chinese woman in her early twenties. She is exceptionally, strikingly beautiful, with the looks of a top Korean girl-group idol and very fair skin. Her hair is pulled into a sleek high ponytail, and her clean-girl makeup is beautiful, with clear, expressive eyes and an easy, confident presence. She has a beautiful figure, very broad shoulders and excellent head-to-shoulder proportions. She wears a minimalist navy-blue knitted top in clean-girl style, small gold earrings and a delicate gold necklace.

Generate a vertical medium half-body shot. She is seated on a stool next to a café counter, fairly close to the camera, holding a handheld microphone and speaking directly to the viewer, with her free hand gesturing. Her face points straight toward the lens, with no head tilt or rotation, and is placed toward the upper-left part of the frame. The wooden counter at her side comes into the lower-right corner, an iced latte partly drunk on top of it.

The scene is a neighborhood café in Seoul. Behind her: wooden shelves, a tiled counter, an open doorway, and green plants next to a window. The background color scheme is pistachio green and walnut brown.
```

## Coquette girl in a bay-window bedroom

**Why it worked.** The hair bow, doe-eyed makeup and pink lace carry the coquette look. The
bay-window alcove justifies a centered seat, and the green-and-wood palette gives the pink clothing
its own distinct place in the frame.

**What came back.** A presenter with a pink bow and lace top, seated centrally in a green bedroom
alcove framed by the bay window.

```text
A photograph captured as a single frame from a video actually shot on an iPhone, with the texture of real iPhone footage. The image looks real, without an oily, overprocessed finish. The background is clearly visible, with no depth-of-field blur. Skin texture is natural and fine, and the lighting is natural. The image is coherent and free of visual artifacts.

An African-American woman in her early twenties. She is exceptionally, strikingly beautiful, with the looks of a young Hollywood film star and beautiful brown skin. Her long black waves are tied with a pink ribbon bow, and her coquette makeup is pretty, with captivating doe eyes and rose-tinted lips. She has a beautiful figure, very broad shoulders and excellent head-to-shoulder proportions. She wears a romantic coquette-style pink top trimmed with lace, and a pearl necklace.

Generate a vertical medium half-body shot. She is seated in an upholstered chair inside a bay-window alcove, fairly close to the camera, holding a handheld microphone and speaking directly to the viewer, with her free hand gesturing. Her face points straight toward the lens, with no head tilt or rotation, and is placed toward the upper center of the frame. The curve of the window alcove frames her chair.

The scene is an apartment bedroom. Behind her: a bay window hung with floral curtains, a wooden wardrobe, and a small vanity holding a vase of roses. The background color scheme is sage green and walnut brown, with pink accents.
```

## Harajuku Decora girl outside a fashion shop

**Why it worked.** "Decora" names the style; what makes it particular is the pink double buns,
the graphic hoodie and a handful of accessories. The shop's recessed entrance gives a centered standing view a
natural frame.

**What came back.** A standing presenter with pink double buns and a lilac hoodie in front of
brightly colored Harajuku shopfronts.

```text
A photograph captured as a single frame from a video actually shot on an iPhone, with the texture of real iPhone footage. The image looks real, without an oily, overprocessed finish. The background is clearly visible, with no depth-of-field blur. Skin texture is natural and fine, and the lighting is natural. The image is coherent and free of visual artifacts.

A Japanese woman in her early twenties. She is exceptionally, strikingly beautiful and cute, with the looks of a top Japanese girl-group idol and very fair skin. Her pink hair is worn in two high buns with a few star-shaped clips, and her makeup is pretty and playful, with large, captivating eyes. She has a beautiful figure, very broad shoulders and excellent head-to-shoulder proportions. She wears a lilac graphic hoodie in playful Harajuku decora style and colorful beaded jewelry.

Generate a vertical medium half-body shot. She stands outside a fashion shop fairly close to the camera, holding a handheld microphone and speaking directly to the viewer, with her free hand gesturing. Her face points straight toward the lens, with no head tilt or rotation, and is placed toward the upper center of the frame. The recessed doorway of the shop frames the spot where she stands.

The scene is a shopping street in Harajuku, Tokyo. Behind her: a shop window showing bags and plush toys, capsule-toy machines, and more storefronts farther down the pavement. The background color scheme is turquoise and yellow.
```

## Streetwear guy beside a basketball court

**Why it worked.** A young hip-hop star as the beauty comparison, short twists and relaxed
streetwear define the person. The bench and the open court explain the off-center framing, and
terracotta with teal gives the surroundings an intentional palette.

**What came back.** A presenter in a navy graphic tee seated courtside, the terracotta-and-teal
court opening out beside him.

```text
A photograph captured as a single frame from a video actually shot on an iPhone, with the texture of real iPhone footage. The image looks real, without an oily, overprocessed finish. The background is clearly visible, with no depth-of-field blur. Skin texture is natural and fine, and the lighting is natural. The image is coherent and free of visual artifacts.

An African-American man in his early twenties. He is exceptionally, strikingly handsome, with the looks of a young hip-hop star, brown skin and a magnetic, self-assured presence. Short twists show beneath a backward baseball cap, and his eyes are expressive. He has an athletic build, very broad shoulders and excellent head-to-shoulder proportions. He is dressed in relaxed New York streetwear: an oversized navy-blue graphic T-shirt and a silver chain.

Generate a vertical medium half-body shot. He is seated on a courtside bench fairly close to the camera, holding a handheld microphone and speaking directly to the viewer, with his free hand gesturing. His face points straight toward the lens, with no head tilt or rotation, and is placed toward the upper-left part of the frame. The bench runs alongside him toward the open court on the right.

He is next to an outdoor neighborhood basketball court in New York. Behind him: the painted court, a chain-link fence, a mural, and trees past the fence. The background color scheme is terracotta and teal.
```

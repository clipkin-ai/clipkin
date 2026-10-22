# Material-led pictures and B-roll

A still or a clip can be a passage's visual answer: proof of a claim, a place to be in, an action to
understand, a contrast or a gag. "B-roll" is one common editorial use of such material, where a
performance carries the words and the timing. The same material can also lead the picture through a
narrated explanation, or carry a sequence with no speech at all. Decide its role by what the viewer needs
to see, not by whether it is a still, a moving clip or a shot of a person.

## Give the material a reason to appear

Creator-led video often shows the speaker's life while their spoken words run on: working, studying,
travelling, using the product, reacting somewhere else. These shots make the person and their world feel
real. The person in a lifestyle photo or silent clip can be the same person whose voice we hear; the
placed performance still owns the words. Another passage might instead use a visible speaking performance
whose own delivery carries the lines. [Voice and performance](voice-and-performance.md) owns that
distinction.

Match the material to the job:

| Job | Typical material |
| --- | --- |
| Hold a product fact while the speaker makes a claim | A still image |
| Prove a claim with the action itself | A moving demonstration |
| Make an interface state readable | A screenshot |

One well-chosen picture often carries the thought better than a fresh shot for every noun. If the work
needs new material, [image direction](image-direction.md) and [video direction](video-direction.md) own
making it; this page owns why and how it shows up in the work. When the screen itself is the explanation
or the evidence, use [screen demonstrations](screen-demonstrations.md).

## Choose the relationship to the thought

**Exact correspondence.** Some claims only make sense if a specific picture is on screen right then. Assign
that picture exactly the semantic Window its claim requires. A short display can use just part of a longer
source; the duration of the generation request does not dictate how long it is shown.

**A visual thought across several pictures.** A habit, a history, a process or an attitude can be
conveyed by a run of pictures. They can be separate Clips or several scenes within one generated clip.
Let the changes follow the beats of the argument rather than putting a cut on every spoken noun. If the
reference ties particular pictures tightly to particular claims, keep that closer relationship instead.

A generated clip with several scenes needs direction for the scene order and for the meaningful action in
each. For Seedance, the `@clipkin/seedance-kits/broll` Kit expresses this through its `story` Text, set with
`<text:Set name="story" .../>` on the Kit's `text:Render`; the package README owns the tested wording and
editing choices. A straight image, existing footage or independently arranged media can achieve the same
purpose without that Kit.

## Compose material and performance in the same picture

Material can be presented many ways: a still filling the Canvas, a video running beside a moving
presenter, either one inside a frame, crop, mask or designed border. The picture can lead attention while
the performer stays visible elsewhere, or take over the whole view while the performer's audio continues.
Where it sits and what it paints over follow the composition, not the label "B-roll".

Who implements what:

- [Visual Clip authoring](../../production/visual-clips.md) supplies an independent picture: the image or
  prepared video, its Frame, its appearance and its playback. A still gets a display Window and needs no
  video conversion.
- A project component can keep a time-bearing source's playback position running while its view changes.
- If material, presenter and graphics move or lay out together, let one
  [project component](../../production/component-design.md) own that shared behavior.
- [Spatial layout](../../production/spatial.md) owns the Canvas, Frames, fitting and crop.

Borders and animated frames are presentation decisions; neither requires a new kind of source material.

A clip's location sound or action sound can join the mix when it helps the moment. Putting a picture on
screen never substitutes for the performed speech; how those sounds combine is covered in
[sound and mix](sound-mix.md).

## Let the picture enter and leave on its own terms

Pick the timing anchor by what the picture answers:

- When it answers a spoken claim, tie it to a Selection or Moment.
- When it answers a musical beat or a physical action, authored time may fit better.

The picture's Window does not have to begin or end when a speaker appears or disappears. A partner can
start talking while the last lifestyle shot is still up and only become visible a moment later; that
offset between sound and picture is a J-cut. An Audio Clip fixes whose words are heard; the visual
composition decides when the views change.

End the picture by the thought, the action and the time needed to read it. A still stays for its whole
Window; a moving source also has its own playback length. Let a clip run to the end when its last action
matters, or cut earlier when that gives the work a better beat. Holding, looping or retiming is its own
expressive decision, never an automatic consequence of a Window that outlasts the source.
[Visual Clip authoring](../../production/visual-clips.md#keep-destination-time-and-source-sampling-distinct)
owns those sampling modes.

Neighboring pictures can meet at a single semantic boundary, bridge the pause between words, or
deliberately reveal another view underneath.
[Script marker affinities](../../production/script-syntax.md#bind-meaning-to-script-identities) owns the
exact shared-boundary forms, and [review](../../production/review.md#make-the-composition-work) helps find an
unintended flash or gap. Always watch the actual render: a Window that looks continuous on paper cannot
make a source that has run out, or a transparent frame, fill the picture.

## When material leads the whole passage

In a music-led montage, a tactile process film or a visual product explainer, images and clips are the
main sequence. Cut on the visual argument, the physical action or the musical phrase. A close-up earns its
place when it shows something the wide shot could not; a gentle contact or a settling motion may need
room to complete. For how recorded, generated or separately made sound backs up the material, see
[Sound and mix](sound-mix.md).

The [Timeline](../../production/timeline.md) holds no media; it only resolves placed local domains, gaps
and intervals authored directly, and independent material can sit in any of them. A wordless
performed passage can provide its own reusable media boundaries; a passage built purely from pictures and
graphics can use authored time. Neither needs a hidden speaking picture underneath.

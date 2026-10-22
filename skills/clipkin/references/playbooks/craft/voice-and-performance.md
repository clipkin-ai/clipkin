# Voice and performance

Come here to decide which performance carries a passage, how a person who recurs keeps a single voice,
and whether an off-screen passage is the continuation of an A-roll performance or separate speech.
Casting an appealing voice and writing its direction belong to [Voice direction](voice-direction.md).

## Let the Segment reveal the A-roll

A **Segment** is one authored passage of the Script. Before production it has an identity and a meaning
but no length in seconds. **A-roll** is the performance that carries that passage. Its prepared media
gives the passage its duration, and when the composition needs to know where words fall, semantic
preparation gives those spoken words local timing. Two kinds exist:

- **Visible A-roll** carries picture and sound together.
- **Audio-only A-roll** carries the passage in sound while other contributions provide the picture.

Timeline construction turns the prepared media's Extent into an absolute Window in the full work,
normally right after the previous passage, or at a position you author. The work can also hold
graphics-only passages before, between or after the performances.
[Timeline authoring](../../production/timeline.md) owns the exact temporal DAG, and
[semantic projection](../../production/timing.md) maps the separate NarrativeAlignment evidence across
its full local domain and its Window of equal length.

For spoken work, the governing question is **who is speaking this Segment?** The chosen visible
performance brings the words, mouth movement, gesture, gaze, delivery, picture and sound as one package.
In a conversation, that one performance may include listeners, several turns or camera cuts and still
be a single Segment. Counting the people in frame tells you nothing about how many semantic clocks there
are.

A recurring presenter, podcast speaker, interviewee or dramatic character keeps ownership of their lines
even while some other picture covers them. Visual handoffs, coverage, Caption, MG and Effects are all
timed against the clock that performance set. If you edit the performance so its real length changes,
prepare the edited media before assembly, and realign it if any of those dependent layers use semantic
timing.

Not every Segment is spoken:

- A **wordless performed passage** (a dance, a reaction) is still a real performance. Its prepared media
  provides a local domain that simply has no spoken words.
- A **graphics-only interval** contributes an authored Span to the Timeline with no media at all.

Pick whichever matches what the passage is actually made of.

## Keep the performance role separate from the picture

"A-roll" names what a performance does in the work, not how it is shown. Its accepted material, its tie
to the Script and its Timeline Window all stay fixed while you change how it looks. Its picture can lead
the frame, share it, appear twice, become part of a diagram or vanish entirely. A large app recording can
own the viewer's attention while a small presenter in the corner still supplies the passage's words and
timing. Several such changes can happen inside one source Window, and one visual treatment can also span
several sources.

Covering B-roll can even show the same person doing something silent from their life. Seeing someone
while you hear words does not make that picture the speaking source, nor does it create a new source of
speech. The two roles are declared separately:

- An **Audio Clip** plays the explicitly declared performance audio.
- A **Visual Clip** chooses what the viewer sees.

The same source clip can also appear elsewhere as an independently timed replay or example; its role
comes from that use. Size, crop, transparency and whether a face is visible never establish the role.

Pick the mechanism by what the picture needs. A [Visual Clip](../../production/visual-clips.md) places one
occurrence of a source; a project scene can coordinate several materials and events. A shift in emphasis
can be a hard cut, a held arrangement or a continuous move; decide from the idea and the viewing rhythm.

- **Continuous move:** keep the source's playback position running and direct the viewport's motion.
- **Hard cut:** make the two intended states meet exactly at the chosen event.

In both cases the speech stays connected independently through an
[Audio Clip](../../production/audio-clips.md).

The [presenter-led explainer guide](../formats/presenter-led-explainer.md) develops how performance,
demonstration and graphics relate across a whole work. Visual hierarchy is the subject of
[Graphic composition](graphic-compositions.md); geometry and fitting are handled in
[Spatial layout](../../production/spatial.md).

## Let neighboring A-roll performances keep their time

By default, A-roll assembly lays Segment performances end to end, and neither side gives up any of its
duration. That matches how the work is made: `clipkin estimate` sizes each generation request so that its
words, delivery and action fit naturally into that clip, and speaking video models use the full requested
length to perform the line. Asking a generated clip to stay silent for an artificial half-second handle
at either end fights both that sizing and the model's performance.

A crossfade that consumes duration between two A-roll clips eats into the word windows each performance
set up. You can get two voices at once at the seam and a weaker listening rhythm. So for everyday creator
speech, podcast turns, interviews and short drama, start with a straight join between the prepared
Segment performances. Pictures and effects are still free to cross that seam without disturbing the
speech timing underneath.

When you genuinely want interruption, overlapping dialogue or musical phrasing, place Windows explicitly;
[Timeline authoring](../../production/timeline.md) supports gaps and overlaps directly. Each source keeps
its own local timing, and any crossfade or coordinated picture treatment belongs to the visual component
that owns that behavior. For creator speech, sequential Windows remain the simple default.

## Give a recurring person one accepted voice

First decide what a supplied recording is for. The same file can play different roles:

| Intended use | What to do |
| --- | --- |
| The work keeps the person's recorded delivery | Prepare the passage and align its real sound to the Script when later layers need word or boundary positions. If the picture is kept, Visual Clip can use it. |
| It guides a new performance | Use it as direction for the newly generated take. |
| It establishes the voice for new speech | Cut a short Voice Reference from it. |

When a new performance needs a reference and none was supplied, Voice Design can create one; Voice Clone
can then perform independently narrated Script lines with it. The recording's intended use decides the
relationship, not the mere fact that it exists.

A **Voice Reference** is just an accepted audio Resource that fixes a person's vocal identity. Reusing
that one Resource everywhere the person performs is what keeps them sounding like themselves across the
production.

For newly generated performances, give every recurring speaker their own Voice Reference. A silent
listener does not get a voice just because they are in the shot; if that character speaks somewhere
else, their own reference goes into that new performance.

Where the reference comes from:

- **The user hands you the precise private voice they want:** cut a clean excerpt that represents it
  well and use that as the Voice Reference. Before cloning it, make sure the user has the right to:
  it is their own voice, or they have the speaker's permission. Ask when that is not already clear.
  A hosted platform may require the confirmation itself and refuse an unconfirmed clone; relay the
  refusal to the user, wait for them to confirm, and never work around it.
- **No such voice supplied:** cast the character through Voice Design and choose its sample line using
  [Voice direction](voice-direction.md). Public character types and invented voices can go straight
  to Voice Design.

When casting someone new, begin with a brief designed sample: cheap to generate, a usable voice,
and easy to pass into speaking-video requests. Roughly five seconds of clear, natural speech usually
gives a model enough identity without wasting reference length on finished content. Make the sample:

- exercise the kind of delivery the work needs;
- contain no other speakers, no music, no clipping, no heavy room echo and no long silences.

The one exception is a voice you will clone into MiniMax: its `ClonedVoice` refuses samples shorter
than 10 seconds (or longer than 5 minutes), so write a sample line long enough for 10 to 15 seconds of
speech. Staying under 15 seconds keeps the same clip usable as a Seedance reference on Replicate,
which caps reference audio at 15 seconds in total.

If one video request involves several speakers, give each a compact reference and keep their total length
within the chosen model's reference-audio limit. That model's documentation is authoritative for exact
count, duration and format limits.

Once a reference is accepted, use that same Resource every time that person needs to sound like
themselves.

## Let one reference support different performances

The dependency is shallow:

```text
Voice Design or supplied audio
             ↓
     accepted Voice Reference
          ↙             ↘
visible A-roll      audio-only A-roll
```

- A video model that can produce A-roll takes the short reference plus the real Script and generates the
  person's visible speaking clip.
- Voice Clone takes the same reference plus the passage's Script when the work needs independent speech.
  It produces that passage's audio, whose length follows the passage and the speech model's request
  limits, not the length of the short reference.

These are two uses of one ordinary Resource, not two voices.

A single work can mix them. A host might perform on camera and later narrate a passage with no on-camera
performance under it; the shared Voice Reference keeps both sounding like one person. Meanwhile another
passage covered by B-roll might still be the sound of the A-roll beneath it. Decide each case from how the
passage is constructed expressively, not from whether the face happens to be visible at that moment.

## Choose between visible and audio-only A-roll

**Visible A-roll.** The video request gets the character's camera image, the Voice Reference and the exact
Script dialogue, and returns the person actually performing it, picture and sound. Voice Design's job here
is casting; its short sample line only establishes identity and does not need to repeat any line of the
finished Script.

**Audio-only A-roll.** Use it when a Segment has no on-camera speaking performance, for example:

- a screen demo seen from the user's own desktop;
- a montage that the narration leads;
- an explanation built entirely from MG;
- a product-explanation stretch inside an otherwise presenter-led work.

Voice Clone performs the Segment's real Script with the person's existing Voice Reference. Its output goes
through the same normalization as every performed media, plus alignment if Caption or some other
semantic consumer needs positions within it. An Audio Clip Source couples this plain media to its exact
Window; the picture comes from Visual Clips, Typography, MG or any other visual Track. No special compound "audio-only"
semantic object is needed.

Choose audio-only A-roll because the passage really is independently narrated, not because B-roll or
graphics happen to hide someone on camera. Voice Design establishes the reusable voice; Voice Clone
performs the actual Segment. Casting sample and finished delivery do different jobs.

**Speech packages.** Each speech model family ships as one package with its own Source import. The
starter Profile's `replicate.default` serves two of them with the one Replicate key, and they are the
default choice:

| Package | Surfaces | Reach for it when |
| --- | --- | --- |
| `@clipkin/qwen3-speech` | `VoiceDesign` (description as text content, `style` attribute; publishes `.reference`), `VoiceClone` (`voice`, optional `reference-speech`, delivery instruction as text content; publishes `.audio`), `Speech` (preset `speaker`; `.audio`) | You design a voice from a description, and the lines are in Chinese, English, Japanese, Korean, German, French, Russian, Portuguese, Spanish or Italian (`language`, spelled as shown, or `auto`) |
| `@clipkin/minimax-speech` | `ClonedVoice` (`sample`; publishes `.voice` and a `.preview` clip), `ClonedSpeech` (a `.voice`; `.audio`), `Speech` (system voice id; `.audio`); `emotion`, `speed`, `pitch`, `volume`, `language-boost` on each line | The language is outside Qwen3's ten (MiniMax covers 32), or a line needs explicit emotion, speed or pitch control; it cannot design a voice from a description |

**Default recurring voice: design once with Qwen3, then clone that clip for every line.** Pass the
designed clip as `voice` and the words it spoke as `reference-speech`, so the model knows exactly what
the reference says:

```reel
<import as="qwen" from="@clipkin/qwen3-speech@1"/>

<qwen:VoiceDesign id="host" speech={story.segment.voiceSample.speech} language="English">
  A clear young woman with a grounded, confident conversational delivery.
</qwen:VoiceDesign>

<qwen:VoiceClone id="narration" speech={story.segment.reveal.speech}
  voice={host.reference} reference-speech={story.segment.voiceSample.speech} language="English">
  Quietly confident, with a short pause before the final word.
</qwen:VoiceClone>
```

`host.reference` is the accepted Voice Reference: an ordinary audio Resource, generated once and
reused by every line and by A-roll video requests. A clone from a supplied recording names that
recording's transcript as `reference-speech` instead, and needs the user's confirmation that they may
clone that voice (see the Voice Reference sources above).

**MiniMax: clone once, speak every line with emotion control.** Design the voice with Qwen3 (MiniMax
has no design from a description; give the sample line 10 to 15 seconds of speech) or cut it from a
supplied recording, clone it once, and speak each line on the cloned voice:

```reel
<import as="minimax" from="@clipkin/minimax-speech@1"/>

<minimax:ClonedVoice id="host-voice" sample={host.reference} noise-reduction="true"/>

<minimax:ClonedSpeech id="opening" speech={story.segment.opening.speech} voice={host-voice.voice}/>
<minimax:ClonedSpeech id="reveal" speech={story.segment.reveal.speech} voice={host-voice.voice}
  emotion="calm" speed="0.95"/>
```

Audition `host-voice.preview` before speaking lines. The clone happens once per Run however many
lines use it; its price on Replicate is an unverified placeholder (about USD 3 per clone), and how
long MiniMax keeps a cloned voice is not published, so a Run resumed much later may need to clone
again. `emotion` takes `auto`, `happy`, `calm`, `sad`, `angry`, `fearful`, `disgusted` or
`surprised`; each line's text is at most 10,000 characters (MiniMax pause markers such as `<#0.5#>`
count toward it).

Choose between them per production, and keep one path per recurring speaker:

- **Qwen3 for both steps** when every line is in one of its ten languages and wording in the Script
  plus a short delivery instruction per line carries the attitude.
- **Qwen3 design, then MiniMax** when the piece is in another language, or when lines need a named
  emotion, a speed or a pitch shift that an instruction alone does not reliably produce.
- **Preset voices** (`qwen:Speech` `speaker`, `minimax:Speech` `voice` such as `English_Wiselady`) for
  a quick neutral narrator nobody needs to recognise elsewhere; neither vendor publishes its full list,
  and an unknown name fails at the service.

**Alternatives when their Endpoint is declared.** ElevenLabs, Fish Audio and Xiaomi MiMo speech are
not in the starter; use them only once `elevenlabs.default`, `fishaudio.default` or `mimo.default` is
declared and its key stored:

| Package | Surfaces |
| --- | --- |
| `@clipkin/elevenlabs-speech` | ElevenLabs `VoiceDesign` only (20 to 1000 character description, 100 to 1000 character sample) |
| `@clipkin/fishaudio-speech` | Fish Audio `VoiceDesign` and `VoiceClone` (Clone takes spoken text and a voice only, no delivery instruction) |
| `@clipkin/mimo-speech` | Xiaomi MiMo `VoiceDesign` and `VoiceClone` (Clone also accepts a delivery instruction as its text content) |

The example projects in the Distribution's `examples/` (podcast, interview, ranking-football) still
declare the ElevenLabs, Fish Audio, MiMo and Volcengine Endpoints and speak through
`@clipkin/fishaudio-speech`; running them as they stand needs the Fish Audio key, or adapt their voice
requests to Qwen3 or MiniMax as above.

Run `clipkin vocabulary` with a package name to see its author Surfaces, and read its README for exact
limits. Because `<id>.reference` is a plain audio Resource, a voice designed with one package can feed
another package's clone (`VoiceClone`, `ClonedVoice`) or an A-roll video request.

The Source picks the model semantics. Separately, the Runtime Profile picks the Endpoint that performs
them: `replicate.default` for Qwen3 and MiniMax speech, the direct ElevenLabs, Fish Audio or MiMo
Providers for theirs; [Model and provider](../../environment/model-and-provider.md) covers choosing and
connecting them.

## Treat narration as a sound-picture relationship

"Narration" only says that the audience hears speech while the speaker is not the main thing on screen.
It says nothing about how the speech was made:

- **Visible-performance-led passage:** coverage swaps what we see, yet the accepted on-camera A-roll stays
  the performance and the timing authority.
- **Independent-narration-led passage:** audio-only A-roll supplies the performance and the picture is
  designed around it.
- **Mixed work:** each passage uses whichever relationship serves it, and recurring people keep their
  accepted Voice References throughout.

Keep three questions apart:

| Question | What the answer establishes |
| --- | --- |
| Is the speaker off screen right now? | How it is watched: we hear the speech while its performer isn't the main thing on screen. |
| Does the sound belong to on-camera A-roll that is being covered, or to audio-only A-roll? | Where the performed audio was produced, and who owns it. |
| Is the passage led by a visible performance or by independent narration? | How the Segment is built expressively, at a higher level. |

One visual language can answer these differently. Take a notebook-paper background with animated steps,
labels and panels:

- **It stays as the place where a product process is explained.** The shifting graphic relationships
  carry the passage. Independent speech sets the Segment's semantic time while the paper composition
  provides the picture. This is an independent-narration-led module.
- **A ranking host says a quick "Top one: the product" over a paper reveal, then appears on camera to
  continue the same verdict.** Normally the whole passage belongs to the host's performance: the paper
  reveal is MG laid over A-roll, and what you hear is still the host performance's sound.

Duration can support your reading but never decides it. Ask what carries the argument, the attitude and
the progression, and whether there is an on-camera performance whose words naturally run on through the
coverage. A long graphic explanation and a short graphic reveal can look identical in a single frame and
still be built in different ways.

Segment boundaries mark the work's useful modules; they are not labels for sources. A
narration-led Segment may step through many MG beats using Selections and Moments. A Segment led by a
visible performance may open under a graphic and reveal the speaker later. Splitting a
generation into two Segments does not turn either into audio-only A-roll; each Segment's real performance
relationship is what decides.

Read [the narration-led demo format](../formats/narration-led-demo.md) when independent narration
organizes a whole work or a substantial passage. The [playbook index](../index.md) routes to the Format and
Craft guides for the work's other relationships.

## Give real performance real semantic time

Duration estimation, literal duration and alignment are owned by
[Script and time](../../creation/script-and-time.md). Once an accepted performance has semantic timing,
every dependent layer follows the delivery that actually happened, not the estimate.

## Carry the character through the performance

[Voice direction](voice-direction.md#let-one-voice-express-different-thoughts) links a recurring vocal
identity to delivery that changes with the thought;
[Video direction](video-direction.md#direct-the-reason-for-an-action) links each passage's meaning to
expression, gesture and interaction.

For music, effects, ambience, gain and the finished mix, see [Sound and mix](sound-mix.md).
[Transformations](../../creation/transformations.md) connects casting and reference choices to the target
work's argument, relationships and presentation.

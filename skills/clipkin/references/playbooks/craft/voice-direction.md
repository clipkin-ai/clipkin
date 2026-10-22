# Directing a voice

Read this before you pick, design or change any character's voice, including when you adapt a production
that already has a Voice Reference. The goal is a voice the audience wants to keep listening to. In
creator-led social video, lean toward a distinctive, engaging presence that makes the lines feel spoken
*to* someone.

## Cast the person through the sound

Start by imagining a voice worth hearing: who is talking, who they are talking to, and what about the
sound makes this character appealing. "A mischievous small creature whose voice is sugary and bright" or
"a narrator with a full, warm, resonant tone" already implies a sound as well as a personality.

A role label is context, not a casting decision. "Founder" or "creator" tells you the situation; you still
have to decide what this particular person sounds like. Likewise, "an unexpected voice" only describes how
the voice relates to the casting. Name the specific appealing sound you chose for that relationship so the
voice model has an actual vocal character to produce.

Write the way [Image direction](image-direction.md#two-ideas-behind-every-sentence) recommends: open with
high-level words that carry sensory meaning, then pin down the qualities that decide the casting.
"Magnetic" states the appeal you want; "a clear, youthful tone with quick, teasing phrasing" starts to
deliver it. Pitch, vocal weight, brightness, softness and grain are distinct casting choices, not synonyms
for "good voice". A slightly husky voice has a specific texture; pick it when that texture belongs to this
person. Let the kind of encounter shape the presence, anywhere from an upbeat recommendation to a quiet,
close conversation.

Look at the character reference and decide using the Brief:

| Situation | Casting move |
| --- | --- |
| The user supplied a voice | It can fix an exact identity. |
| An existing project already has a voice | Continue it if that casting still serves the new piece. |
| A new person or character | Build a voice that makes the audience want to stay with this role. |

Record the casting decision and the reference's role in Treatment and in Source.

## Compress the voice into a vivid direction

A good voice description is usually one short paragraph with three ingredients:

1. a recognizable vocal character;
2. the sound qualities that make it appealing;
3. a characteristic way of addressing the listener.

Details such as apparent age and gender, language or accent, pitch, texture and articulation can sharpen it.
Use only the few that settle the casting; this is not a form to fill in. Cultural or character shorthand is
worth including only for the sound it conjures.

Turn the character's purpose in the piece into things you can hear. If the viewer should trust a claim,
that might mean clear articulation and considered emphasis, and the request should describe that sound
and manner, not the goal. Music, graphic reveals and the final mix get their own separate directions.
[Direction and its inputs](../../production/system.md#give-each-part-the-direction-it-can-realize)
explains how the overall design relates to each individual request.

Two contrasting examples:

```text
A young woman's bright, clear voice, sweet in the upper register with a smooth, light tone.
Casual American English, quick and playful, like a friend who can't wait to tell you what she found.
Curiosity lifts her questions; a smile you can hear warms her confident answers.
```

```text
A mature man's warm, resonant mid-low voice speaking clear, unhurried British English. Thoughtful and
easy to approach, as if weighing an idea with someone across a table. Measured phrasing and deliberate
emphasis give his conclusions weight.
```

The first casts light, playful appeal; the second casts warmth and considered conviction. Notice that pitch
and pace are independent: a high voice can be slow and a low voice can be quick. Keep the qualities that
define the casting fixed, and choose language and delivery density according to what the work needs.

## Let the sample carry the character

When choosing or designing a sample, use the language the piece will be performed in, and a delivery
compatible with it, whenever you can. A sample transmits pronunciation and phrasing along with timbre.
Carrying an identity across languages does not, on its own, give you the target accent or rhythm. When you
must keep a supplied identity in another language, preserve it and spell out the target-language qualities
in each request.

Pick a short, natural line that lets the voice show its character. For a lively character, a curious
question followed by a delighted reaction works well:

```text
Hold on, all of that came from one photo? Okay, you have my full attention.
```

The second, more measured casting suits a considered observation instead. The line should make the
intended manner useful to what is being said; a line that just names the product shows very little. If the
line contains unfamiliar names, write their intended pronunciation into the Script before using it as a
sample.

From that short line, Voice Design produces a Voice Reference you can reuse. The same reference then serves
two kinds of performance: a speaking-video model draws on it while acting out the finished Script, and Voice
Clone draws on it for passages carried by independent narration. Casting line and finished passage are
separate tasks.
[Voice and performance](voice-and-performance.md#give-a-recurring-person-one-accepted-voice) owns preparing
and reusing the reference and choosing between those performances, including which speech package to use.
By default the voice is designed with `@clipkin/qwen3-speech`'s `VoiceDesign` (served by the starter's
Replicate Endpoint): the description above becomes its text content, the sample line its `speech`, and
`language` names one of its ten languages. The chosen model's package README owns exact inputs. Two
length rules change the sample line: a voice you will clone into `@clipkin/minimax-speech` needs a sample
of 10 seconds to 5 minutes, so write 10 to 15 seconds of speech; and `@clipkin/elevenlabs-speech`, when
its Endpoint is declared, requires a 20 to 1000 character description and a 100 to 1000 character
speech sample.

## Let one voice express different thoughts

The reference supplies vocal identity and demonstrates a way of speaking. Every finished passage still has
its own reason to be said aloud: pulling someone in, pushing back on a claim, lighting up at an example,
handing down a confident verdict. Direct each attitude while the person stays recognizable. One accepted
voice can carry many thoughts; a recurring identity does not mean one fixed mood for the whole work.

Where the attitude is directed depends on how the passage is performed:

- **Visible A-roll:** through the video performance.
  [Video direction](video-direction.md#direct-the-reason-for-an-action) connects attitude to gaze, gesture
  and interaction.
- **Independent speech:** through the Script and whatever delivery inputs the selected speech model
  supports. Qwen3's `VoiceClone` takes a delivery instruction as its text content ("Quietly
  confident, with a short pause before the final word"). MiniMax's `ClonedSpeech` takes no free-text
  instruction but sets `emotion` (`happy`, `calm`, `sad`, `angry`, `fearful`, `disgusted`,
  `surprised` or `auto`), `speed`, `pitch` and `volume` per line. Where those Endpoints are declared, MiMo's `VoiceClone` also accepts a delivery
  instruction; Fish Audio's `VoiceClone` does not, so there the Script wording and the reference carry
  the delivery.

Size the passage from this intended performance with
[Speech-duration estimation](../../creation/script-and-time.md#estimate-before-choosing-durations). The pace
estimate decides how long the passage is; the voice and performance direction decide its character.
Speaking fast does not, by itself, create emphasis, a shift in attitude or expressive intonation.

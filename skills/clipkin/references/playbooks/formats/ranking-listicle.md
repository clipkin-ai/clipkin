# Ranking and listicle

A ranking argues by comparison. The board holds on to the judgments already made, while the person,
evidence and performance on screen now explain the next one. Rankings combine freely with
[UGC performance](talking-head.md), independent narration or other presentation forms.

## Let the board's state carry the story

Decide two things up front: what is already settled when the clip opens, and what the viewer will
watch being decided. A board that starts partly filled implies a ranking already in progress: preset
subjects sit in their rows from the first frame while the spoken passages introduce the ones being
judged now.

When you read a ranking component's vocabulary, keep four ideas apart:

| Idea | Meaning |
| --- | --- |
| outer Window | when the board exists at all |
| preset item | part of the board's initial state; needs no reveal event |
| newly activated item | arrives on an authored event or passage, in whatever form the component accepts |
| resulting state | the component decides how an activation changes the board and how long that state lasts |

An item's activation Selection ending does not have to mean the item disappears. Check how the package
actually consumes it. In `@clipkin/ranking`, for example, preset rows and icons are already settled,
while each non-preset item has a reveal Window after which its placement persists. Here `preset` means
initial board content owned by the component.

## Lay out host and argument as one composition

Reserve useful space when you draw the host. One layout might put the person toward the right, the
active subject's icon on the left, and the board and evidence across the lower part of the frame.
Another ranking can lay things out differently. A detail in the setting can balance an off-center host
so they don't look shoved aside to make room for graphics.

The speech brings attitude and explanation; Caption follows its reading rhythm. Still or moving B-roll
can illustrate a joke, a comparison or a claim on overlapping Selections. The board should stay
readable while those inserts come and go.

Some graphic systems publish sound as well as picture. Use those peer outputs on purpose: if the board
already owns its drop or slide sound, add a separate Audio Track only for distinct sounds, never one
that doubles an event the board already voices.

## Decide what each picture must tell

An icon might name the subject under judgment, set up how the board starts, signal an adaptation's new
theme, or make a remark into a sight gag. Decide what the viewer has to recognize or
believe before you decide how to make the icon.

| Need | Source |
| --- | --- |
| exact current identity, wording, version or factual authority | a supplied or found asset; record where it came from and any conditions on its use |
| recognizable visual meaning of a familiar player, company, product, app, meme or public symbol | a well-informed image model can paint it |
| an important fact the model can't be trusted to get right | connect an exact reference |

In a reconstruction, keep the icon's function and the recognition the original relies on. In an
adaptation, a new subject or visual theme may call for a completely different icon.

Wherever it came from, look at the icon at the size it will really appear and confirm identity, exact
version, resolution, crop, padding and transparency. Builds consume the selected project file or generated Output; sourcing the icon
is an authoring decision, not something repeated on every Run.

Supporting B-roll does a different job. Generated comic inserts can interpret the commentary while the
icons identify board entries. Each insert picks the visual language its joke needs: a parody UI or a
staged theatrical still need not share the presenter's phone-camera Kit. A factual screenshot
or product proof, by contrast, draws its authority from the fact it shows.

## Pick the structure that fits the argument

A tier board, an ordered column and a comparison chart each have their own state and motion. Look at a
Surface that might fit and work through its public inputs. If the work needs a new structure or reveal behavior,
write a project Track instead of modifying an installed package or bending unrelated attributes to fit.

Judge the claim being made, the icon's motion, the board's state and the supporting picture as one. Their
timing can reinforce one idea without everything starting on the same frame. Share a Moment when
several layers truly represent one event; use a Selection when a passage owns an interval. Local
decisions live in [B-roll](../craft/b-roll.md), [Caption](../craft/captions.md) and
[Track authoring](../../production/track-authoring.md).

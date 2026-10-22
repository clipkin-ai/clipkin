# Caption presentation

Use this page to apply subtitle treatments, switch them during a passage, or hide them for a while.
[Caption craft](../playbooks/craft/captions.md) owns the visual direction;
[Caption authoring](caption-authoring.md) covers building a new family.

**Three owners, three jobs.** Script authors the Words, Units and Cues. The family presents those Cues.
Each Use arranges presentation over time.

- `||` closes the current authored Cue.
- An upstream adapter resolves the timing of every document Unit once. The Track reads that flat
  `CaptionTiming` and does not care whether it came from Narrative, SRT/VTT or authored absolute time.
- Each Use picks one complete Style for an already resolved time window.

```reel
<caption:Hidden id="hidden"/>
<narrative-caption:Timing id="story-captions" document={story.caption}
  binding={story.caption-binding} projection={story-time}/>
<time:Window id="impact-window" timeline={program.timeline} from="12s" for="2s"/>
<caption-fine:Caption id="captions" document={story.caption} timing={story-captions} timeline={program.timeline} within={canvas.bounds}>
  <caption-fine:Use style={base-style}/>
  <caption-fine:Use role="GUEST" style={guest-style}/>
  <caption-fine:Use during={answer-window} style={answer-style}/>
  <caption-fine:Use during={demonstration-window} style={hidden}/>
  <caption-fine:Use during={impact-window} style={impact-style}/>
</caption-fine:Caption>
```

The chosen family declares its Styles. A Fine Style takes a Recipe and exact fonts. When the caption needs a
structurally different design, a project family supplies its own layout and behavior.

## A single time language

| What you want | How to write the Use |
| --- | --- |
| One treatment for the entire Timeline | `style={base}` with no time attribute |
| Track a semantic passage | Project the passage a single time; reference it with `during={answer-window}` |
| Track a placed Segment | Likewise: one projection, then `during={answer-window}` |
| Begin on a significant word and run for a set length | Project the word once and consume the Window that results |
| Stop at a significant event | Build a named Window ending at that event and reference it |
| An explicit clock interval | Declare it once with `time:Window`, then `during={named-window}` |
| Only one speaker | Add `role="GUEST"` to any of the above |

[Timing](timing.md) owns the shared expressions and semantic references. Prefer semantic boundaries
when the treatment follows what is being said; absolute times suit a presentation that is explicitly
clock-timed. A Role filters whose content is shown, independently of the window: it may span several
turns and does not alter the Window displayed in Studio.

How Uses resolve:

- Within any instant, the **last matching Use in Source order wins**.
- A match replaces the **whole** Style. Properties are never merged.
- A hidden Use clears this Track's subtitles for its entire window, including the lead and tail of
  neighboring Cues. A later Use can bring back a smaller interval.
- Audio and content are untouched.
- With no matching Use, nothing is drawn; with no subtitle content, a Use has nothing to draw.
- Separate Caption components are independent and can deliberately show several presentations at
  once.

## A Style can change in the middle of a Cue

```text
test1 || test2 @{select} test3 || test4 @{/select}
```

There are three Cues here: `test1`, `test2 test3` and `test4`. The Selection opens before `test3` but
does not split `test2 test3`. With a broad ordinary Use followed by an emphasis Use during `select`, the
second Cue switches Style as a whole at that boundary, and the third Cue keeps the emphasis.

Word times stay exactly as they were. Karaoke or text reveal therefore carries on at the right word
when the Style changes, or when captions return after a hidden stretch. The Window limits visibility;
it never restarts the Cue's animation clock.

Changing the visual role of a single word is a different design choice. Fine offers current/trail unit
emphasis; a custom family can interpret authored word attributes for structural layouts. Display and
pronunciation units always stay whole.

## In Studio

Caption's timeline row shows Cue Items. Presentation Uses are Inspector objects, not draggable timeline
ranges: you can edit the Style or Recipe they reference there, and their Scope and Role explain which
Cues they affect. Editing `||` changes Cue structure; editing a Use does not. Then judge the
outcome (position, handoffs, emphasis) next to everything else in the frame, without regenerating any
media.

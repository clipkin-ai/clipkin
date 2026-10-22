# Author timing relationships

Use this page to decide when a component exists or acts. [Script syntax](script-syntax.md) names
the Narrative relationships and [Timeline](timeline.md) builds the finite absolute domain; components
themselves only ever consume absolute Instants and Windows.

## Match the time source to the event

| The event should follow | Use | Why |
| --- | --- | --- |
| Meaning, even if the wording or performance changes | Narrative time | It moves with the words it belongs to. |
| The film clock | Direct Timeline time | It stays put regardless of speech. |

Both resolve to the same absolute value Types, so a component cannot tell them apart.

`semantic:Projection` (from `@clipkin/narrative-temporal@1`) maps aligned local evidence onto the
Timeline. Separate declarations then explicitly pick that Projection to reveal each semantic value the
production wants to reuse:

```reel
<semantic:Projection id="story-time" narrative={story} timeline={film.timeline}>
  <semantic:Map alignment={speech.alignment} domain={speech-media.domain} window={film.speech}/>
</semantic:Projection>
<semantic:Window id="proof" projection={story-time} during={story.selection.proof}/>
<semantic:Instant id="claim" projection={story-time} at={story.moment.claim}/>
<semantic:Instant id="answer-end" projection={story-time}
  at={story.segment.answer} boundary="end"/>
```

`boundary` (`start` or `end`) is required when `at` names a Selection or Segment. From here on,
`proof`, `claim` and `answer-end` are plain Window and Instant values for any component.

## Declare, then consume

Timeline authoring and domain projectors produce named values; components only read them.

| Purpose | Written as |
| --- | --- |
| Declare a Window on the clock, three seconds in, fifteen frames long | `<time:Window id="pulse" timeline={film.timeline} from="3s" for="15f"/>` |
| Declare a Window spanning two projected Instants | `<time:Window id="reply" timeline={film.timeline} from={claim} until={answer-end}/>` |
| Have a component occupy the projected Window | `during={proof}` |
| Have a component occupy the clock Window | `during={pulse}` |

A Window still takes exactly two of `from`, `until` and `for`, and `for` may reference a
TemporalExtent such as a generated clip's duration. The whole film is already available as `film.window`.

## Instant forms

| Purpose | Written as |
| --- | --- |
| React to a projected event | `at={claim}` |
| Name an event two seconds into the film | `<time:Instant id="cut" timeline={film.timeline} at="2s"/>` |
| Name an event twelve frames before the film ends | `<time:Instant id="credits" timeline={film.timeline} at="timeline.end-12f"/>` |
| Name an event six frames after a resolved one (its own, separate offset) | `<time:Instant id="claim-settled" timeline={film.timeline} at={claim} offset="+6f"/>` |
| React to the named clock event | `at={cut}` |

Projection always reveals the exact semantic boundary. An offset is its own relationship: reveal the
boundary first, then derive a standalone Instant with `offset`. If no offset is needed, reference the
existing Instant directly instead of aliasing it. What the event changes, and whether that state
persists, is the consuming component's decision.

## Name shared values

Give even a single-use absolute value a name outside the component that consumes it. Put it inside the
Timeline when it helps decide the film's extent; otherwise declare it standalone against the completed
Timeline. If it matters to the production which domain a value came from, publish it as a projected value.

## Choose what a later edit changes

How a value was authored decides what editing it means:

| The value is | Editing it changes |
| --- | --- |
| A direct literal | That literal. |
| A named Timeline value | Its Timeline declaration. |
| Produced by a Narrative | The mapping or the Narrative source that produced it. |
| Reused by several consumers | Its producer; every consumer follows after recompilation. |

Studio shows every resolved value, but lets you edit the source behind it only when the package has
declared what such an edit means. Keep three decisions separate: the semantic relationship, any absolute
offset, and how long the response lasts.

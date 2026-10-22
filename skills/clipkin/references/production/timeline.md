# Construct the program Timeline

Use this page to decide how long the whole work runs and which absolute Instants and Windows get
names. [Media preparation](media.md) publishes local domains and Extents, [Timing](timing.md) covers
direct versus projected values, and [Visual](visual-clips.md) and [Audio](audio-clips.md) place media
once the work is resolved.

Timeline is the work's single finite, absolute frame domain. You declare it as an acyclic graph of
Instant and Window expressions with exactly one required `end`:

```reel
<import as="time" from="@clipkin/timeline-author@1"/>
<time:Clock id="clock" frame-rate="30"/>
<time:Timeline id="program" clock={clock}
  end="latest(answer.end,outro.end)">
  <time:Window id="opening" from="start" for={opening-media.extent}/>
  <time:Window id="answer" from="opening.end" for={answer-media.extent}/>
  <time:Instant id="claim" at="answer.end-12f"/>
  <time:Window id="outro" from="claim" for="3s"/>
</time:Timeline>
```

Every named child becomes an ordinary value you can reference:

| Reference | Value |
| --- | --- |
| `program.timeline` | The completed Timeline. |
| `program.window`, `program.start`, `program.end` | The complete range and its boundaries. |
| `program.opening` | A Window; `program.opening.start` and `.end` are its boundary Instants. |
| `program.claim` | An Instant. |

## Expressions

A Window gives exactly two of `from`, `until` and `for`. `for` takes an exact duration in frames,
milliseconds or seconds (`12f`, `250ms`, `1.5s`), or a typed Extent. Point expressions — used by
`at`, by Window boundaries and by `end` — can be:

- `start`, or the resolved `end`;
- a literal position from zero;
- a named Instant, or a Window boundary such as `speech.end`;
- one of those plus or minus an exact offset (`claim+2s`, `answer.end-12f`);
- `earliest(...)` or `latest(...)` over named boundaries.

Order inside the Timeline does not matter: dependencies drive evaluation, so declarations may refer
forward. When more than one branch could decide the total length, combine them with `latest(...)`.
A wholly authored animation can be as short as:

```reel
<time:Timeline id="animation" clock={clock} end="30s"/>
```

## Let resolved material determine duration

Generated speech or video often publishes its Extent only after the Source is written. Point a Window
at that Extent and every dependent boundary resolves through normal graph evaluation:

```reel
<time:Window id="speech" from="start" for={speech-media.extent}/>
```

Keep the graph acyclic: a generation request that reads Timeline's end cannot also be what decides
that end. Unknown references, empty Windows, durations that are not exact frames, values outside the
final range and a non-positive end are all author errors.

## Project local evidence after Timeline resolves

When self-contained evidence needs an absolute position, map one complete local domain onto one
Window of exactly the same length. Narrative projection uses that relation to publish the Script
Selections, Moments or boundaries you request:

```text
NarrativeAlignment + LocalDomain + Window -> absolute Instants / Windows
```

The mapping keeps local endpoints at native speed: no clipping, looping, holding or stretching, and a
length mismatch is an error. If the media must be trimmed or retimed, prepare that altered media first,
then project evidence whose endpoints must stay meaningful.

Placing picture and sound is a separate decision:

```text
SynchronizedMedia + Window -> visual / audio occurrence
```

Put a named Instant or Window inside the Timeline when it takes part in constructing the Timeline.
Once the Timeline has resolved, standalone time declarations and domain projectors can publish more
named values against it, and components consume those — even single-use ones — through ordinary
references. The project's `TIMELINE.md` keeps human observations and what they mean; Source is what
builds the executable Timeline.

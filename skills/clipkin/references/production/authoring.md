# Authoring a production

This page covers turning a Treatment into Author Sources, Recipes, Runs, project components and
Builds, and changing a production that already exists.

Related pages, so you can go straight to the one you need:

- [Script and semantic time](../creation/script-and-time.md): target wording, Segments, Roles,
  Caption Cue choices and semantic relationships. [Script syntax](script-syntax.md) gives the exact
  forms and [Timing](timing.md) projects them into components.
- [Source syntax](source-syntax.md): imports and references.
- [Composing Tracks](tracks.md): connecting visual and audio roles. [Track authoring](track-authoring.md)
  and [Caption authoring](caption-authoring.md) cover building a new project component for them;
  [Component design](component-design.md) covers shaping its behavior and controls around the work.
- [System relationships](system.md): how these concepts reach execution and Results.
  [Media preparation](media.md): material inputs.
- [Production map](index.md): specialized questions. You do not need every page for every revision.

## From Treatment to relationships

Start from what the Treatment describes, never from a list of installed packages. Work out:

1. which Script passages are meaningful and performable, and who speaks them;
2. which performances sit on Timeline, and which independent material feeds other components;
3. what picture and sound the piece needs — even a plain full-frame performance counts;
4. which relationships should follow words, phrases, pauses or content events;
5. which events genuinely belong to the clock;
6. what the final Film or other deliverables are.

Pull in the directing knowledge that owns each decision:

| Decision | Read |
| --- | --- |
| Verbal structure, and the meanings other layers will follow | [Script and semantic time](../creation/script-and-time.md) |
| Generated camera images | [Image direction](../playbooks/craft/image-direction.md) |
| Generated performance and action | [Video direction](../playbooks/craft/video-direction.md) |
| Casting and directing a character's voice | [Voice direction](../playbooks/craft/voice-direction.md) |
| A-roll and recurring voices | [Voice and performance](../playbooks/craft/voice-and-performance.md) |
| Coverage | [B-roll](../playbooks/craft/b-roll.md) |
| An interface carrying evidence or explanation | [Screen demonstrations](../playbooks/craft/screen-demonstrations.md) |
| Speech-linked text | [Caption](../playbooks/craft/captions.md) |
| Designed visual hierarchy | [Graphic composition](../playbooks/craft/graphic-compositions.md) |
| Change within that hierarchy | [Motion graphics](../playbooks/craft/motion-graphics.md) |

Those pages say what each relationship should achieve; the installed vocabulary then gives you the
exact words to express it.

Performance-led work — pure A-roll, short drama — keeps its intended passages in Script and lets the
accepted media decide how long they actually run. Add semantic preparation only once Caption, sound
or a visual relationship needs positions inside that performance. A standalone asset edit can stop
at the media Output that was asked for.

State every relationship explicitly. Selections and Moments written in Script travel with the placed
performance and arrive at real times; independently timed events get authored positions on that same
Timeline. Track and Film elements then lay out what is seen and heard. A single Author entry
ties the work together, while imported Sources and project modules split its meaningful
responsibilities. A camera cut on its own never justifies another Source, Segment, component or Build.

### Ask the installation before you write an element

The first time a role in this work leads you to an installed Surface, query its real declaration:

```bash
clipkin vocabulary @clipkin/gpt-image --tag Image
```

Write the logical Module import, tag, attributes, children, ports and output paths exactly as this
project's installation reports them. Query again if the selected package or Distribution changed, or
an error suggests your assumption no longer matches what is installed; a Surface you have already
established does not need rediscovering on every edit. After each coherent change to a Source or Run,
check the real entry:

```bash
clipkin check authors/main.reel
```

Each command answers a different question:

| Command | Establishes |
| --- | --- |
| `clipkin vocabulary` | What the selected package declares. |
| `clipkin check` | The real Source closure is legal: imports, references, Types, outputs and Run choices. |
| `clipkin plan <run>` | Which capabilities the current Run needs (an execution question, not an authoring check). |
| `clipkin doctor` | Whether the selected Profile and its accounts are actually reachable. |

### Data you measured is authored data

Sometimes observation already yields a useful authored value, for example a per-frame sequence of
regions used to keep Caption above a moving head. Keep it in Source or a Recipe and feed it through
the component's declared input; it is part of the chosen design, exactly like a Frame or a Style.

When that measurement depends on footage that is still to be generated, let the first Build produce
the footage. Study it, write down what you measured as data, and in the following composition Build
select the media you already have instead of generating it again. [Caption tracking](../playbooks/craft/caption-tracking.md) walks through this loop
for head placement.

## One job per production surface

| Surface | Owns |
| --- | --- |
| **Author Source** (`.reel`) | What the piece is: target Script, media requests, components, Tracks, Film and public Outputs. It brings in the vocabulary it needs, plus any other Author or Recipe Sources. |
| **Recipe Source** (`.grade`) | Reusable authored values, such as a visual Style or request configuration. The Source that uses it still receives it as an explicit input. |
| **Run Source** (`.slate`) | One Author entry, the public Outputs this execution must complete, and any file, earlier Result or Fragment Candidates it uses. |
| **Author Package** (project `packages/`) | A visual or semantic role big enough to warrant its own tags and code. |

A project can hold several of each. Keep several Runs against one Author Source when what they
demand or reuse really differs. Running the same Run again makes another Build, not another production.

[Source syntax](source-syntax.md) has the language forms and [Runs](runs.md) the execution choices.
`clipkin vocabulary <package>`, or a focused `--tag` or `--visual` query, gives an installed Surface's
attributes and outputs; the package's own README gives its exact behavior and API. Source imports
choose author vocabulary; Runtime configuration chooses external facilities. The two never mix.

## Runs carry execution choices

A Target marks where this Run wants the graph to become real. For an ordinary commission that is
usually the finished video, and the Build produces everything that video depends on through the same
graph. Intermediate public Outputs — an image, a prepared clip, a piece of audio — are equally valid
Targets when the user asked for that deliverable or the work genuinely needs it on its own right now.

Any public Author Output that completes on the way to a demanded Target is saved in that Build's
Result, where it can be inspected or reused later. That includes derived Outputs — normalized media,
a local temporal domain, alignment evidence — that completed only because something downstream
needed them.

The Author Graph supplies the primary Candidate for every Logical Output. A Run may instead pick
another compatible Candidate:

- `<file>` admits a project file as a Candidate with no inputs;
- `<build-record>` points at a single public Output of a single earlier Build Result;
- a Run Fragment derives Candidates by computing from the inputs it is given;
- `<satisfy>` assigns one declared Candidate to one Logical Output.

Choosing a Candidate is an implementation decision for this Run alone. Core checks that the nominal
Types are compatible and plans the Author and Run graphs together. The displaced upstream subgraph
drops out, except for any upstream Outputs the chosen Candidate itself consumes.

[Runs](runs.md#generate-material-while-composing) shows targeting prepared material while component
work continues, then reusing it for focused renders and delivery.

## Reuse produced work explicitly

When revising or retrying, keep using produced media that still serves the current intent. Leave the
Run's unrelated Candidate selections in place and add explicit selections for any newly completed
Outputs the next Build should keep. Swapping one image or adjusting a Caption does not hand every
other Output back to generation. But deleting a `satisfy` returns that Output to its primary
Candidate — and that can launch a new paid request even though neither the Source nor the Output
name changed.

An earlier public Output is addressed exactly by Build id plus Output name:

```reel
<build-record id="opening-take"
  build="bld_20260902T110000001Z_0000000001" output="opening-take.video"/>
<satisfy output="opening-take.video" candidate="opening-take"/>
```

If the Logical Output has since been renamed, the two names differ: `build-record output` is the
public name inside the old Result, and `satisfy output` is the position in the current graph. Clipkin
never guesses that two different names mean the same creative thing.

### Find the right Output

Search the selected production's Result repository with `clipkin builds`, `clipkin inspect <build-id>`
and `clipkin history <output-name>`, following recorded Builds and Runs to the Output you need. In a
repository shared by several targets, the Source and Run decide which target an entry belongs to; an
Output name alone does not (`history --source <author-source>` narrows the search). Write the exact
choice into the Run.

Things that are easy to get wrong:

- Results keep their public Outputs even when nothing was exported to `assets/` or `output/`. Inspect
  them before deciding material is missing.
- A failed or cancelled Build may still hold completed Outputs worth keeping. Reuse those rather than
  paying to generate them again just to get past a later failure.
- Forwarding an earlier Output into a later Build copies no bytes. New structured Outputs keep
  references to the media they reuse; wrapping a video in another value does not create a second video file.
- A `<file>` Candidate points at the selected file. Replace the file and later reads see the new
  bytes; delete it and the dependency is missing. A Build records the reference and does not copy the
  file into each Result. A Candidate that generates new media saves its Output as usual.

The media generated by the current Build normally continues downstream as the commission's material.
Reusing it explicitly lets Caption, motion graphics, Effects, composition and final encoding change
without resubmitting the same paid requests.

### Where the reuse boundary sits

| Edit | Still select (Candidates) | Let recompute or newly request |
| --- | --- | --- |
| Caption styling, motion graphics, an Effect, the layout | All prepared media, domains and alignment that remain valid | Only the edited visuals and the new render |
| A Moment or Selection moved, spoken tokens and alignment identities unchanged | The accepted takes, their domains and alignment | Script references, what they project to, and the presentation |
| New Cue grouping, word attributes or display-only Dual text; speech tokens unchanged | The accepted takes, their domains and alignment | A fresh CaptionDocument and how it is shown |
| Where things sit in time, or how long the whole Timeline runs | Prepared media, domains and alignment | Timeline construction, each projection it affects, the occurrences and the presentation |
| A handful of B-roll images | The performance, the voice, every other useful asset | Just the swapped images and what is composed from them |
| A new presenter, with an argument that still holds | Cutaways, icons, music and anything else that still fits | Fresh presenter images, the performances they touch, their preparation and timing, then the composition |
| A new product that changes what is demonstrated or claimed | Any views or media whose content still suits the new Treatment | The product views, the performance, timing that depends on Script, and the visual treatment it affects |
| The same clip needs different preparation or semantic timing | The generated clip, or its normalized media if that is still right | Only the preparation or alignment in question, plus whatever consumes it |
| Reworded speech that must be performed again | Everything the rewording does not touch | The new take and any timing derived from it |

Pick an Output upstream of what is changing, with the same nominal Type and the creative meaning you
intend. Media, its local temporal domain and its NarrativeAlignment are three independent reusable
facts; keep exactly the ones that still hold.

Alignment evidence is trustworthy only as long as its Narrative, Segment, token and anchor identities,
and its times, still match the Script and media you have now. Editing Script does not by itself void
all media or alignment — check what really changed:

- Markers select existing token and Segment anchors. Moving a marker can keep the accepted alignment
  when the anchors and spoken tokens are unchanged; a cue now following another word is no reason
  for a fresh acoustic measurement.
- Changing spoken text, tokenization, Segment identity or the source performance demands a new
  judgment about the alignment it affects.

Hold on to upstream media that still fits and allow only the preparation that must change to run
again. No reuse choice quietly bends old evidence to fit new speech.

Never feed an edited Track or final composition its previously rendered Output: that would hide the
very edit you just made. Matching Types cannot tell you that an old performance or old timing still fits.

After a person or product swap, audit every existing Candidate against the new target. A Run that
still selects the previous presenter's video keeps that person on screen however much the image
prompt changed. Keep unrelated work while selecting or generating what the adaptation needs.

Example: fixing three wrong B-roll picks means replacing exactly those three selections and keeping
the produced performance. Read the resulting plan. New image requests there are expected; a new
performance request is not explained by that fix and points to a lost Candidate.
If an earlier attempt might still be running, see [Builds](builds.md) before submitting or inspecting.

## Edit the fact where it lives

Before touching an existing production, collect the current facts that bear on the change: the
relevant parts of Brief and Treatment, and the affected Source, Recipe or Run. Look at Results and
Runtime activity when reuse or running work matters. Read the relevant diff and leave unrelated work alone.

| What changed | Where to edit |
| --- | --- |
| The creative design | Treatment |
| Words, Cue membership, Selections or Moments | Script |
| Composition, parameters or authored timing relationships | Source or Recipe |
| The demanded deliverable or a selected Candidate | Run |
| Fixed or reusable component behavior | The project package (an unexposed local design detail can change there without becoming a parameter) |
| The desired shot, or media the user asked to replace | The media request |

Generated Result bytes are evidence and reusable input; they are never Source to edit. If the edit
can live with the existing media, leave that media selected. If it deliberately asks for new paid
media, that request should first appear in `clipkin plan` (and its cost in `clipkin pricing`), then proceed only
within the user's spending authority.

## What each view can tell you

`clipkin check` tells you the Source and graph are legal. `clipkin plan <run>` shows the selected graph
and its external requests without sending anything. For visual authoring, Studio loads that very Run.
Submitting happens only through `clipkin build <run>`, which creates a fresh Build Result. None of these says whether the
video works creatively; judge the visible result as [Review](review.md) describes.

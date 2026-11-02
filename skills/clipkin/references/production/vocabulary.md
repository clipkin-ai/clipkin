# Choosing and extending author vocabulary

Come here when a Treatment role needs an implementation: either an installed Surface that can carry
it, or a fresh Author Package written inside the project.

## Search from the role

Describe what the element has to *do* in the work before you pick an implementation:

- What does the viewer perceive, and why is it there?
- Is it Caption, independent Typography, A-roll, B-roll, motion graphics, UI, an Effect, Audio, or a
  role that does not exist yet?
- What does it consume, and what does it publish?
- What drives it: a Script Selection, a Moment, an explicit time span, or the state of another
  component?
- What changes over time, and what stays visually persistent?
- Which choices should be author inputs, and which design can stay specific to this piece?

Then query the packages likely to own it:

```bash
clipkin vocabulary
clipkin vocabulary @clipkin/caption-fine
clipkin vocabulary @clipkin/media-operations --tag StillVideo
clipkin vocabulary --visual text
```

| Command form | Returns |
| --- | --- |
| no argument | Every package visible to the current Distribution and project, with its tags and models. Use it when the role is clear but the owner is not. |
| `<package…>` (optionally `--tag <tag>`) | Surface attributes, children, ports and examples, plus the logical Module import when one physical package contributes several Modules |
| `--visual [<shape>]` | The value shapes and rules a drawing Producer must emit |

**When to query.** The first time this production touches a Surface you have not used here yet, run
a focused query naming its package and tag. Query again if the selected package or Distribution changes, or if `clipkin check`
shows a declaration you assumed is not the installed one. Once a declaration is established in the
current context, routine edits do not need the same query again.

Beyond the listing, the package README (named in the output) holds exact behavior local to that
installed implementation. If you need still more, read the relevant implementation and its exported
API. Existing components are also good implementation examples for a new project package.

Run Fragment libraries are a different kind of interface: such a package can supply Candidates while declaring
no Markup Surfaces at all. See [Runs](runs.md) and the library's own Fragment documentation for its
inputs and exports.

## Connect model references as typed inputs

Read a model Surface's reference roles and per-input metadata, not only its prompt parameters. The
prompt gives direction; the wired edges supply the media and the declared facts needed to use it.

Seedance is the key example. Every image or video reference must state whether it shows a person:
`person-reference="true"` if the material contains a person, `"false"` otherwise; audio references
omit the field. First- and last-frame forms use `first-frame-person-reference` and
`last-frame-person-reference`, and the installed README owns which forms are required. The
[Provider](../environment/model-and-provider.md) turns these facts into the chosen service's media
handling, so no service instructions need to leak into the creative prompt. State the fact
truthfully even when it decides the route: Seedance refuses any person
reference, and the refusal shows in `clipkin plan` before anything is paid for
([alternatives](../environment/model-and-provider.md#inputs-some-providers-refuse-until-the-request-changes)).

Speech Surfaces type their voice inputs too. A Qwen3 `VoiceDesign` publishes `.reference`, an
ordinary audio Resource that `qwen:VoiceClone voice=…`, `minimax:ClonedVoice sample=…`, another
vendor's clone or a video model's audio reference can all take; `reference-speech` names the Text the
reference actually says. A MiniMax `ClonedVoice` instead publishes `.voice`, a `MinimaxVoice` value
that only `minimax:ClonedSpeech voice=…` accepts (its `.preview` is ordinary audio). Query
`clipkin vocabulary @clipkin/qwen3-speech` or `@clipkin/minimax-speech` for the exact attributes;
[Voice and performance](../playbooks/craft/voice-and-performance.md#choose-between-visible-and-audio-only-a-roll)
chooses between them.

## Judge an installed component by what it does

An installed Surface fits only if it matches the work on every one of these: what it means, what it
takes and gives, how it behaves over time, which part of the composition it owns, and how far its look
can stretch. Differences in words, colors,
spacing or ordinary media inputs are just configuration, as long as the Surface already exposes them.

A catalogue preview helps you recognize a component's visual role. Its declared inputs and behavior
show what you can adapt, and opening it in Studio, configured for this piece, shows whether it actually serves it.

Record the creative role in the Treatment, and the implementation choice in Source imports and
elements. Between them, those two places hold the reason and the exact choice.

## Write a project component when nothing installed fits

If the piece needs a visual role, structure, state change, interaction or crafted behavior that no
installed Surface offers, write a project Author Package under the project's `packages/`. This is ordinary video-making, not an
exception. Never patch Clipkin Core, the CLI or an installed Distribution package to build one video's
component; author the behavior in the project package and select it through normal imports.

Keep each boundary doing its own job:

| Layer | Owns |
| --- | --- |
| The package | How it renders, its fixed design, the shapes and defaults of its inputs, and the vocabulary documenting all of that, no matter how often it is reused |
| Source and Recipe | Wiring supplied content, assets and semantic timing, and the choices the component exposes |
| Runtime Profiles | External execution and credentials |
| Provider packages | Media tools and external services |

For the public package boundaries, read the installed READMEs of `@clipkin/clipkin/producer`,
`admission`, `author` and `markup`, plus a relevant existing component as an implementation example.
Give the new package its own Module identity under the project owner's scope; `@clipkin/*` is the
Clipkin project's publishing namespace and not a scope for project packages.

**Imports.**

- TypeScript uses public SDK paths: `@clipkin/clipkin/author`, `@clipkin/clipkin/producer`,
  `@clipkin/clipkin/admission`, `@clipkin/clipkin/markup`, `@clipkin/composition`, `@clipkin/clipkin/text`
  or `@clipkin/caption`. Studio Companions use the separate `@clipkin/studio-companion` package.
- Source imports name logical Modules instead, such as `@clipkin/caption@1`.
- Domain packages you import are ordinary `dependencies`; compatibility with the Clipkin and Companion
  host APIs is declared through `peerDependencies`.
- When learning from engine-internal source, translate its private workspace imports into these public
  SDK paths.

Document what the Surface is for, its attributes and its outputs, and include a short example that
validates, so the next author can recognize when to choose it. A visual preview makes its look recognizable; Studio shows the configuration a production
actually uses.

Where to go next:

- composing existing Tracks: [Tracks](tracks.md);
- shaping a new Track's visual idea, semantic behavior and useful controls:
  [Component design](component-design.md);
- how a Track takes time inputs, owns space, keeps state, ships preset content and emits peer picture
  and sound:
  [Track authoring](track-authoring.md);
- a new speech-text family that reuses the transcript and timing: [Caption authoring](caption-authoring.md);
- timeline Items and Inspector editing for the new component: [Studio and Companions](studio.md);
- the actual Track and element representation, with a drawing example:
  [Component visuals](component-visuals.md);
- where it sits in the whole production: [System relationships](system.md).

## Let ordinary package management own distribution

Installing components and choosing their versions is the project package manager's job. Clipkin loads only the packages
selected by Source or Run imports, plus their declared dependencies, and never scans the dependency
tree looking for components.

- A project's own packages are found in that project.
- The embedded Core is supplied by whichever Distribution is selected; the default packages that product selects are
  ordinary dependencies installed alongside it.
- Independently published project packages, `@clipkin/*` ones included, follow ordinary project-first
  resolution.

Keep a new component inside the project while it serves this work. If its owner later wants it in
other projects, ship a versioned tarball or publish an npm or private-registry release, and pin it in
the consuming project's `package.json` and lockfile. Sharing changes only where the same package gets
installed; it does not change the component model or require any Clipkin-specific registry.

[Sharing a project package](component-sharing.md) covers packaging, identity and upgrades in detail.

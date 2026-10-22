# Runs: Targets, Candidates and reuse

Read this when you are choosing deliverables, reusing an Output, or deciding which media an execution
should use. [Authoring](authoring.md#reuse-produced-work-explicitly) helps you judge which produced
value still fits an edit; [Builds](builds.md) covers finding it and executing.

A Run answers two questions: what should this execution finish, and which existing or substitute
values should it use on the way?

- A **Target** names a deliverable Output.
- A **Candidate** supplies an Output needed along the way.

Whatever the selected dependencies leave uncovered is the work that remains. Take a retitled video: the
performance you already produced, the domain it was measured on and the word alignment can all stay,
while a new final video is still made: the Source describes the new title, and the Run
keeps the three completed Outputs, each on its own.

## The declarations

| What it does | Element |
| --- | --- |
| Names the one Author entry this Run executes. | `<author source="./main.reel"/>` |
| Makes one installed Run Fragment library available (`as` and `from` are both required). | `<import as="media" from="@clipkin/media-operations@1"/>` |
| Demands one public Author Output; repeat for several. At least one is required. | `<target output="final.video"/>` |
| Admits one project file as a typed Candidate with no inputs. | `<file id=… type=… from=… media-type=…/>` |
| Brings in a specific public Output saved by a previous Build. | `<build-record id=… build=… output=…/>` |
| Admits a serialized typed value read from a JSON file. | `<value id=… type=… from=…/>` |
| Instantiates a package Fragment whose exports become Candidates. | `<fragment id=… using="alias:name">…</fragment>` |
| Assigns one declared Candidate to one Author Logical Output (at most once per Output). | `<satisfy output="…" candidate="…"/>` |

Order is enforced: Header, `<slate version="1">`, exactly one `author`, then any Fragment imports,
then Targets and Candidate declarations. Runtime Profiles, Provider options, credentials and export
destinations never appear in a Run.

## Select the Output the current work needs

```slate
<?reel using="@clipkin/markup/run@1"?>
<slate version="1">
  <author source="./production.reel"/>
  <target output="final.video"/>
  <build-record id="kept-media" build="bld_..." output="opening-normalized.media"/>
  <build-record id="kept-domain" build="bld_..." output="opening-normalized.domain"/>
  <build-record id="kept-alignment" build="bld_..." output="opening-alignment.alignment"/>
  <satisfy output="opening-normalized.media" candidate="kept-media"/>
  <satisfy output="opening-normalized.domain" candidate="kept-domain"/>
  <satisfy output="opening-alignment.alignment" candidate="kept-alignment"/>
</slate>
```

`bld_...` is a placeholder: substitute the real Build id you found in Results. `clipkin check` accepts
the placeholder, but `clipkin plan` rejects it — a Build id must carry its UTC submission time and a
ten-character nonce, and the Result must actually contain the named Output. In each `build-record`,
`output` is the name inside that earlier Result; in each `satisfy`, `output` is the current Author
Output. The three selections preserve the media, its duration and its NarrativeAlignment as three
facts, without pretending they are one bundled object. A changed Caption or motion graphic can then
recompute downstream. Marker moves and display-only edits can keep the alignment too; the
[reuse table](authoring.md#reuse-produced-work-explicitly) separates those from changes to speech or media.

There is always exactly one Author entry, and the Targets are public computed Outputs: `main.composition` while
working on composition, `final.video` for delivery, or an intermediate the work needs on its own.
The selected graph pulls in whatever those Targets depend on.

## Decide what the replacement supplies

A file can stand in for an Output that produces bytes:

```slate
<file id="supplied-performance" type="@clipkin/blob@1#Blob"
  from="./assets/performance.mp4" media-type="video/mp4"/>
<satisfy output="performance.video" candidate="supplied-performance"/>
```

This replaces only the generated video bytes; normalization and alignment still run on the file.
`media-type` must be a concrete MIME type. By contrast, selecting completed normalized media,
local-domain and alignment Outputs preserves those facts — but not their later Timeline placement or
how Visual and Audio Clips use them. Choose Outputs whose meaning is exactly what you want to keep; the Type each position expects tells
you what can go there.

## When a Candidate has to be computed: Fragments

A Run Fragment wires up a computation whose result becomes a Candidate. For example, Media
Operations ships a `still-video` Fragment that turns one authored still into a timed video:

```slate
<import as="media" from="@clipkin/media-operations@1"/>
<fragment id="product-hold" using="media:still-video">
  <input name="duration" from="product-still.duration"/>
  <input name="clock" from="clock"/>
  <input name="layout" from="product-still.layout"/>
  <input name="source-0" from="product-image"/>
</fragment>
<satisfy output="product-clip.video" candidate="product-hold.video"/>
```

Here the Author Source already declares a `mediaop:StillVideo id="product-still"`, whose public
`product-still.duration` (a TemporalDuration) and `product-still.layout` (a
`@clipkin/media-operations@1#StillVideoLayout`) the Fragment reuses; `product-image` is an authored
image Blob and `clock` the Source's Clock. The Fragment's `duration` input is typed: a scalar such as
`value="5"` passes `check` but fails in `plan`, so feed it a duration value with `from`. The package
README lists the Fragment's exact inputs. [Media](media.md#give-a-still-a-duration-when-that-is-its-role)
shows the plain `StillVideo` Surface for authoring this directly in Source, which is usually simpler.

Rules for Fragment instances:

- Imports go after `author` and before every execution declaration.
- `using` is `alias:fragment`, naming a Fragment from an installed package.
- An input takes exactly one of `from` or `value`. `value` supplies a scalar (number, boolean, null
  or text). `from` names a public value of the Run's Author entry, computed Outputs included; such a
  value keeps its own dependencies and Candidate selection. `from` cannot name another Run Candidate,
  and it does not reach an imported Source's private bindings.
- Exports are addressed `instance.export`. Optional `<export name="video"/>` children limit which
  exports the instance exposes; selecting an export brings in the computations it requires.

The resulting Candidate is `product-hold.video`. Selecting it replaces the computation at
`product-clip.video` — in this case a generated video request — while the preparation and
composition that consume that video stay in place.

## Generate material while composing

Media requests depend on the Script, the direction, the references and the requested duration. As
soon as those are settled, and the commission covers their cost, a Run can target the material
while you keep working on components and Recipes. Decide shared matters, such as where the presenter
leaves room for an overlay, in Treatment. Then express the material half as what the camera should visibly capture (image and video
direction), and the composition half as actual layout and event inputs.
Independent requests can run while the components downstream of them are being written.

The small [production Source](examples/production.reel), [Recipe](examples/look.grade),
[direction Kit](examples/direction.grade), [material Run](examples/material.slate) and
[production Run](examples/production.slate) show these execution choices; copy them into a project
together. Their deliberately simple performance request only demonstrates the wiring — real casting,
references and direction come from the Treatment and the Craft pages.

How the pieces play out:

1. `material.slate` targets `opening-alignment.alignment`. Demanding the alignment also demands the
   normalization and the local domain it rests on.
2. While that runs, work on the title and where it sits. In the example the title is timed by the
   projected `proof` Selection, so it lands on the spoken words.
3. When those Outputs complete, select media, domain and alignment with `build-record` in the Run you
   render with, so it uses the produced performance and its word timing instead of requesting them again.
4. For a focused composition change, [detail.slate](examples/detail.slate) targets frames 30–90 of the
   same Source and reuses those prepared Outputs. Put the real Result id in place of `bld_...`. The new
   Build evaluates only the changed composition over the chosen render interval.
5. The final delivery Run reuses the same material and evidence for the full render.

If material already exists, use it directly. Always choose Targets by the dependencies the current
work really needs.

[Rendering](rendering.md#choose-a-render-interval-in-frames) covers frame ranges and reuse;
[Review](review.md) covers judging the arrangement; [Studio](studio.md) is the place to
play the work, tweak parameters or use a component's Companion interactively.

## Keep the choices that still apply

When you add a new selection, leave the unrelated `satisfy` lines alone. Deleting one hands that
Output back to its Author computation. A new Build never infers reuse from matching names or an
unchanged prompt. Read the plan to confirm the changed selection leaves exactly the generation,
preparation and rendering you intend. [Rendering](rendering.md) explains why even a short render
interval still needs explicit upstream reuse.

## Typed values and exported Results

`<value id="settings" type="@owner/module@1#Settings" from="./settings.json"/>` admits a serialized
typed value as a Candidate. The file holds a StoredValue wrapper such as
`{"kind":"inline","value":{"enabled":true}}`, and the inner value must match the declared Type.
For structured Outputs already held in Results, prefer `build-record`, which resolves their
associated media resources along with them.

Exporting a Composite with `clipkin get` writes a `value.json` too, but that file is a Result value
document whose resources are bound separately; it is not a StoredValue wrapper and cannot be fed to `<value>`.
[Project handoff](../creation/project-files.md#hand-over-an-editable-production) explains keeping the
Result itself when structured reuse must work from another project location.

The installed package's Run Fragment documentation lists its own inputs and exports. Surface
vocabulary queries describe Markup tags, so a package that contributes only Fragments may show no
entries in `clipkin vocabulary`.

# Source syntax

This page is the grammar around a production: imports, references, literal values, Recipes and the
choices a Run makes. Prose, Roles, Dual Text, authored Cues, display attributes and markers belong to
[Script syntax](script-syntax.md). [Timing](timing.md) shows how components consume the identities
Script creates, and [System relationships](system.md) explains authored values versus computed Outputs.

## Three documents, three decisions

| File | Usually holds | Header |
| --- | --- | --- |
| `.reel` | The work itself | `<?reel using="@clipkin/markup@1"?>` |
| `.grade` | Reusable authored values | `<?reel using="@clipkin/recipe@1"?>` (or another Recipe Frontend, below) |
| `.slate` | What to execute and what to reuse | `<?reel using="@clipkin/markup/run@1"?>` |

The Header is what selects the parser. The extension is only a naming convention that tells people
the file's role.

Here is a small Author Source. It yields Text and Script values and asks no model for anything:

```reel
<?reel using="@clipkin/markup@1"?>
<reel>
  <import from="@clipkin/script@1"/>
  <import as="copy" from="@clipkin/text@1"/>
  <import as="kit" source="./direction.grade"/>

  <script id="story">
    <opening><HOST>Here is @{proof}the useful part.@{/proof}</opening>
  </script>
  <copy:Value id="direction">She tilts toward the lens, quietly pleased with her own point.</copy:Value>
  <copy:Render id="prompt" template={kit.performance}>
    <copy:Set name="dialogue" text={story.segment.opening.dialogue}/>
    <copy:Set name="direction" text={direction}/>
  </copy:Render>
</reel>
```

### Imports

- A **package import** (`from`) exposes vocabulary under a local alias. Write the package's logical
  Module ABI, such as `@clipkin/text@1`; which release is installed is ordinary package management.
- A **Source import** (`source`) exposes another document's public values:
  `<import as="look" source="./look.grade"/>`.
- A data package can export a Source of the same kind, e.g.
  `<import as="ugc" source="@clipkin/gpt-image-kits/phone-ugc-v1"/>`. Its relative imports and assets
  stay inside that package, and reading a packaged Source never runs its JavaScript.
- All imports go in the leading prologue, before any body declaration.

An alias prefixes the names you reach through it, but a Narrative keeps the identity its author gave
it. If two imported Sources each declare a Script called `story`, they collide even under different
aliases. Import the one Script that owns the work from a single place, or, when the Narratives really
are separate, give each its own id.

## Braces connect values

| You write | It means |
| --- | --- |
| `duration="5"` | Literal attribute text, interpreted by the receiving Surface. |
| `prompt={direction}` | A whole-value graph reference, checked against the declared input Type. |
| `prompt="direction"` | The string "direction" — not a reference. |

Braces hold a binding path, nothing else: no expressions, no string building. To assemble text, use
`copy:Render` with a TextTemplate and explicit bindings. Where a receiving package declares its own
expression syntax (temporal offsets, for example) use that. Some ports accept only a reference: a
`seedance:TextVideo` `prompt` must be `{…}`, never a quoted literal.

Output paths are package vocabulary. Nothing derives them from the tag, so do not guess:

| Declaration | Publishes |
| --- | --- |
| `copy:Value id="direction"` | `{direction}` |
| imported `media:Image id="logo"` | `{logo}` |
| `gpt:Image id="portrait"` | `{portrait.image}` |
| `pipeline:Normalize id="prepared"` | `{prepared.media}`, `{prepared.domain}`, `{prepared.extent}` |
| `time:Timeline id="speech"` | `{speech.timeline}` plus its named Instants and Windows |
| `typo:Flow id="title"` | `{title.occurrence}` and `{title.visual}` |
| `visual:Track id="picture"` | `{picture.visual}` and `{picture.program}` |
| `audio:Track id="mix"` | `{mix.audio}` and `{mix.program}` |

(`pipeline` here is just a local alias for `@clipkin/media-operations@1`.) Visual and Audio Tracks
publish picture and sound separately, and Film selects each one. When in doubt, run
`clipkin vocabulary` for the Surface and use the path it reports.

Public bindings come in two kinds. **Authored Records** — Script, Recipes, literal Text — already
exist as data and are never Run Targets. **Logical Outputs** are realizable: the `prompt` computed by
`copy:Render` above can be targeted, or replaced by a Candidate.

Declaration order matters while reading: current Markup handlers inspect imported values and earlier
declarations during decoding, so declare a value before the structured Surface that resolves it.
Execution order is different — it follows graph edges, not the order of XML elements.

### Who reads which body

Each body has its own reader. Script parses its own prose grammar. Structured components accept only
the attributes and children they declare. Text has its own literal and template forms. In structured
Markup:

- write only what the receiving Surface declares: its attributes, children, literal forms, Recipes and reference expressions;
- escape `&`, `<`, `>`, `"` and `'` as `&amp;`, `&lt;`, `&gt;`, `&quot;` and `&apos;`;
- write comments as `<!-- ... -->`, outside raw bodies.

Script decides what its own punctuation means inside its raw body; see [Script syntax](script-syntax.md).

## Recipes are named values

A Recipe sheet is a list of named rules; each rule becomes one value.

```grade
<?reel using="@clipkin/recipe@1"?>
<sheet version="1">
  visual.soft {
    opacity: 0.92;
    clip: rounded;
    radius: 24;
  }
</sheet>
```

Imported as `look`, that rule is `{look.visual.soft}`, which a `visual:Clip` can take as its
`treatment`. Rule names are dotted paths. Rules never inherit or cascade: `caption.base` and
`caption.guest` are unrelated values. Each consumer decides which properties it accepts, their
defaults and their units — a Caption Style Recipe is not interchangeable with a picture treatment
just because both mention a color or a size, and consumers reject properties they do not know.
Stacking is not a Recipe property: occurrences such as `visual:Clip` and `typo:Flow` take their own
required `z` attribute.

Value rules:

- every property ends with `;`;
- `null`, booleans, finite numbers and simple bare words are scalars;
- quote any string whose punctuation could be mistaken for Grade syntax;
- arrays and objects are strict JSON, with quoted keys and strings.

```grade
caption.host {
  enabled: true;
  color: "#ff6f61";
  padding: [12, 18];
  motion: {"kind":"spring","amount":0.12};
  enter: 8f;
}
```

`8f`, `250ms` and `50%` stay strings until the consuming package reads them. Recipes never evaluate
graph references, so anything that lives in the graph — media, fonts, semantic ranges — must still be
wired into the consuming component as an explicit Source input.

A package may define its own precedence for parameters (TextTemplate does); that is local behavior,
not global inheritance in Grade. A Prompt Kit only reuses text. The pictures and voices it refers to,
the model's settings and anything generated are still declared openly in the Author Source.

### A Recipe sheet with a different Frontend

The `direction.grade` imported above picks Text's own Recipe Frontend, so it yields a TextTemplate
instead of plain Recipes. Same extension convention, different explicit Header:

```grade
<?reel using="@clipkin/text/grade@1"?>
<sheet version="1" id="performance">
  text-template.performance { separator: paragraph; }
  text-template.performance.block.dialogue {
    kind: slot;
    order: 10;
    slot: dialogue;
  }
  text-template.performance.block.direction {
    kind: slot;
    order: 20;
    slot: direction;
  }
</sheet>
```

This tiny Kit only joins two Text inputs; it generates nothing. Fixed blocks and choice axes can be
added when they carry reusable direction — `@clipkin/text` owns that template grammar, and
[Prompt Kits](prompt-kits.md) explains it.

## Runs demand Outputs and choose Candidates

With the Text example saved as `main.reel` next to `direction.grade`:

```reel
<?reel using="@clipkin/markup/run@1"?>
<slate version="1">
  <author source="./main.reel"/>
  <target output="prompt"/>
</slate>
```

A video Run normally targets the renderer's public video Output; declare several Targets when several
deliverables are wanted. Targets are public Output names, and any request outside the demanded graph
simply does not run.

To reuse an earlier Output, declare a `build-record` Candidate and select it with `satisfy`; the name
in the old Result and the current Logical Output name may differ. Mind the Types: a raw MP4 is a Blob
Artifact, not normalized media and not alignment evidence. Choose Candidates by their real nominal
Type and creative meaning, and keep normalization, local-domain recovery or alignment wherever they
are still needed. For every Candidate form and for Fragment inputs and exports see [Runs](runs.md);
whether reuse is creatively right is decided in [Authoring](authoring.md); each installed Fragment package documents
its own input and export names.

`clipkin check <run>` confirms Source and graph legality. `clipkin plan <run> --runtime <profile>` shows
the selected graph and the external requests without submitting them. A perfectly legal document can
still describe a weak image, a badly placed Caption or a pointless cut — those remain directing questions.

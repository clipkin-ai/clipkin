# Studio Companions

Use this page while giving a project component timeline meaning, picture selection or author controls
in Studio. Launching and using the editor is described in [Studio](studio.md); deciding where the
component's creative edge lies is the job of [component design](component-design.md).

A Companion answers two questions: **what can the author recognize and select**, and **which authored
fact does an edit change**. Use the same concepts in the picture, on the timeline and in the Inspector.

- A reveal can be a single Item even though its graphic travels and then stays on a board.
- A scene where presenter and diagram move in concert can remain a single Item if people should
  edit its layout as one thing.
- Recognition and editing are separate abilities. Some productions use Studio mostly to watch and to
  show how the piece is arranged, with only a few adjustments. Clear labels, timing and a handful of
  read-only facts can fully serve a one-off scene, and useful Caption controls can sit next to that
  fixed scene.

## Pick useful Items and lanes

The Companion must match the component's actual Module ABI, its Surface and the Type of its final
output. For plain Clip occurrences the generic VisualTrack or AudioTrack Items already suffice. Write `project(context)` when the author
needs domain meaning that the final drawing no longer contains. A Surface preview supplies a static
image for recognition; live Items and editable bindings come from the Companion.

**Generic projection only knows the terminal Type, not the creative role.** A custom Caption can render
perfect subtitles and still show up as a generic blue visual lane with opaque ids if its package lacks
a matching Companion. Before deciding content is misplaced or moving visuals between Tracks, check
which Companion was selected and whether its Module/Surface match. The package declares the role;
Studio never infers it from a tag name or from text visible in the picture.

If you adapt an existing family, carry its editor meaning over as far as its public content, schedule
and author identities remain the same. Reuse its Companion under the actual Module/Surface identity, or adapt
its projection to the changed behavior. Preserve useful Cue/Use or item/event relationships alongside
the rendering. Wrapping the renderer alone does not carry that integration over.

For instance, a board can expose its outer lifetime and each reveal event. Publish the deterministic
schedule or program needed to describe them from the same Surface, then name that exact output port in
`requiredValues`. `requiredSurfaceValue(context, "schedule")` reads the published output;
`requiredReferencedValue` instead follows one exact typed author reference. The port must exist in the
Surface's public outputs; naming a port in the Companion does not expose an internal Producer value.

| Declaration | What it gives the author |
| --- | --- |
| Companion `label`, `tone`, `icon` and `lane.heightPx` | Let people spot the component at a glance, with enough height for what it shows |
| Item id and authored identity | Keep selecting the same authored object after recompiling or reordering; qualify child ids across component instances |
| `display.title` and display layers | Show meaningful content, text or declared media instead of an implementation id |
| `startFrame`, `endFrameExclusive` | State what the rectangle edits: occupancy, activation or another explicit interval |
| `stackOrder` | Order overlapping editor Items; unrelated to the Film's paint order |
| Companion `attachments` and Item `lane` | Add a child lane that means something (say, a board's reveals) and has fields of its own |

Each declared lane is one row. Overlapping Items stay selectable, and selecting one raises its
rectangle within that row; parent and attached lanes behave alike. Add a child lane when it reveals
another authoring relationship, such as activations within a persistent board.

An activation rectangle can end well before the object disappears. Keep the editable activation range
separate from the object's ongoing picture identity. The installed Ranking Companion shows this with
the board and its independent reveals.

## Track-owned rules belong in the Inspector

Some authored rules shape how a Track behaves without being events in time. Declare those with
`inspectorObjects`. Caption, for example, shows Cue Items on its timeline row and keeps its Style Uses in the
Inspector. A Use can still display its authored scope and offer its Style's controls without
pretending that scope is a draggable range.

```ts
inspectorObjects: [{
  id: "uses",
  label: "Presentation Rules",
  bindings: [{ name: "style", companion: true }],
  project: projectUses,
}]
```

Use `attachments` for child content that is represented independently, such as Ranking's reveals. The
difference matters: an attached child is a genuine Track, with Items and a time identity of its own,
while an Inspector object has neither. Hold
on to that distinction instead of turning every rule into another timeline row.

## Tie the picture to the Item

Link the actual rendered parts to an Item through `presentId` or `renderIds`. Every phase of an item
(entrance, travel, settled appearance) can then select it. When separate selection is useful, give the
board and background parts to the parent and each reveal's parts to its child.

The renderer's explicit `subjectId` can tie several rendered phases to one domain item, and the
Companion passes their real ids in `renderIds`. Studio uses whichever parts are visible at the current
frame, so selection keeps working after an icon lands, without the Companion duplicating animation
geometry. A preset with no separately exposed child stays part of the parent Item.

Whether the user clicks the picture or the timeline, they land on the same authored object; when its
position and size are exposed, the declared Inspector fields can adjust them.

## Expose decisions, not implementation leftovers

Declare `bindings` for the real author endpoints, then choose which `inspector` fields are visible.

- `referenced` follows a shared authored Frame or Style.
- `recipe` follows a path to a Grade Recipe.
- `parameterReferences` gives an Item its actual reference when a derived Item points at a different
  authored object (for example, the Style a particular Cue really uses).

Shared values keep their shared effect when edited.

A Companion presents the author's model of the component. A meaningful semantic event may deserve a
timeline handle without every animation key becoming a field. Conversely, a number or qualitative
setting buried in drawing code does not have to become a public input. Apply the
[parameter boundary](component-design.md#expose-the-choices-the-work-needs) before choosing UI. If a
real need for an Inspector adjustment appears, connect it to an actual Source input or domain event.
Until someone outside has a reason to control it, a label drawn by a one-off renderer may remain
internal. Child Items can sit inside the same Track, and an Item may be selectable without being
editable. The
[component boundary](component-design.md#separate-responsibility-parameters-and-reuse) decides what
gets its own owner; it says nothing about how many controls to offer.

Where covers placement and layout, When covers timing, playback and motion, How covers appearance,
content and sound. Each Companion chooses its own pages and sections inside them.

| Control | Use it for |
| --- | --- |
| `text` | Wording or a meaningful expression; `multiline` for longer text |
| `number` | A magnitude, with suitable units, scale and limits |
| `boolean` | A genuine two-way choice |
| `select` | A preset, font, alignment or other finite choice, with readable labels |
| `color` | An exact hex color, optionally with suggested `swatches` |
| `list` / `record` | A schema-described ordered list or named group of values, saved together once editing ends and the value is complete |

For a Surface that already has a literal `label` attribute, the minimal declaration is:

```ts
bindings: [{ name: "label", writable: true }],
inspector: [{
  binding: "label", label: "Label", domain: "how",
  section: { id: "content", label: "Content" }, control: "text",
}],
```

The Surface owns `label`; the Companion only exposes it. Units and conversion:

- Width authored as the string `"78%"`: declare `control: "number", number: { suffixes: ["%", "px"] }`.
  Entering 42 leaves the `%` in place.
- Opacity authored as the fraction `0.78`: declare
  `unit: "%", number: { scale: 100, minimum: 0, maximum: 100 }`. The field displays 78, and entering
  42 stores 0.42.
- `unit` on its own is just a display label. Suffix handling keeps an authored unit; it never converts
  percentages into pixels.

A Style can own its controls independently of whichever Track consumes it. On the Track side, declare
`{ name: "style", companion: true }`. On the Style side, its package registers
`createStudioCompanionFacet({ parameters: [{ id, match: { module, surface }, bindings, inspector }] })`.
Field names there are local to the Style. Studio resolves the reference and places those fields next to
the Use's timing controls. A motion Style invented for this project gets the same treatment as a
well-known framed visual, and edits to a shared Style still affect its other Uses.

Defaults and grouped edits:

- A binding's typed `fallback` displays an omitted default; the first edit writes the property or
  attribute into its owning file. A fallback can be a function of the authored properties to express a
  dependent default. Pick valid defaults in the component's own vocabulary.
- Read-only facts and controls share the Where, When and How groups; fields without a page stay
  visible next to the active page.
- Several related scalar attributes can be edited as one `record` draft: list them in the binding's
  `attributes` and describe them with a schema. Use object alternatives distinguished by a literal mode field when each choice needs
  different inputs; once the required fields are complete, the chosen group is written together and
  unused members are removed. The package owns those alternatives. The exact declaration is in the
  installed `@clipkin/studio-companion` README, section "Edit related attributes together".

An option in a `select` is either a bare string or an object `{ value, label, description, preview }`.
Previews of colors and fonts are only visual hints; Source receives the option's value. Font hints are
drawn with a family the editor has, whereas the font used in production remains an explicit resource
(see [fonts and text](fonts-and-text.md)). What counts as a valid value is set by the component's
schema. Studio applies the declared conversion, writes the value in the source language's syntax, and
saves the file that owns it.

## Keep the timing decision intact through edits

Carry the real Window/Instant lineage on every Item. For a domain Spec consumed alongside a
projection, `temporalLineageFor(context, item.id, "activation")` follows that actual consumer input;
pass the real input name, such as `window`, `outer` or `activation`. No match leaves the Item
read-only; several matches are an error to resolve in the projection, not a guess. To tie domain child
identities to the exact places they were authored, use `authoredChildFor` and `childItems`.

The [authored time form](timing.md#choose-what-a-later-edit-changes) decides what an edit does:

| Authored form | What a timeline edit changes |
| --- | --- |
| Direct Selection | Its two Script anchors |
| Direct Moment | Its one anchor |
| Quoted clock expression | Its local time or offset |

A projected frame by itself does not establish any of these. When several objects consume the same
Selection or Moment, changing it updates all of them through normal compilation. A separate offset
stays a separate local decision.

## Ship it with the project package

The Companion is code apart from the component's Producers. A package outside the Distribution
depends on and imports `@clipkin/studio-companion` plus whichever public `@clipkin/clipkin/*` APIs it
uses; the Distribution itself is its framework development dependency. Append
`createStudioTrackCompanionFacet(companions)` to the `facets` of the activation you already have, keeping its author
and producer contributions; a Companion-only activation would remove the component itself. Ship the
compiled Companion through the package's normal activation entry (`clipkin.activation`).

The package selected by Source activates its Companion. Restart Studio after changing package code or
activation; ordinary Source and Recipe edits recompile within the running session.

For the full minimal Companion and activation example, read the installed `@clipkin/studio-companion`
README. The Studio and Temporal package documentation owns field declarations and exact time-form
behavior. Default examples: Caption Fine (Cue content with Style Uses) and Visual Track (ordinary
visual Clip occurrences). Ranking demonstrates persistent events, but only if the project deliberately
selected and installed that optional package; it is not part of the default Distribution.

Test the component in its real Run:

1. Select a meaningful part of the picture and confirm the matching timeline Item is selected.
2. Change an exposed value and check both the owning Source and the resulting picture.
3. For a shared timing edit, check the other consumers as well.
4. Seek into both the movement and the settled state when the component has them.

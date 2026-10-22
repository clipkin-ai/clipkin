# Studio

Use this page to open a Run in Studio, pick its interface language, work with its timeline and
Inspector, or give a project component a useful Studio presence. For the component-side
implementation, read [Studio Companions](studio-companions.md). [Review](review.md) owns the judgment
you form from the visible work; [Track authoring](track-authoring.md) owns how the component behaves
in production.

## Open the real Run

From the video project, run the installed Distribution's command:

```bash
clipkin studio --run build.slate
```

| Option | When to use it |
| --- | --- |
| `--run <file.slate>` | Always: the Run to open |
| `--runtime <profile>` | Only to use a Profile other than the project's `clipkin runtime use` selection; applies to this session |
| `--project <directory>` | Launching from another directory. The Run path is still read relative to the current directory ([project boundaries](../creation/project-files.md#establish-the-project-boundary)) |
| `--port <number>` | Request a different port than the default 5179 |

What Studio can open: a Run whose selected targets reach exactly one Film with resolved composition
and time. The Timeline supplies the clock and extent; optional projections add domain evidence such as
Script anchors. Pure animation works in the same editor. A Run that only generates images is not a
Film view, and several distinct Films need separate Runs or sessions.

Open the URL the process actually prints and keep it associated with its Run. For review, open it with
`#comments` appended (for example `http://localhost:5179/#comments`) to land directly in the Comments
view. The printed port is the truth: 5179 is only requested, and if it is taken Vite may pick another.
Reuse a running session when it already serves the right project and Run.

Startup output names the project, the absolute Run path, the Runtime Profile and where that selection
came from: an explicit `--runtime` for this session, or the project default in `.clipkin/runtime`.

What reloads and what does not:

- Studio watches the Run and its loaded Author and Recipe Sources and recompiles on change.
- Edits to package code, a newly imported package, altered Companion activation, or a switch to
  another Runtime or Result repository all need that Studio session **restarted**, because those
  are loaded at startup. Refreshing the browser does not reload server-side modules.
- Stop only the relevant Studio process. Stopping Studio never cancels a submitted Build.

## Interface language

Studio's own language is chosen from the globe menu, which sits just left of the **Studio /
Comments** tabs; English and
Simplified Chinese ship built in. The first visit follows the browser's language preferences, and
later visits remember the user's pick. Switching keeps the playhead, the selection and any comment
draft. When you introduce the review, mention this menu if it would help the user work in their own
language. It affects only Studio's interface: the video's Script, its captions, users' comments,
component-owned names and Companion labels keep their authored text.

Further languages are plain JSON loaded when Studio starts:

```bash
clipkin studio --check-locale ./studio-ja.json
clipkin studio --run build.slate --locale-pack ./studio-ja.json
```

To write a translation:

1. Copy `locales/en.json` from the installed `@clipkin/studio` package.
2. Set `locale`, the language's native `name`, and `direction` (`ltr` or `rtl`).
3. Translate `messages`, keeping every message ID and named variable such as `{count}`. Anything
   missing falls back to English.
4. Run the check command: it reports missing entries, unknown IDs and broken variables without
   opening a Run.

Relative paths are resolved from wherever the command runs. Pass `--locale-pack` more than once to
load more languages, or point at an installed package's JSON export, such as
`--locale-pack @your-scope/studio-ja/locale.json`. A local file is enough; packaging it is optional.
Restart Studio after changing a language file. For plural forms and packaged exports, see
`LOCALIZATION.md` inside the installed `@clipkin/studio` package.

## Discuss the work while composing

If the user is working with you on the same machine, bring up the real composition once one passage
is worth showing, and keep its Studio URL tied to the current Run. Point at the specific passage, object or
transition under discussion so the user can give concrete direction. Keep moving on choices that are
already settled; showing progress is not a reason to stop for approval. Use the prepared production
media and say which passages are already composed. A rendered frame or clip is still the better tool
when it answers the current question more directly.

Make sure the objects you are discussing are recognizable and that their useful author choices are
reachable. A successful preview proves the picture renders; the component's Companion decides what the
user can select and change. [Studio Companions](studio-companions.md) explains this view of the same
Source, covering both the generic fallback and families a project defines.

## Revise from timestamped Comments

Comments is the right door when the user wants to stop at an instant and say what should change
there. The composition is the same; the player is bigger and a notes column runs beside it. A change in visual style, choreography or
graphic structure usually needs authored code or new direction; a position or color may be an
Inspector field. Either is normal collaboration: the comment states the desired result, and you decide
which Source, Recipe, component or material decision to change.

Comments are stored in `FEEDBACK.json` at the project workspace root. Before revising, read the entries
for the Run under review and the open notes. Each entry has a stable `id`, a workspace-relative `run`,
`at` in seconds, `text`, and an optional `resolved` (false when absent):

```json
{"comments":[{"id":"opening-title","run":"runs/render.slate","at":1.5,
"text":"Make the title a gentler pink and push its drop shadow further out.","resolved":false}]}
```

Working with the file:

- The UI lists notes by time; their `#` numbers follow submission order within that Run.
- When editing, address entries by `id`, keep the array order, and leave unrelated entries alone.
- Clicking a note seeks to its saved time. Read that time together with the words and the reviewed
  composition: changes to the Script or media placement can move the event the note was about.
  Comments keep the seconds that were reviewed; they do not follow new semantic timing.
- Explain what you will change, change it at the owning fact, and inspect the affected passage and its
  handoffs.
- Mark addressed notes `resolved: true`; setting false reopens one.
- Both the user and you may edit the file, and Studio picks up saved changes. Always read the current
  file right before writing so freshly added comments are not lost.
- Record lasting directing decisions in Treatment or Progress; the comments remain the concrete review
  conversation.

Pressing Send only saves a comment; nothing notifies you yet. When the user asks for another pass,
read the latest file. How to judge what you see is in [Review](review.md); the production's lasting
memory lives in the [project files](../creation/project-files.md).

## Review before export

To inspect the picture closely, start with [snapshot](snapshots.md) pointed at this session. It takes
the `HtmlProgram` compiled right now, with its selected resources, grabs exact frames at original
resolution and saves them as PNGs, gridded if you like. Playback with sound, and editing, stay in
Studio.

Once the piece is close to finished and the user has access to it, open the current Run at
`#comments` and introduce Comments and Studio together:

- **Comments** lets the user pause and leave direction at a specific time.
- **Studio** shows the timeline, the relationships between components, and the parameters they can
  adjust.

Both views share the same work and playhead. Browser playback does not encode an MP4, start an export
Build or save frame sequences, so it can show real material and animation without paying for a full
encode while choices are still open. Inspector and timeline changes happen in the Studio view;
reach for an encoded frame or clip only when the question calls for that kind of proof.

Introduce the review in the user's language: say what is ready, invite timestamped notes, and state
whether export is waiting on their review or already covered by their request. For instance: "The
editable video is open. Pause anywhere and leave a timestamped note in Comments, or switch to Studio
to look through the timeline and adjust the available parameters. Once you're happy, I'll export it."
This is a collaboration option, not a required approval gate; a user who already asked for the final
export has made that decision.

For a first-time reviewer, one short welcome note at a relevant time, saved with `resolved: true`, can
help. Write it plainly as your own invitation, for example "Pause here any time and leave a note about
whatever you'd like changed." It shows how the file works without inventing an open production task or
pretending the user asked for something. Keep it optional and specific to this collaboration, and do
not repeat it when comments already exist.

When export is wanted, reuse the accepted material in a Build, fetch the completed video and inspect
that encoded file. That execution is covered by [Rendering](rendering.md) and [Builds](builds.md). Remember the
distinction: Comments lets people review the editable work, but what you deliver is the exported file.

## Show the finished work

Handing over the video together with a glimpse of its editable form makes the delivery tangible.
If the user can reach Studio without effort, open the completed work there and give them the session
URL. Pick a Run that draws on the finished normalized media, local domains and alignment evidence and
still leaves the Tracks and Recipes open for editing. Reuse a fitting session or start one as described above.

Point at something particular to this piece: a reveal landing on its word, the Caption styling, a
component parameter they can tweak. Let the real work demonstrate the editing experience. For a remote
user, a screenshot or short recording that is readily available can serve the same purpose.
[Project handoff](../creation/project-files.md#hand-over-an-editable-production) lists what to include
when the user wants to keep editing on another machine.

## What each view shows

| View | Contents and what you can do there |
| --- | --- |
| Source | Precisely the files this Run uses: the Run itself, the Author Source and imported Sources and Recipes. Choose one and use Edit source; changes save automatically, Cmd/Ctrl+S saves at once. Watch the save/error state. It is not a project file browser. |
| Preview | The chosen Film, computed in the browser from its compiled `HtmlProgram`. The transport and the timeline both play and seek. Clicking a component-declared visual part selects its timeline Item, whose exposed position you can adjust in the Inspector. |
| Timeline | Projected domain evidence, resolved named Instants, and component-projected Track Items with their visible intervals, materials or event lanes. What a rectangle stands for (occupancy, activation, lasting visibility) depends on the component. |
| Inspector | Nothing selected: facts about the project, Canvas, timing and Run. With an Item selected: its declared read-only facts and adjustable fields, arranged in Where, When and How groups when they apply. |
| Tasks | A card for every Build, in ongoing and finished groups. The selected Runtime reports live status and progress; Builds that completed, failed or were cancelled are read from project Results. Each card records its source Run, its times, and why it failed or needs attention, if it did. |
| Artifacts | The image, video and audio files that project Results hold as Outputs, even ones a still-running Build has already published. Filter in the sidebar by all media, videos, images or audio. On a Build card, View media shows just that Build's Outputs; going back to the Artifacts tab shows the whole project again. Structured Outputs (normalized media, NarrativeAlignment and the like) are kept intact and do not spill their internal files into the gallery. Clicking a card shows it in the central preview, with playback and a time slider for video and audio; Back to composition restores the composition position. Previewing a file does not make it a Candidate in the Run. |

Timeline behavior:

- Each declared lane is a single row even when Items overlap. At equal stacking order later Items
  cover earlier ones; selecting an Item brings its full rectangle forward inside its lane. Attached
  child lanes behave the same way.
- Right-click an overlap to pick an Item hidden by its peers. Selection changes the editor only,
  never the Film's paint order.
- The ruler, the mapping and evidence rows from each projection, and the common Instant row are pinned
  together at the top. A work without a domain projection still has the ruler and the Instant row.
- Windows have no row of their own: you see them as the Items of the Tracks that use them, and their
  references remain in the Source that owns them and in declared Inspector fields.

Library behavior (Tasks and Artifacts):

- Opening a tab or pressing Refresh reads the latest state; nothing polls. Refresh replaces the view,
  and scrolling to the end loads more.
- Media categories query matching files across Result pages, so a Build without that media type in
  between needs no extra action. A failed refresh keeps the old view and shows the error.
- Several references to one stored file share a card; its details keep the originating Builds and
  Outputs. Highlighted Outputs come first.
- Names wrap to two lines. Double-click or press F2 to rename; Enter or leaving the field saves,
  Escape cancels. Renaming changes only the Output's displayed name in the finished Result, never its
  reference identifier or the media file.

[Builds](builds.md) is where you check Output names, export media, complete a partial Result, change
how a Result is presented, or choose an earlier Output. Studio and the CLI share one project Result
repository. Without a selected Runtime, finished Results remain readable, and preview works as long as its display
closure needs no unresolved Endpoint work. Live Runtime status and transient Endpoint processing need
the selected environment.

Studio exists to play and edit interactively; it never starts a Build and never sends paid generation.
It is allowed to run deterministic Producers and the specific immediate capabilities a Provider allows for
transient authoring, such as media inspection and normalization. Bring in existing files or produced
Outputs through the Run. If a generation the view needs is still running, keep working on components
and open the composition once the material lands.

Selection and reuse are explained in [Runs](runs.md). To grab the current picture straight from the
session, [Snapshots](snapshots.md) uses with `clipkin snapshot --studio <this-studio-url>`. [Rendering](rendering.md)
offers frame-range Builds when you need the composition as encoded media. Choose whichever view
answers the question in front of you.

## Edits land on the owning Source

Inspector fields and timeline handles write back to real Source endpoints. The value behind a field
is not always on the selected Track's tag; it may sit in a Frame, Style or Grade Recipe that the Track
references. Editing a shared Recipe
changes every consumer; when the design needs independent variation, create and select a separate
authored instance. Lists and records save their full validated value when editing ends; incomplete
required fields stay in the editor with a hint. Check the save status and the resulting preview.

The Inspector's three groups:

- **Where**: position, size, fitting, layout.
- **When**: timing, playback, trims, motion.
- **How**: content, typography, color, effects, audio levels.

Components name their own pages and sections within those groups. Units sit outside the editable
number: a width authored as `78%` keeps its `%` after editing, while a fractional opacity can display as
a percentage and still be written back as a fraction. Dropdowns may show readable names and previews,
but the underlying value is what reaches Source. Color fields accept exact hex values and offer
suggested swatches.

With catalog fonts, the Caption, Typography and Ranking Companions offer a dropdown for the main font
family via the selected Style. It edits the shared font declaration, and the chosen family must offer the
weight and style in use. Local fonts stay bound to their exact files. Project components are free to present
their own font or preset pickers as Companion fields.

Timing edits:

- Named Instants act as timeline locators; Windows are reusable interval values. To change how time is
  constructed, edit their `at`, `from`, `until`, `for` and `end` declarations in Source.
- A temporal relationship is changed where it is declared: in the Timeline declaration or in the
  domain projection's declaration.
- Editing a Clip adjusts its source occurrence; a component's Companion takes care of that component's
  Sources, Uses or events. Dragging a time handle follows the declared inverse of the consumed value
  back to the Source that owns it.
- What changes depends on how the time was authored. With a direct Selection or Moment, the Script
  identity moves. With a quoted expression, its local clock value or offset changes. A duration is
  adjusted independently.
  [Timing and edit behavior](timing.md#choose-what-a-later-edit-changes) has the full forms, affinity
  choices and consequences for shared consumers.
- Moving a marker preserves unrelated prose whitespace. If the spoken tokens and identities are
  unchanged, new marker references can reuse the existing alignment evidence.
  Whether to keep the media, its local domain, the alignment evidence, or just an upstream generated
  file is decided in [Reuse boundaries](authoring.md#reuse-produced-work-explicitly).

When a parameter or timeline edit succeeds, Studio writes the owning Source and compiles the selected
Run again. A
rejected edit leaves the accepted Source and values in place. Renaming a Result Output, by contrast,
updates Result presentation metadata only; it neither changes the composition nor triggers a Build.

Studio also notices Source edits made elsewhere. If a stale edit from the UI collides with a newer
file, read the current Source and reapply the intended change to it rather than overwriting newer work.
Composition edits go back into the ordinary Sources; Studio never creates a second project.

## Give a project component a useful Companion

With a Companion, the relationships a component creates in production become something the user can
see and change: a board's lifetime, a
reveal event, the Style a Cue really uses, a scene's layout choices. The component's Producers still
produce the picture. Generic Track projection is fine when there are no extra authoring concepts; a
component with meaningful child events or controls can publish them directly.

Read [Studio Companions](studio-companions.md) for the details: Items, child lanes, selecting from
the picture, parameter controls, converting units, writing semantic edits back, and activating the
package. Those choices extend the [component design](component-design.md) work already done for the
video.

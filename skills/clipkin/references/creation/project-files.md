# Project files

Open this page when you start a video project, pick one up again, or reorganize it. The directory
layout described here is a convention for working well, not syntax. Clipkin resolves ordinary paths
and gives these folder names no special meaning.

## Establish the project boundary

Begin from what the user is asking for now, and write its intended result into the [Brief](brief.md).
Which work belongs to this commission is decided by the paths the user supplied, the notes of the
production they named, and the references those notes explicitly make.

- **Continue or revise a named production**: carry that production's work forward.
- **New adaptation**: start from the supplied reference and the requested changes, with a target and
  working files of its own.

Once the target is clear, pick a sensible location for the project and tell the user where the work
lives. If the request could reasonably mean two genuinely different productions, ask which one.

Do not assume the shell's current directory is a video project; it may be the Skill or the
executable's installation. Search where the answer to the current question actually lives:

| You need | Look at |
| --- | --- |
| an executable or a prepared local service | `clipkin paths`, package-manager records, the selected Profile, tool locations a Provider documents |
| Surface syntax or reusable behavior | installed vocabulary (`clipkin vocabulary`), the owning package's README, a relevant component example |
| this production's inputs and finished work | the files the user supplied, its notes, Sources, Runs, the project's Result history, and shared assets it explicitly links |

Follow a path outside the project only when something explains why it matters: the user supplied
it, a dependency records it, or a tool's documentation names it. A neighboring project with a
similar name or topic proves no connection. When an expected input is missing, say what is missing,
then either find where it really lives or prepare the new material the commission needs. Discovery
stays useful this way, and the other productions on the machine never quietly become a shared asset
library.

**Judging earlier work you find.** Ask what it contributes: is it a reference, reusable behavior, or
material that genuinely fits the intended person, product, wording and presentation? Learning a
component from an example brings its mechanics into the new work; casting, prompts, assets and
accounts are still decisions for this production. When you propose reuse, explain it next to what
the requested changes still require. Finding a similar finished video tells you something exists; it
does not mean this commission is done. Suggesting that the user accept a different existing video
instead is a conversation to have with them, not a decision to make silently.

### Make the root explicit

Run commands from the video project's root. A minimal `package.json` marks that root and can later
list the project's component dependencies:

```json
{
  "name": "launch-video",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "clipkin": { "project": true }
}
```

The CLI walks upward from the current directory looking for a `package.json` whose
`clipkin.project` is `true`. It never promotes the closest component package, or whatever directory
you happen to be in, into a project. Handing it a Source path or a Runtime path does not switch
projects either. Sources may sit anywhere below the root; file imports and Source imports resolve
relative to the file that declares them.

| Flag | Set it when |
| --- | --- |
| `--project <directory>` | you run from somewhere else and need to name the root that owns Sources, Runtime selection, project packages and Results |
| `--asset-root <directory>` | assets intentionally live outside the project but Source imports should stay in this workspace |
| `--package-root <directory>` | project packages should resolve from a different installation location |

Paths on the command line are relative to the shell's current directory. `--project` chooses the
project but does not rebase the Run, Source or `--runtime` arguments, so give those as full paths
when you are outside the project:

```bash
clipkin paths --project /work/launch-video
clipkin studio --run /work/launch-video/productions/launch/runs/main.slate --project /work/launch-video
```

`clipkin paths` reports the resolved project, its state directory (`.clipkin/`) and where the Runtime
selection came from. Imports and asset references written inside files stay relative to the file
that contains them.

To admit deliberately shared media, for example:

```bash
clipkin check productions/launch/authors/main.reel --asset-root /work/shared-media
```

Pass the same boundary flags to every following command for that work. An ordinary project relies on
its own installed packages. The embedded Core is supplied by whichever Distribution is selected, and the default
packages a product selects are ordinary dependencies installed with it. Packages distributed
separately, `@clipkin/*` ones included, stay ordinary project dependencies.
[Distribution](../environment/distribution.md) covers finding the executable, and
[component vocabulary](../production/vocabulary.md#let-ordinary-package-management-own-distribution)
covers installing project packages.

## Separate what the reference does from what the target will do

A reference archive describes what an existing piece does. A production describes what the new piece
should do, and holds the files that make it. The relationship is many-to-many: one reference can
feed several productions, and one production can draw on several references. Plain relative links
express those connections; no central project index is needed.

```text
project/
├── references/
│   └── <reference>/
│       ├── source.*
│       ├── ANALYSIS.md
│       ├── TIMELINE.md
│       ├── transcript.json
│       ├── evidence/
│       ├── PROGRESS.md          # only while the reading is still under way
│       └── drafts/              # optional observation experiments
├── productions/
│   └── <target>/
│       ├── BRIEF.md
│       ├── TREATMENT.md
│       ├── PROGRESS.md
│       ├── authors/
│       ├── recipes/
│       ├── runs/
│       ├── assets/
│       └── drafts/
├── assets/                      # inputs shared by several targets
├── packages/                    # project Author Packages shared by targets
├── clipkin.runtime.json
└── package.json
```

One target can have several Author Sources, Recipe Sources and Runs. Running the same Run again
produces another Build, not another target. Keep everything for one target in its own folder, so the
filesystem shows how the files relate instead of leaving it to be guessed from similar names.

For instance, a single reference that has been studied once can serve two different targets without
being duplicated:

```text
references/viral-ad/
productions/brand-cut/
productions/teaser-cut/
```

Both productions point at `../../references/viral-ad/` from their Brief or Treatment, while each
holds Sources and Runs of its own.

Project discovery follows the rule above, so Source and Run files can live in any subdirectory of
the project. Shared assets and packages can stay at the root; assets belonging to one target stay
with that target. If a reference file is also deliberately used in the new film, reference it where
it is; its role as evidence does not call for a second copy.

## Give each document one job

| File or folder | Its single job |
| --- | --- |
| `ANALYSIS.md` | Your present reading of a reference as a whole: its form and story, the systems that recur, how they relate, what they are for, and what makes it cohere. |
| `TIMELINE.md` | What happens when, tied to what it does for the viewer. Record the content, placement, entry, changes, persistence and exit of each visual system, what words or actions it answers, source times and evidence paths. Simultaneous picture, speech, Caption, Typography, MG, Effect and Audio behavior belong in one connected account. These notes describe the reference; the target's real placements belong to the `time:Timeline` declaration in Source. |
| `transcript.json` | Word-level speech evidence. It is evidence, not your interpretation. |
| `evidence/` | Only media worth reopening, under plain descriptive names. |
| `BRIEF.md` | What the user is after, the facts and limits they set, the changes they asked for, and the [agreed paid scope](brief.md#brief-preserves-user-authority). |
| `TREATMENT.md` | Your current answer to the Brief: the new piece in full creative terms, before implementation detail. |
| `authors/`, `recipes/`, `runs/` | The exact implementation of the production. |
| `PROGRESS.md` | A brief snapshot of now (see below). |

`PROGRESS.md` holds the live question, what is left to examine or make, the next useful action, real
blockers, active Build ids and reusable Results. When cost matters to the agreed budget, keep the
cost picture for the remaining work here. For a handoff, include the relevant Run and Runtime
Profile, the exact Build id and the public Output names someone needs to continue. The actual reuse
choices belong to Run Candidates; Progress only points at them. Anything already settled belongs in
its owning document, not here.

These files are rewritten whenever the current truth changes; they are not logs. A `PROGRESS.md` can
sit beside a reference or beside a production, because either kind of work may span several
conversations. It does not mark a phase, and it can be deleted when there is nothing left worth
handing over.

**The files are the working memory.** Write discoveries and decisions into the document that owns
them while the work is happening, keeping both the explanation and the concrete details. Let a
provisional account grow as understanding grows; store detailed evidence once and link to it from
elsewhere. In conversation, share what a discovery means; the files keep the full account. To
resume, read the current project files and the relevant Skill pages, use Progress to find the next
question, and continue from the saved evidence, Sources, Runs or Results. Whenever something new is
learned, revise the account it affects; the next session then inherits the better picture.

## Drafts and Results are different things

`drafts/` is for authoring material the current Source does not include: trial copy, provisional
designs, or media you deliberately exported to keep working on. A Build's output stays in that
Build's Result even if a later Run never uses it. Not being referenced already records that it was
not adopted; there is no need to copy it into `drafts/`.

When you deliberately export an output into the project, file it by its new purpose: it might
become an `asset`, a `draft`, or a direct input to another production.

## Hand over an editable production

An MP4 lets someone watch the piece. To keep making it, they also need the authored work and the
produced values that its Runs select:

- the Sources, Recipes, Runs, project notes and referenced input assets, in their relative layout;
- project component source or released dependencies, `package.json`, its lockfile, and any tarballs
  that `file:` dependencies point at;
- every completed Result that a `build-record` Candidate uses, with its media and the value
  documents of its Composites;
- the Runtime configuration you intend them to use, with account access set up on the receiving machine through
  that machine's own Credential Store.

With the default filesystem repository, the simple handoff is to keep `.clipkin/results/` intact
inside the project. Include the hidden directory and keep its bucket and Build subdirectories as they
are. Some Results forward an Output to the Build that originally produced it, so copying only the most
recent Build directory can leave out media that is still in use. If completed Results should live
outside the project, archive or migrate them explicitly.

Files outside the project stay live dependencies, including when a structured Output refers to them;
the Node workspace stores their resolved addresses. When moving to another machine, supply those
inputs and update the references to their new locations. Copying Result directories alone does not
gather external files, whereas an explicit `clipkin get` export does collect the referenced bytes of
the Output it exports.

On the receiving side: install the selected Distribution and the project dependencies, configure a
Runtime, and inspect the Results that arrived. Running `clipkin plan` on the intended Run reveals
whether its selected reuse still resolves and which requests are still to be made. A Build that is still executing
stays with the Runtime that started it until that attempt ends; an editable handoff carries the
authored work and the Results it needs, not another Runtime's execution state.

Use `clipkin get` when the handoff is about one particular output:

```bash
clipkin get <build-id> --output <name> --to <path>
```

An exported image, video or audio file can later be selected as a `<file>` Candidate. A Composite
export is a directory with `value.json` plus the resource files it references, meant for inspection
and transport. That document is in the Result value format, while a Run `<value>` element expects a
StoredValue wrapper, so the two are not interchangeable. If you need to keep structured normalized
media, a local domain or alignment for reuse, keep its Result available and select every Output you
need with `build-record`. [Builds and Results](../production/builds.md) covers Result reuse and
export.

## Resume from present facts

After an interruption or context compaction, reread the current Brief, Treatment, reference archive,
Source, Recipe, Run and whichever short `PROGRESS.md` applies. Then check the project's actual Build
Results and the Runtime status. Continue from the usable outputs that already exist. Losing the
conversation's context is never a reason to pay for the same work again.

An interrupted command or a reply that never arrived can leave the Worker still running.
[Builds](../production/builds.md) explains how to find active work and how to continue through a new
Run after an attempt fails. Completed Outputs remain in their Results even though nobody exported
them as files. When you revise downstream work, keep or add Run Candidates for them; neither the
notes nor an unchanged output name selects them for you.

## Keep review notes with the work

Studio stores timestamped comments for the workspace's Runs in `FEEDBACK.json`, which belongs to the
workspace. [Working from Comments](../production/studio.md#revise-from-timestamped-comments) covers
reading, resolving and keeping these shared notes. Move settled creative decisions into the Treatment
and execution status into Progress; leave the comments as the record of the review conversation.

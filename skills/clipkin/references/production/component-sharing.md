# Component sharing

Use this page when a project component, Prompt Kit, Model or Provider needs to reach another project
or another person.

Making a component and distributing it are different questions. You make the component because the
work needs its visual role, semantic behavior or interaction. Distribution starts only when its owner
wants someone else, or another project, to use the same package. Crossing that boundary changes
nothing about the component model or who owns it.

## Share the package that already owns the component

A component usually starts life under the video project's `packages/` directory with an owner-scoped
name such as `@studio/score-strip`. Sharing it means handing over that package's code, assets and
usage instructions. Neither the author nor the recipient needs a checkout of the Clipkin repository.

Keep the name when you distribute it. Source imports the package's logical Module ABI:

```xml
<import as="score" from="@studio/score-strip@1"/>
```

The `@1` is the logical Module ABI that Source depends on. The package manager separately tracks the
physical npm release, for instance `1.2.0`. Moving to a newer release does not, on its own, change the
logical import. Author against the vocabulary the package actually publishes.

## Publish to a registry for repeated reuse

When the owner decides to distribute for stable cross-project reuse, publish a versioned package
under the owner's npm scope or a private registry. A public scoped package is published with:

```bash
npm publish --access public
```

Recipients install an exact release with whatever package manager they use:

```bash
npm install --save-exact @studio/score-strip@1.2.0
# or
pnpm add --save-exact @studio/score-strip@1.2.0
```

What this implies for the consumer project:

- The lockfile records the installed dependency tree. Updating is an explicit package-manager
  operation, and Builds run whatever code is installed.
- A missing package is an installation problem, not a Build problem.
- To adopt a new release: select it in the consumer project, read its changed vocabulary where it
  matters, check the actual Source and Run, and review the changed behavior.
- New Builds load the selected implementation. A running Studio session must be restarted to pick up
  package-code changes.
- Keep compatible media through Run Candidates while recomputing the revised component.
- Required author-side changes come from the package's own release notes. No Build upgrades or
  migrates anything automatically.

## Hand someone a tarball

For a deliberate person-to-person handoff, or to rehearse packaging, compile first and then run
`npm pack` inside the package folder. TypeScript must be built to JavaScript before packing; a JavaScript package may already be
executable. A `prepack` script can run the build for you:

```bash
cd packages/score-strip
npm pack
```

For `@studio/score-strip` at version `1.2.0`, npm writes `studio-score-strip-1.2.0.tgz`; send that
file. No registry account or publication is involved. The recipient can store it in the video
project's `vendor/` directory and install it from the project:

```bash
npm install ./vendor/studio-score-strip-1.2.0.tgz
```

As long as the dependency points at that file, keep the tarball in the project alongside
`package.json` and the lockfile. Source imports choose the author contributions; Runtime Profile
entries choose Provider contributions. Each later release gets a higher version number and its own
tarball, which the recipient installs by path again.

## Make a public release findable

People discover public components through the npm page, the source repository or a community link.
Ordinary package metadata makes those places useful. For example, add fields like these to the
package that owns the component:

```json
{
  "description": "A speech-timed score strip for Clipkin videos.",
  "keywords": ["clipkin", "clipkin-author-package", "scoreboard"],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/studio/score-strip.git"
  },
  "license": "MIT"
}
```

Description and keywords help npm search; they have nothing to do with the component ABI. The README
should show:

- the visual role, with the Surface poster and, if motion or state is the point, a short clip;
- a copyable Source import and element example;
- the public outputs;
- the Clipkin release it was checked against.

Repository, publisher, license and release are what a recipient needs to decide whether to install it.

Once installed, read the package's own declarations:

```bash
clipkin vocabulary @studio/score-strip
```

That lists the installed release's Surfaces and vocabulary. npm or the chosen private registry is the
authority for package bytes and versions; the consumer's lockfile records which one they picked.

## Forking under a new owner

Everyday changes to wording, media, timing, palette or exposed parameters are made in the Source
and Recipes of the project using the component. When someone alters the reusable mechanics or the public behavior,
the fork can move to that person's package scope and Module identity, within the original license.
The fork is then installed, versioned and imported exactly like any other shared component.

## Ship everything the recipient needs

Checklist for the published package:

- `files` and `exports` include the built activation, runtime code, preview assets, and any Sources or
  templates its vocabulary exposes.
- `clipkin.activation` in `package.json` points at the shipped JavaScript entry.
- Third-party runtime libraries are listed in `dependencies`.
- The README includes a working Source example, lists the public outputs and any Companion or asset
  prerequisites, and names the Clipkin release it was tested with.
- `npm pack --dry-run` shows the tarball contents; inspect them.

Dependencies of an executable Author Package:

| Package | Declare it as |
| --- | --- |
| `@clipkin/clipkin` (imported through narrow subpaths: `/author`, `/producer`, `/admission`, `/markup`) | A compatible peer dependency, plus a development dependency |
| Domain packages, for example `@clipkin/composition`, `@clipkin/caption` | Ordinary `dependencies` |
| `@clipkin/studio-companion` (only with a Studio Companion) | A peer dependency |

Import only the public entry points you actually use. The release contains its own code and assets; the host that loads it supplies the framework APIs.
Test from a separate consumer project so local source links cannot hide missing files or
dependencies.

Package code executes in the host process with full trust, so choosing a package and a release is the
recipient's call.

## Data packages remain data

Not every shareable package carries code. A Prompt Kit, for example, publishes an `.grade` Source via
plain package `exports` and has no activation entry:

```xml
<import as="ugc" source="@studio/image-kits/phone-ugc-v1"/>
```

That import reads the selected package's data. Packing, installation, versioning and the
completeness checklist above apply unchanged. To move a whole video (Sources, Runs, assets and
Results) to another machine, see
[Project handoff](../creation/project-files.md#hand-over-an-editable-production).

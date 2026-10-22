# Installations, updates and reuse

Come here to locate the `clipkin` executable a production can already use, to install one that is
missing, to update the installation the work actually runs on, or to carry a production forward
without throwing away its tools and material. Neighbouring pages own the rest of the environment:
[model services](model-and-provider.md) decide which accounts and models are reachable, the
[Runtime Profile](profile.md) decides what executes where, and [local tools](local-tools.md) covers
preparing whatever that Profile selected.

Jump straight to [finding the executable](#find-the-installation-already-available),
[installing it](#install-the-executable-package), [reusing existing work](#reuse-what-already-serves-the-production)
or [updates](#let-the-installation-channel-own-updates).

## Three parts, three update channels

| Part | What it gives you | Who changes it |
| --- | --- | --- |
| The Clipkin Skill (`skills/clipkin` in the Clipkin repository) | Directing and production judgment, and the map of these references | The tool that installed the Skill |
| The Clipkin Distribution, package `@clipkin/clipkin` | The `clipkin` CLI, the embedded engine, Studio, and the Providers and components it ships | The checkout, release artifact or package registry it came from |
| The video project | Sources, Runs, assets, project packages, its selected Profile and its Results | The project's own files and lockfile |

Each part is independent. Installing the Skill puts no executable on the machine; installing the
executable connects no model account and buys no generation credit; updating either one leaves a
project's Sources untouched and regenerates nothing.

Work from the environment the Agent really has: which files it can read, which commands it can run,
which services it can reach, and how it can hand media or a preview back to the user. On a remote
host, processes, files and `localhost` addresses all live on that host, so use its preview forwarding
and its persistent storage. Being able to read Clipkin's source is not a reason to work from a
contributor checkout; ordinary production uses the installed public interfaces.

## Find the installation already available

From the project directory, ask the executable about itself first:

```bash
clipkin version
clipkin paths
clipkin --help
```

`version` names the running Distribution, its version and the launcher path, and it opens neither a
project nor a Runtime. `paths` lists the project, its `.clipkin` state directory, the selected Runtime
Profile and selection file, the Runtime data directory, the machine's Host state and the
Distribution root. "Runtime Profile: not selected" is a configuration fact for
[the Profile page](profile.md#create-a-profile-when-the-project-needs-one); it never means Clipkin has
to be reinstalled.

When the shell cannot find `clipkin`, look for an installation that is simply not on `PATH`:

- **A Distribution directory** (a release unpacked by hand, or a contributor's checkout). Its root
  holds `bin/clipkin.mjs`: run `node /path/to/clipkin/bin/clipkin.mjs version`. If it says
  dependencies are missing, run `npm install` (a checkout: `pnpm install --frozen-lockfile`) there first.
- **A package installation.** Inspect the package manager's records:

  ```bash
  npm ls @clipkin/clipkin --depth=0
  npm ls --global @clipkin/clipkin --depth=0
  npm prefix --global
  ```

  A project-local installation runs as `npm exec --no -- clipkin version`; `--no` stops npm from
  offering to fetch a missing package. A global installation's executables sit in `<prefix>/bin` on
  POSIX systems and directly in the prefix on Windows.

A global command, a project-local package and a Distribution directory can each be a different release.
Decide which one the production will use, confirm it with `version`, and write the working command
and its location into the project notes so the next session does not have to search again.

## Install the executable package

The Distribution is built from the Clipkin repository. Choose the channel the user or organization
already uses; do not mix two of them for the same production.

**From the Clipkin release repository** (the common case). It needs Node.js 22.15 or newer and npm,
FFmpeg on `PATH`, and on Linux `unzip` (the managed render browser arrives as a zip archive):

```bash
npm install --global github:clipkin-ai/clipkin
clipkin version
```

That installs the latest release machine-wide; `github:clipkin-ai/clipkin#v1.0.1` installs an exact
release, and each [release](https://github.com/clipkin-ai/clipkin/releases) also carries the same
package as a `.tgz` that `npm install --global <file or URL>` accepts. The repository holds the
compiled tool, Studio and this Skill; Clipkin's source is not public.

**From an internal registry.** Where an organization hosts `@clipkin/clipkin` in its own registry,
install it machine-wide with `npm install --global @clipkin/clipkin`, or keep it in one project with
`npm install --save-dev @clipkin/clipkin` and run it through `npm exec --no -- clipkin`. The public npm
registry does not carry the package, so do not treat its absence there as a broken installation.

Honour any version the user or project has pinned; the project's manifest and lockfile decide its
physical versions. If a download is slow or a mirror lacks the requested version, keep that version
and fix the route instead —
[network preparation](local-tools.md#make-network-preparation-practical) explains how to match the
remedy to the transfer that is actually failing. After installing, run `clipkin version` through the
launcher the work will use, then go on to the capability the work needs next.

## Reuse what already serves the production

| Already in place | How to carry it forward |
| --- | --- |
| A working executable | Use it across projects; identify the active launcher before adding a second installation |
| A chosen service with a stored credential | Keep its Endpoint, credential reference and bindings in the Profile, within the account choice the user made |
| Prepared local tools, browsers or model weights | Read the selected Provider's configured paths and reuse compatible resources there |
| Project components and their dependencies | Keep their package versions and lockfile; edit the project's own code only where it has to change |
| Outputs already generated or processed | Select them as Run Candidates so the next Build does not pay for them again |

Host tools and prepared resources live at machine scope (`clipkin paths` shows the Host state). A new
video project does not need its own copy of a Python environment or a browser. A cache can shorten
preparation, but it never chooses a different model, language, account or browser for you.

To reuse components across projects, follow [component sharing](../production/component-sharing.md):
either keep a component inside its project, or install the owner's versioned package where sharing is
genuinely needed. That package's version lives in the ordinary manifest and lockfile, and it changes
only when someone updates that dependency on purpose; a Clipkin or Skill update does not touch it.

During any update, keep the project's assets, Results and current Run selections. A newer executable
is no reason to regenerate accepted material; [Output reuse](../production/authoring.md#reuse-produced-work-explicitly)
explains how to choose produced values that stay compatible, including Outputs from failed Builds.
If a release changes what authoring requires, make the matching project change deliberately from the
documented meaning, instead of guessing at a migration or quietly switching to another capability.

## Let the installation channel own updates

Look at versions only when it matters to the work: a fix the user heard about, a missing option or
capability, an explicit update request, or a release that changes behaviour. Otherwise keep producing
on the versions already selected; a Build never upgrades anything.

```bash
clipkin version --check
```

This read-only query asks an npm registry for the latest release and reports where the answer came
from. `--registry <url>` points it at a different registry or mirror and `--json` gives a structured
view; plain `clipkin version` and `clipkin --version` never touch the network. Against the public npm
registry the answer is currently "unknown" (the registry returns 404 for `@clipkin/clipkin`), so treat
that result as "no registry information", not as "up to date". The command also prints the
[release notes](https://github.com/clipkin-ai/clipkin/releases) location; read the relevant notes there.

For an installation from the release repository, its releases page is the source of truth: compare
the latest release there with `clipkin version`. Whatever the channel, a different version can mean a newer local build or a stale mirror; explain which
installation would change and which behaviour the user would notice.

## Check and update the relevant installation

Update only the installation the production uses, and only to the target the user chose (the latest
release, or an exact pinned one).

| Installed from | Update | Then |
| --- | --- | --- |
| The release repository | `npm install --global github:clipkin-ai/clipkin` (or `…#v<version>`) | `clipkin version` |
| A release archive | Install the new archive with the same scope you used before | `clipkin version` |
| An internal registry, global | `npm install --global @clipkin/clipkin@<version>` | `clipkin version` |
| An internal registry, project-local | `npm install --save-dev @clipkin/clipkin@<version>` in the project | `npm exec --no -- clipkin version` |

These rows are alternatives, not a sequence. Keep the existing dependency kind and package-manager
workflow, and do not overwrite local edits in a Distribution directory without asking. Recheck the launcher the
production will run.

**The Skill updates on its own channel.** It is installed from this repository's `skills/clipkin`
directory. With the [skills CLI](https://github.com/vercel-labs/skills#skills-update):

```bash
npx skills add clipkin-ai/clipkin -g     # first installation, global scope
npx skills list -g                  # what is installed, and where
npx skills update clipkin -g         # update only the Clipkin Skill
```

A project-scoped installation uses the installer's project scope instead (`-p` on `update`, run from
that project). A Skill linked or copied from a checkout's `skills/clipkin` follows that checkout, so
pulling the checkout updates it. Updating is a mutation, not a check: preserve intentional local
Skill edits first, and never update unrelated skills as a side effect. Afterwards, read the
instructions from the installation the Agent actually loads; text already read into the current
conversation may still be the old version.

The installed packages' READMEs and `clipkin vocabulary` describe what the installed release really
offers. If a newer Skill mentions an option the executable does not have, inspect that release, then
explain the gap and the useful update or chosen alternative. Never act as if the option exists.

## Project changes and execution code

Changes to project components or the Profile reach the next Build through its fresh execution
context. Updating the Distribution, or the environment an already running Worker inherited, concerns
that Worker process's lifetime instead: read [when changes take effect](profile.md#know-when-a-change-takes-effect)
before restarting it, and protect active work and accepted Outputs.

Each package's code dependencies come from its own manifest and lockfile and are installed by the
package manager that installed the package, whether that is the Distribution or the project. Runtime
preparation (`clipkin programs prepare`, `clipkin runtime up`) handles only the Programs and runtime
materials that Providers declare; it is not a second way of installing npm packages.

Working in a contributor checkout of the engine's source is a separate development choice that the
user makes explicitly. Productions, project components and project Model or Provider packages all
build on the installed public interfaces.

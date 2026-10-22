# Planning, Builds and Results

Come here to see what a Run will do, to price it and agree the spend, to submit a Build, to recover
from a failed attempt, to reconnect after an observer drops, or to pull completed Outputs out of
Results. [Runs](runs.md) owns Candidate syntax and substitutes, [System relationships](system.md)
explains how a selected graph becomes a Build, and [Rendering](rendering.md) covers full and partial
video Outputs.

## Before anything else: reuse, and find what is already running

For a revision, locate the Run in question and its completed Outputs, then keep the useful ones with
`build-record` and `satisfy`, leaving unrelated selections untouched.
Which media, domain or alignment Output to hold on to — while still letting your edit through — is
explained in [Authoring](authoring.md#reuse-produced-work-explicitly). A failed Build can still supply
completed Outputs, and a file missing from your export folders proves nothing about the media.

If the CLI or an observing tool lost its reply while submitting or following a Build, do not assume
nothing happened — the Worker may already be executing it. Check:

```bash
clipkin activity
clipkin status <build-id>
clipkin builds
clipkin inspect <build-id>
```

- `activity`, `status` and `cancel` talk to a Runtime. Use the original project and the Runtime
  Profile that received the Build; add `--runtime <profile>` if that is not the project's selected Profile.
- `builds` and `inspect` read the project's own Results and need no Runtime.
- No Build id returned? Identify the submission from project activity and Results by its Run, Source
  and submission time.

Follow live work with `status <build-id> --watch` and reuse whatever has completed. Keep two
situations apart: a closed terminal or interrupted observation is not a failed Provider request inside
the Build. Completing an unfinished Result (below) never requires regenerating media.

Follow-up commands the CLI prints already carry the right project and Runtime; keep that scope when you
adapt them. With `--json`, watching still writes coalesced progress to stderr while stdout carries the
final JSON, so read both channels if your terminal tool exposes them. Turn what is reported — the
work in progress, any real uncertainty, the useful next step — into a short update for the user. The
Runtime owns execution: neither your update nor a detached observer pauses it.

When a stage is slow or has failed, read its retained evidence:

```bash
clipkin logs <build-id> --lines 80
```

This shows Provider diagnostics and execution phases, for active work or from the finished Result
(the default is the last 50 records). Once a Build has finished, its log is read from the project's
Results, so no Runtime is needed.
For Worker start-up or process failures, use `clipkin runtime logs` instead. Start with a modest tail
and widen it when the cause needs more context; closing a terminal never erases a Build's log.

## Continue after a failed attempt

Whatever the attempt managed to produce, and the evidence of what went wrong, stays in its Result.
Recovery means a fresh Run that picks up the good Outputs with `build-record` plus `satisfy`, and a
fresh Build that does only what is left. Choices
for the next attempt live in that new Run; the old Build keeps its failure on record.

**Submission timed out with no receipt.** If a Provider task-submission request timed out without a
task ID or any other usable receipt, the Result can show that the request failed and that no receipt
exists — but what happened remotely stays unknown. Resubmitting is a new Build. Check the paid requests it
would make against the [agreed scope and cost](#work-within-the-agreed-paid-scope), and have its Run
select whatever the previous attempt did manage to produce.

**A usable receipt exists.** If the receipt gives access to the generated asset, you may fetch that
asset as an ordinary project file and select it in the new Run with `file` and `satisfy`. That supplies
the file Output only; downstream preparation and alignment still run as needed. Alternatively, reuse
completed normalized media, local-domain and alignment Outputs independently from the existing Result.

Where to find the details:

- `clipkin status <build-id> --verbose` lists individual operations with Endpoints, task IDs and progress.
- `clipkin inspect <build-id> --verbose --json` returns the Result's full retained execution records,
  including any credential references and receipts. Raise `--limit` if the report says records were omitted.
- Secret values never leave their Credential Store. `--json` only changes the encoding; `--verbose`
  is what asks for the extra detail.

## Plan the selected Run

`clipkin plan` examines what an authored Run would execute. The creative direction you share with the
user comes earlier, from their request and the reference evidence, and needs no Run, no prepared
environment and no plan. Reach for `plan` once there is concrete execution to look at.

Plan the real Run after its reuse choices and requested changes are written:

```bash
clipkin check path/to/build.slate
clipkin plan path/to/build.slate
```

`check` validates the self-described Sources and graph without running anything. `plan` first applies
the Run's Candidate choices, then fixes the part of the graph the Targets demand and enumerates each
external request it would send. Planning never starts external work.

Reading the plan:

- The default report is enough to follow the remaining work. `--json` changes encoding; `--verbose`
  adds Run choices, the graph step count and unreached declarations, with `--limit` bounding that
  detail while every demanded request and diagnostic stays visible.
- The number of Run choices is not the number of new requests or generated assets. A Candidate may
  supply an existing value or swap in a different Producer. Read the demanded requests to know what
  will execute, and `pricing` to see which of them may cost money.
- "input created while the Build runs" means that input is made by an earlier step of the same Build and is
  still symbolic; "no summary available for this request" means the summary could not be read, not that the request is empty.

Give `plan` a Runtime Profile (selected, or via `--runtime`) and it goes further: it tells you which
Endpoint would serve every request, checks the request against what that Endpoint supports, runs
inexpensive readiness probes for only the capabilities in demand, and points to the price page the
Provider declares — or says no price source is known. It stays local and needs no billing account.

### Price the same requests

```bash
clipkin pricing path/to/build.slate
```

`pricing` is an explicit, read-only network operation that needs a Runtime Profile. It creates no
Build and submits no generation. Its report has two parts.

**Per request: the Provider's quote.** Requests are grouped by capability, selected Endpoint and
identical pricing material, with shared parameters shown once and request counts kept. For each group
the report shows the price source URL and the Provider's machine-readable quote, in one of three forms:

| Quote | Shown as | Meaning |
| --- | --- | --- |
| Exact | `$0.42` | Every quantity is known from the request and the published rates. |
| Estimate | `≈ $0.30–$0.60` plus `assumes …` lines | At least one quantity is assumed; the assumptions are stated and the range is honest. |
| Not yet measurable | `≥ $0.10 (not yet measurable)` | The charge depends on media produced during this Build (for example the length of audio not yet generated); the amount is only a floor. |

Each quote lists its priced lines (`item: quantity unit × unit price`) and ends with
`rates as of <date> (<vendor>)`. Requests whose Endpoint declares local pricing are summarized as a
no-charge count (`--verbose` lists them). A Provider without machine-readable rates falls back to its
price page or rate summary, a group may say `No price available`, and a failed price read is reported as
such — all of these stay visible as uncertainty rather than disappearing.

**For the whole Run: the Run estimate.** After the groups comes a block like this:

```text
Estimated cost of this Run
  Upstream cost      $1.20–$1.80 (approximate)
  Price to customer  $1.80–$2.70 · 180–270 credits
  Held               311 credits set aside before the Build starts
  Requests           3 with a price · 4 local · 1 without a price yet
```

- **Upstream cost** is what the model vendors charge, in USD. It is marked `(approximate)` when any quote
  is an estimate and `(incomplete)` when some request cannot be measured yet.
- **Price to customer** is what the user pays, in USD and in credits.
- **Held** is the number of credits that will be set aside before the Build starts. It is sized from
  the high end of the estimate plus a safety margin, so the Build cannot overspend it.
- **Requests** counts requests with a price, local ones and those without a price yet; each request
  without a price is then listed with its reason (no machine-readable rates, or not measurable before the Build).

`--json` (format `clipkin.cli-pricing@1`) carries the same facts: each group's `requests` beside its
`pricingDocuments` (whose `data` holds the Provider's original quote, format `clipkin.rate-quote@1`),
plus an `estimate` object of format `clipkin.run-estimate@1` with `basis` (`exact`, `estimate` or
`unknown`), `vendorLowMicros`/`vendorHighMicros`, `customerLowMicros`/`customerHighMicros` (micros are
millionths of a US dollar), `creditsLow`/`creditsHigh`, `holdCredits` and the `unpriced` list. All
groups are always in the JSON; `--limit <count>` shortens only the human view, and `--verbose` adds the
original documents and the no-charge requests. If a Producer fails during planning, `pricing` still
reports the rates it could read and exits with code 1.

When some requests are not yet measurable, complete the picture yourself: use the stated per-unit
rate with an explicitly estimated quantity from the production plan (say, the expected seconds of a
voice line), and keep that estimate labeled as yours, separate from measured figures. Then tell the
user what this work should cost, which account would be billed, and where real uncertainty remains.

**Actual charges are metered, not estimated.** After each request completes, its Provider records
what it actually cost, priced from the final request and any usage the vendor returned, in the
Build's log. `clipkin usage <build-id>` totals those metered charges (vendor cost, customer price and
credits, one line per charge) and says when the Build is still running and the totals are partial.

### Read the remaining requests against the change

After a Caption or motion-graphics edit, no media generation should be left unsatisfied; after
swapping some B-roll, the untouched performance should still be covered. Rendering and other
necessary processing can legitimately remain. Every new media request needs a reason — the user's goal
or a deliberate decision to generate. If one shows up because a Candidate was lost or never selected, fix the Run and plan again
before asking to spend or submitting anything.

## Work within the agreed paid scope

Spending authority is an agreement about a described piece of work: which billing accounts pay, and
what cost or budget the user accepts. Lay out those terms before you ask, using the pricing report
and the work's expected usage. Give the estimate at the precision the current plan supports — the
customer price in credits, the hold that will be reserved, and which parts are still estimates or
not yet measurable. Having account access or quota only says what can run; the user's agreement says
what you may spend to run it.

The commission can cover a whole production — reference transcription, generated media, semantic
alignment — or only the reference analysis, before the user decides whether to commission the video.
Early hosted transcription fits either scope. Agree its coverage before invoking `clipkin transcribe`,
which sends one immediate request to the Endpoint the Runtime Profile selects (no Build or Result is
created). For that reference, its duration and the Provider's published rates support the estimate; no
production Run needs to exist yet. Local WhisperX makes no hosted Provider call and so carries no
Provider charge. As the creative plan firms up, `plan` and `pricing` expose the exact remaining
requests for the Run.

Carry covered work forward and keep the user informed. One agreement can span many tool calls and
Builds; a new command is not a new authorization request. Go back to the user when the work would outgrow the
agreed scope or cost, or when it would bill an account the agreement does not include. Judge what remains
from the current plan and pricing, the available Results, and the charges already incurred or
committed (`clipkin usage` gives metered actuals). Present estimates as estimates wherever actual
charges are not yet available.

Record the agreement in [Brief](../creation/brief.md#brief-preserves-user-authority) and pick it up again,
alongside the current Run, Results and Progress, whenever work resumes. Ordinary composition work keeps
using the generated media that serves it. Being asked to revise Caption or motion graphics authorizes that revision; additional
media generation needs a deliberate production choice that the paid scope covers. Explain a
meaningful change and carry on when it is already covered; ask the user when it changes what they
agreed to fund.

## Submit one durable Build

One command submits:

```bash
clipkin build path/to/build.slate --title first-cut --follow
```

Each call mints a new Build id, ordered by time, with a Result of its own — whether or not the Run
changed. Reusing anything across Builds requires explicit Run Candidates; repeating a command neither
resumes an earlier Build nor picks up its Outputs. `--title` is only a human label on the Result; it
does not replace the Build id or touch Source identity.

`build` first does a quick preflight and sends the Build only if the part of the deployment it needs
is ready. It installs no packages and starts no missing Managed Program. If the environment is
prepared and only the Worker is stopped, `build` brings the Worker up. If something was never
prepared, run `clipkin programs prepare --endpoint <instance>` for the Endpoint in question, and use
`clipkin programs up` when its helper also has to start.
[Local preparation](../environment/local-tools.md#let-the-selected-endpoint-own-its-program) explains
their scope and the combined `clipkin runtime up`. Submit again once preparation succeeds.

Once durably submitted, the Build belongs to the Worker. `--follow` merely watches: if that terminal
closes or is interrupted, only the watching stops, and the Build carries on. To watch again:

```bash
clipkin status <build-id> --watch
```

Plain `status` reads one current snapshot. `--max-wait-ms` limits how long you watch (on `build`, it
bounds start-up or follow waiting); it never limits or cancels the Build.

## Observe shared work and capacity

```bash
clipkin activity
clipkin runtime status
```

`activity` lists active Builds; `activity --verbose` adds shared Provider capacity and individual
operations. The Worker can advance many unrelated Builds at once. Capacity belongs to exact Endpoint
instances, genuinely shared pools and any narrower model limits those Endpoints declare, so Builds
compete only for the resources they really share.

- Immediate work frees its capacity as soon as it returns.
- An asynchronous Provider operation holds its claim while that same accepted operation is polled to completion.
- If the execution process is lost, the attempt ends with any remote receipts preserved; the paid
  request is not resubmitted.
- A failing action ends the attempt and frees its local reservations. A last-seen remote
  status stays as evidence; the old Build does not have to resolve it before you try again.

When capacity explains a wait, `activity --verbose --json` exposes the actual resource claims. Task
occupancy, overlapping network actions and starts allowed per time window are three different
quantities. Configure and select them in the [Runtime profile](../environment/profile.md); the
chosen Provider's own documentation lists which of these settings it supports.

## Activity versus outcome

Runtime activity says what is happening now. A finished Result records exactly one outcome:
`complete`, `failed` or `cancelled`. These are separate facts, and `status` reads both — so it can
show, for instance, an outcome already settled as failed while finished Outputs are still being saved.

A failed or cancelled Build can still hold useful public Outputs completed before its outcome; inspect
them as usual. Cancelling withdraws work that has not started and asks an Endpoint, once, to cancel an
operation already submitted when the Endpoint supports that. Completed output that was accepted is kept.

If storing the Result or cleaning up fails after the outcome was decided, `status` reports that an
operator must act and names the exact action:

```bash
clipkin result finish <build-id>
```

That command writes the Result from execution facts and working Resources that were already accepted.
It invokes no Producer, resubmits no generation and picks no other Candidate. Use it only for the
Result write `status` names. `clipkin result discard <build-id>` is reserved for a submission that
never got going and therefore has no Result to complete.

When the user wants submitted work stopped, cancel that exact Build:

```bash
clipkin cancel <build-id> --reason "superseded by the corrected Run"
```

Check the reported state afterwards. Detaching an observer sends no cancellation, and a cancellation
cannot undo Provider work that has already completed. Keep completed usable Outputs and leave
unrelated Builds alone.

`clipkin runtime down` stops that Runtime's coordinator and its execution processes. An unfinished
Build that loses its execution context ends that attempt, and restarting the Worker does not resume
it; whatever completed, and any receipts on record, can be selected in a later Build. Stopping the
Worker does not cancel remote Provider work — use `cancel` on the Build while its execution context
still exists.

## Browse and export project Results

```bash
clipkin builds
clipkin inspect <build-id>
clipkin history <public-output-name>
clipkin get <build-id> --output <public-output-name> --to <destination>
```

| Command | Does |
| --- | --- |
| `builds` | Lists finished project Results, newest first (`--limit`, `--before <build-id>` to page). |
| `inspect` | Shows one Result's Targets, highlighted Outputs and outcome. `--output <name>` picks a known Output; `--verbose` browses every available name and receipt. |
| `history` | Finds one named Output across Results, reuse included (`--source <author-source>` narrows it). It does not select anything for the current Run. |
| `get` | Exports one named Output to one explicit destination. |

A Result can list many Outputs forwarded from earlier work; that inventory does not mean those files
were generated or copied again. `get` writes:

- a Scalar as a JSON file;
- a Resource as one streamed file;
- a Composite as a directory containing `value.json` and every Resource it references.

What lands at the destination is a copy for people to use. The Result itself remains under
`.clipkin/results` in the project, on whichever machine runs Clipkin.

Give useful Results presentation metadata so people and Studio can find them:

```bash
clipkin result edit <build-id> --title "podcast take · coral captions" \
  --note "speaker timing and framing for the current production" \
  --highlight podcast-take.video
```

Title, note and highlights live in that Result's manifest (`--clear-title`, `--clear-note` and
`--clear-highlights` remove them). They rename no public Output and build no project-wide history
index. To reuse something you still write its Build id and Output name into a Run; see [Authoring](authoring.md).

## Keep Results with the project

Results are part of the video project and live in its `.clipkin/results` directory. `builds`, `get`,
`history` and Studio's library of finished work all read from there. Archiving or relocating finished
Results later is plain file housekeeping; it does not change which repository a running Runtime uses.

Each submitted Build is tied to its own Result directory in the project. Never delete a Result that a
Run still draws a Candidate from — the exported copies are optional, while reuse may reference
Resources stored inside the Result. To move the Results and the authored work to another machine or
person, follow [Project handoff](../creation/project-files.md#hand-over-an-editable-production).

## Build with the current project implementation

Every ordinary local Build loads its own copy of the project implementation and the selected Provider
configuration. After editing project components or the Profile, submit a new Build; work that already
started keeps the implementation it loaded. When only composition changes, reuse completed material
through the Run. Warm services such as WhisperX stay available from one Build to the next.

Concurrent Builds share execution infrastructure, and waiting on a remote service does not reserve a
whole-Build slot. A lost executor ends the attempts it was running while keeping completed Outputs
and available remote receipts; continue with a new Build and explicit reuse. This boundary does not
freeze files that a component chooses to read later in execution.

Changing the installed Distribution, or the shell environment the coordinator inherited, is a
separate bootstrap change. Look at `clipkin activity` before you restart that Worker. A writable external credential store can
hand over updated secrets immediately; credentials read from environment variables keep whatever the
coordinator saw at start-up. `clipkin runtime down` halts the Worker and the executors it is running,
while Managed Programs start and stop on their own schedule.

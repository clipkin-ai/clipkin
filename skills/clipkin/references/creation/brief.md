# Brief and Treatment

Open this page any time the target video is being pinned down: from a reference, from a rough idea,
from a project that already exists, or from a revision request. Two documents carry the answer, and
they have different owners.

| Document | Whose voice | What it settles |
| --- | --- | --- |
| `BRIEF.md` | the user's | what they want, and the facts only they can vouch for |
| `TREATMENT.md` | the director's (yours) | the complete creative design of the new piece |

## Brief preserves user authority

`BRIEF.md` is the record of the request itself and of anything that only the user can supply with
authority. Keep it as short as the request allows. A single sentence is a complete Brief when it says
everything that matters:

> Remake this reference as closely as possible, swapping the host for the dog in `assets/biscuit.jpg`
> and the advertised product for Clipkin.

Add a fact only when the work depends on it. Typical entries:

- the outcome the user is after: audience, platform, deliverable, business purpose;
- claims, product truths, the offer and CTA, the language, and any fact that must stay accurate;
- each reference, together with what the user wants carried over from it;
- requested swaps, additions, removals or changes of style;
- private identity material and exact brand assets;
- firm limits on duration, format, budget or delivery;
- decisions the user has explicitly kept for themselves.

Where paraphrase could shift the meaning, quote the user or stay very close to their wording. Two
common mistakes: turning the Hook of one example video into a rule for the format, and slipping
implementation decisions into the Brief.

**Default inheritance in a faithful adaptation.** Anything the user did not mention normally carries
over from the reference: its structure, what each layer is for, how the promise sets up the payoff,
and the visual and sound systems that make it land. Treat this as your opening reading of the
request, not as an instruction to copy pixels.

**When to ask.** Go back to the user only when the known facts still leave open a materially
different goal, a private fact, a real value judgment, the deliverable, or spending authority.
Casting, art direction, shot selection, Caption treatment, component design, prompt writing and
implementation are your job; do not hand them back as questions.

**The paid-scope agreement lives here.** Record it as a production constraint:

- the billing accounts, named by non-secret labels or Endpoint references (never secret values);
- which work those accounts cover;
- the estimate, range or budget the user accepted, plus any conditions they attached.

Keep three distinctions visible: your proposed estimate versus the figure the user accepted, an
estimate versus a hard ceiling, and access (an account that works) versus authority (an agreement to
spend). `clipkin pricing <run>` gives you the material for the proposal: each request's Provider quote
(exact, an estimate with its stated assumptions, or "not yet measurable" when it depends on media
the Build will itself produce), followed by a Run estimate with vendor cost in USD, the customer
price in credits and the credit hold reserved before the Build. Actual charges are metered from each
completed request. Write the agreement in plain language and update it whenever the user changes it,
so a later conversation inherits exactly the same authority. Record the user's choices about local
versus hosted execution, and any machine preparation they accepted, in the same plain terms. The
Runtime Profile is how those choices get executed; the Brief is the evidence that the user made them.
[Builds](../production/builds.md#work-within-the-agreed-paid-scope) explains how the agreement
governs paid execution.

## Treatment is the director's answer

`TREATMENT.md` combines the Brief, whatever reference understanding is relevant, and your own
creative judgment into one complete design for the new work. Depending on the piece it can address:

- the premise and what the viewer should experience;
- how the story moves: Hook, reveal, payoff, CTA;
- target pacing and what each major passage is for;
- characters, performance, camera, locations and the visual world;
- the A-roll, B-roll, Caption, Typography, MG, Effect and Audio systems this target really needs;
- how each requested change ripples through those systems;
- which generated or supplied media will anchor identity and continuity;
- creative questions still open that genuinely block the design from becoming specific.

Write it the way a director talks. "The ranking portraits pile up into a board" or "the second
podcast camera flips the eye line but keeps the same counter and lighting" are Treatment sentences.
Package names, element attributes, Provider choices, Build order and Result ids are not; they live in
the production files.

**Say how the appeal actually reaches the viewer.** If the premise runs on contrast, name what the
audience is led to expect, then show how the wording, the situation, the reveal or the reaction toys
with that expectation. A
difference between two things may suggest an idea, but the piece still has to show what makes that
idea worth watching. Give the performer a definite attitude toward the subject and toward the person
they are talking to, then let [voice direction](../playbooks/craft/voice-direction.md) and
[video direction](../playbooks/craft/video-direction.md) turn that attitude into casting and
performance.

**Analysis and Treatment answer different questions.** A reference's Analysis explains why the old
piece works; the Treatment states what the new piece will be. For original work with no single
dominant reference, the Treatment grows from the Brief, any relevant examples and your judgment.
These are separate kinds of creative evidence; do not let one stand in for the other.

## Keep one formal Script

The only authoritative copy of the spoken words is the `<script>` inside the Author Source. While
copy is still being drafted it may sit in `drafts/`. Once it is adopted, move it into the Source and
stop keeping a parallel full transcript in the Brief or Treatment.

- The Brief may still hold mandatory claims or exact phrases the user supplied.
- The Treatment may say what each passage has to achieve.
- The Source owns the actual words, Roles, Cues, Selections and Moments.

## Edit the file that owns the change

| What changed | File to revise |
| --- | --- |
| the user's goal, a claim, a constraint, a requested substitution | Brief |
| the story, shot logic, a visual system, the performance, the creative approach | Treatment |
| a sharper prompt, corrected component geometry, a different Candidate, a timing-expression fix, with the design unchanged | Source, Recipe, Run, a project package or the generation input (not Treatment) |
| new evidence about the reference | its Analysis or Timeline, which may then lead you to rethink the Treatment |

Studio and built Results show the current design. When something looks wrong, decide which kind of
wrong it is: a flawed design means revising the Treatment; a sound design that was badly realized
means repairing the production. The Brief changes only when the user's own truth changes.

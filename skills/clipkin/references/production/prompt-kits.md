# Prompt Kits: choosing and authoring

Read this when you want a reusable prompt treatment, need to assemble a Kit's Text inputs, or want to
capture direction that worked in a new Kit. A Kit is worth having even for a single image or passage
when it preserves wording that has proven itself. The parts written specifically for this piece stay
in ordinary `text:Value` elements.

## What a Kit is, and is not

A Prompt Kit is a TextTemplate Source containing only data. It owns reusable wording and a few
meaningful choices. It owns nothing else: no model, no Provider, no media reference, no output size,
no production workflow.

Keep fluent shot direction fluent. A Kit earns its place when locking in exact wording, or offering a
small recurring choice, makes real productions better — splitting every sentence into knobs does not.

## Choose an existing treatment by its relationship

What the prompt has to accomplish comes from
[image direction](../playbooks/craft/image-direction.md) and
[video direction](../playbooks/craft/video-direction.md). Then pick a
Kit whose built-in assumptions serve that aim:

| Direction you need | Where to look |
| --- | --- |
| A locked phone-footage capture paragraph, then Person, Shot and Setting slots | The installed `@clipkin/gpt-image-kits` README and its `phone-ugc-v1` template (import `@clipkin/gpt-image-kits/phone-ugc-v1`) |
| A speaking performer, podcast, street interview, video call, silent B-roll, or motion or camera transfer | The installed `@clipkin/seedance-kits` README and the matching template (`speaker`, `podcast`, `street-interview`, `call`, `broll`, `motion-reference`, `camera-reference`; import e.g. `@clipkin/seedance-kits/speaker`, exposing `speaker-v1`) |

Both are packaged Sources: their README and exported `.grade` files give the template names, Text slots,
defaults and Recipe choices. Surface vocabulary answers a different question —
`clipkin vocabulary @clipkin/text --tag Render` describes assembly, and the chosen model's vocabulary
describes generation. Open the template itself whenever its fixed text or the exact wording of a
choice matters.

How the inputs usually line up:

- **A spoken passage:** wire in the Segment's `.dialogue` plus the action for this particular
  passage, and let the chosen Recipe hold the performance choices that recur.
- **An image:** bring Person, Shot and Setting direction from Craft.
- **References:** keep what each reference is said to do consistent with the media actually connected
  to the model. The owning package documents the reference order.

Fit is about assumptions, not just the available knobs. A conversation built from two separate views
and a split-screen opening with one combined image need different prompt structures. Use the Kit for
the passages it suits; where the relationship differs, write the Text directly or make a project
template. A Prompt Kit is also unrelated to a Run Fragment that supplies substitute media; [Runs](runs.md) owns that.

## Declare the reusable text program

An `.grade` file picks Text's Recipe Frontend and declares one template root. The example below locks one
capture paragraph, insists on this shot's framing and direction, exposes a camera choice you can
reuse, and inserts a screen note only if the render switches it on:

```grade
<?reel using="@clipkin/text/grade@1"?>

<sheet version="1" id="phone-shot">
  text-template.phone-shot {
    separator: paragraph;
    default-camera: handheld;
    default-screen: false;
  }

  text-template.phone-shot.block.capture {
    kind: fixed;
    order: 10;
    text: "A still pulled from everyday phone footage, with honest texture and believable light.";
  }

  text-template.phone-shot.block.camera {
    kind: axis;
    order: 20;
    parameter: camera;
  }
  text-template.phone-shot.choice.camera.handheld {
    text: "The phone is held by hand, close to the subject, with small natural drift.";
  }
  text-template.phone-shot.choice.camera.locked {
    text: "The phone sits fixed in place; only the subject moves.";
  }

  text-template.phone-shot.block.screen-note {
    kind: variant;
    order: 30;
  }
  text-template.phone-shot.choice.screen-note.present {
    when-param-screen: true;
    text: "The supplied interface stays inside its physical screen and remains legible.";
  }

  text-template.phone-shot.block.shot {
    kind: slot;
    order: 40;
    slot: shot;
  }
  text-template.phone-shot.block.direction {
    kind: slot;
    order: 50;
    slot: direction;
  }
  text-template.phone-shot.block.references {
    kind: slot;
    order: 60;
    slot: references;
    optional: true;
    label: "REFERENCE ROLES:";
  }
</sheet>
```

The root joins its blocks with one blank line (`paragraph` is the only separator). Its
`default-<name>` properties supply scalar bindings. Blocks are ordered by `order`, a non-negative
integer that no other block may repeat.

| Block `kind` | Contributes | Accepts |
| --- | --- | --- |
| `fixed` | Exact reusable Text | `text` |
| `slot` | Text connected at render time; with `optional: true` an absent slot is left out, and `label` puts one literal line above it | `slot`, `optional`, `label` |
| `axis` | The one choice whose id matches the value of the binding `parameter` names | `parameter` |
| `variant` | Every choice whose `when-param-<name>` (or `when-select-<name>`) conditions all match | nothing else |

Choices live at `text-template.<template>.choice.<block>.<choice>`; anything else under the root is
refused, as are properties a block's kind does not accept. Every default, condition, axis value and
literal `text:Param` is a single finite scalar: text, number or boolean. Text that some other node
produces always arrives as a graph edge; never copy it into a scalar binding.

## Render it in an Author Source

```reel
<?reel using="@clipkin/markup@1"?>
<reel>
  <import as="text" from="@clipkin/text@1"/>
  <import as="kit" source="./phone-shot.grade"/>
  <import as="recipes" source="./look.grade"/>

  <text:Value id="shot">A vertical half-body framing that leaves clear headroom above the presenter.</text:Value>
  <text:Value id="direction">An assured presenter talks through the idea in a well-used home studio.</text:Value>
  <text:Value id="reference-roles">Image one fixes who the presenter is.</text:Value>

  <text:Render id="prompt" template={kit.phone-shot} recipe={recipes.prompt.main}>
    <text:Param name="camera" value="locked"/>
    <text:Param name="screen" value="true" type="boolean"/>
    <text:Set name="shot" text={shot}/>
    <text:Set name="direction" text={direction}/>
    <text:Set name="references" text={reference-roles}/>
  </text:Render>
</reel>
```

Put the template in `phone-shot.grade`. A minimal `look.grade` for this example:

```grade
<?reel using="@clipkin/recipe@1"?>
<sheet version="1">
  prompt.main { camera: handheld; }
</sheet>
```

Precedence is explicit and local to TextTemplate:

1. template defaults apply first;
2. the optional Recipe replaces them, but only for bindings the template declares (other Recipe
   properties, such as model settings, are ignored);
3. explicit `text:Param` children replace the Recipe values (`type` is `text`, `number` or
   `boolean`, defaulting to `text`; two Params may not share a name).

`text:Set` swaps a Text binding for the Text arriving on its graph edge; `text:Append` tacks another
Text on after it. They take effect in the order you write them, so nothing about the result is hidden.

What comes out, `{prompt}`, is plain Text like any other Output. Connect it to a model's prompt port —
or, before relying on the Kit, target it alone in a small Run and read or export what it assembled.
That way you see the exact words without paying any image or video model. Aspect ratio, duration,
resolution and the reference Resource children remain settings of the model Surface; prose describing what a
reference provides does not create the reference edge.

## Sharing a Kit

Keep a Kit inside the project while it serves one project. If its owner wants it in other projects too,
publish the `.grade` from a normal versioned data package and import the packaged Source by name. [Component sharing](component-sharing.md#data-packages-remain-data) owns that
distribution boundary; it involves no activation code and no Clipkin-specific registry.

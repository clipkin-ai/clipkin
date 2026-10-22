import{compositionTypes as nt}from"@clipkin/composition";import{sealGraphFragment as at}from"@clipkin/clipkin/author";import{timelineTypes as it}from"@clipkin/timeline";import{compositionDependency as Je,compositionTypes as Xe,VISUAL_IR_V1 as Ye}from"@clipkin/composition";import{compositableSurfaceSchema as Ke,mediaDependency as Ze,mediaTypes as J}from"@clipkin/media";import{timelineDependency as Qe,timelineTypes as et}from"@clipkin/timeline";var A={name:"@clipkin/html-program",version:"1"},C={program:{module:A,name:"HtmlProgram"},frameImages:{module:A,name:"FrameImages"}},L={rasterizeVisual:{module:A,name:"rasterize-visual"},rasterizeFrames:{module:A,name:"rasterize-frames"}},P={compile:{module:A,name:"compile-composition"},requestVisual:{module:A,name:"request-visual"},requestVisualRange:{module:A,name:"request-visual-range"}},be={kind:"string",minLength:5,maxLength:256},E={kind:"number",integer:!0,minimum:1},X={kind:"number",integer:!0,minimum:0},tt={kind:"object",fields:{visualIr:{schema:{kind:"literal",value:Ye}},frameRate:{schema:{kind:"object",fields:{numerator:{schema:E},denominator:{schema:E}}}},frameCount:{schema:E},canvas:{schema:{kind:"object",fields:{width:{schema:E},height:{schema:E}}}},artifacts:{schema:{kind:"array",items:{kind:"object",fields:{artifact:{schema:{kind:"object",fields:{kind:{schema:{kind:"literal",value:"blob"}},resource:{schema:be},size:{schema:X},mediaType:{schema:{kind:"string",minLength:1}}}}},usage:{schema:{kind:"oneOf",variants:[{kind:"object",fields:{kind:{schema:{kind:"literal",value:"always"}}}},{kind:"object",fields:{kind:{schema:{kind:"literal",value:"frames"}},spans:{schema:{kind:"array",minItems:1,items:{kind:"object",fields:{startFrame:{schema:X},endFrameExclusive:{schema:E}}}}}}}]}}}}}},surfaces:{schema:{kind:"array",items:Ke}},frameSources:{schema:{kind:"array",items:{kind:"object",fields:{id:{schema:{kind:"string",minLength:1}},resource:{schema:be},startFrame:{schema:X},endFrameExclusive:{schema:E},sourceFrame:{schema:{kind:"object",fields:{numerator:{schema:X},denominator:{schema:E}}}},sourceRate:{schema:{kind:"object",fields:{numerator:{schema:{kind:"number",integer:!0}},denominator:{schema:E}}}},sourceFrameRate:{schema:{kind:"object",fields:{numerator:{schema:E},denominator:{schema:E}}}}}}}},html:{schema:{kind:"string",minLength:1}}}},rt={format:"clipkin.module@1",name:A.name,version:A.version,dependencies:[Je,Ze,Qe],types:[{name:C.program.name},{name:C.frameImages.name}],capabilities:[{name:L.rasterizeVisual.name,returns:J.timelineVisual},{name:L.rasterizeFrames.name,returns:C.frameImages}],producers:[{name:P.compile.name,inputs:[{name:"composition",type:Xe.composition},{name:"timeline",type:et.timeline}],outputs:[{name:"program",type:C.program}],needs:[]},{name:P.requestVisual.name,inputs:[{name:"program",type:C.program}],outputs:[],needs:[{name:"visual",capability:L.rasterizeVisual,returns:J.timelineVisual}]},{name:P.requestVisualRange.name,inputs:[{name:"program",type:C.program},{name:"range",type:J.frameRange}],outputs:[],needs:[{name:"visual",capability:L.rasterizeVisual,returns:J.timelineVisual}]}]};var ke=e=>({kind:"fragment-input",name:e}),ot=e=>({kind:"fragment-operation",operation:e}),st=at({inputs:[{name:"composition",type:nt.composition},{name:"timeline",type:it.timeline}],operations:[{id:"compile-program",producer:P.compile,inputs:{composition:ke("composition"),timeline:ke("timeline")},result:{kind:"output",name:"program"}}],exports:[{name:"program",type:C.program,root:ot("compile-program")}]});import{plannedNeedInputs as sr}from"@clipkin/clipkin/producer";import{canonicalize as lr}from"@clipkin/clipkin/protocol";import{assertCompositableSurfaceRef as At}from"@clipkin/media";import{timelineFrameCount as pe}from"@clipkin/timeline";import{assertCompositionIdentity as It}from"@clipkin/composition";import{canonicalStringify as D,isResourceId as fe}from"@clipkin/clipkin/protocol";import{VISUAL_IR_V1 as qe}from"@clipkin/composition";import{canonicalize as lt}from"@clipkin/clipkin/protocol";var re="clipkin.html-visual@1";function ct(e,t=[]){return{format:re,payload:lt(e),artifacts:[...t]}}function ne(e){if(e.format!==re)throw new Error(`visual program format ${e.format} is not supported by the HTML renderer.`);let t=e.payload;if(t===null||typeof t!="object"||typeof t.html!="string"||t.css!==void 0&&typeof t.css!="string"||t.setup!==void 0&&typeof t.setup!="string")throw new Error("HTML visual takes HTML plus optional CSS and setup source.");return t}function we(e,t){let r=new Set,n=e.html.replace(/\{\{([^{}]+)\}\}/gu,(a,i)=>{let o=t.get(i);if(o===void 0||r.has(i))throw new Error(`HTML visual slot ${i} is absent or appears more than once.`);return r.add(i),o});for(let a of t.keys())if(!r.has(a))throw new Error(`HTML visual never places its owned child ${a}.`);return n}var mt=e=>JSON.stringify(e).replaceAll("<","\\u003c");function ve(e,t,r){return`(() => {
    const fail = error => { window.__clipkinHtmlVisualError = String(error?.stack || error); };
    const entries = ${mt(e)}.filter(entry =>
      htmlSelectionOverlaps(entry.startFrame, entry.startFrame + entry.durationFrames));
    const renders = entries.map((entry, order) => {
      const root = document.getElementById(entry.id);
      try {
        const render = entry.program.setup === undefined ? () => {} :
          new Function('root', 'data', entry.program.setup)(root, entry.program.data);
        if (typeof render !== 'function') throw new Error('HTML visual setup must return render(localFrame).');
        return { ...entry, order, render, region: undefined };
      } catch (error) { fail(error); return { ...entry, order, render: () => {}, region: undefined }; }
    });
    const workIndex = htmlCreateFrameWorkIndex(renders.map(entry => ({
      startFrame: entry.startFrame,
      endFrameExclusive: entry.startFrame + entry.durationFrames,
      order: entry.order,
      payload: entry,
    })));
    let previousFrame;
    const renderAt = (entry, frame) => {
      const local = frame - entry.startFrame;
      const region = local < 0 ? 'before' : local >= entry.durationFrames ? 'after' : 'active';
      // Preserve initial and crossed boundary poses. Active seeks always redraw,
      // including repeated frames after an asynchronously prepared image became ready.
      if (region !== 'active' && entry.region === region) return;
      try {
        const result = entry.render(Math.max(0, Math.min(entry.durationFrames, local)));
        if (result != null && typeof result.then === 'function') {
          // Observe a later rejection, but never let asynchronous drawing race frame capture.
          Promise.resolve(result).catch(fail);
          throw new Error('HTML visual render(localFrame) must be synchronous; prepare asynchronous resources before rendering.');
        }
        entry.region = region;
      }
      catch (error) { fail(error); }
    };
    const apply = frame => {
      if (previousFrame === undefined) {
        // Establish every compiler-owned root's boundary pose once. Later work
        // is limited to active programs and spans crossed by an arbitrary seek.
        for (const entry of renders) renderAt(entry, frame);
      } else {
        const work = new Map();
        for (const item of workIndex.at(frame)) work.set(item.serial, item);
        if (frame !== previousFrame) {
          const startFrame = Math.min(previousFrame, frame);
          const endFrameExclusive = Math.max(previousFrame, frame) + 1;
          for (const item of workIndex.overlapping({ startFrame, endFrameExclusive })) work.set(item.serial, item);
        }
        for (const item of [...work.values()].sort((left, right) => left.order - right.order || left.serial - right.serial)) {
          renderAt(item.payload, frame);
        }
      }
      previousFrame = frame;
    };
    apply(0);
    window.addEventListener('clipkin-frame', event => apply(event.detail?.frame));
  })();`}var Fe=String.raw`
(() => {
  const selected = [];
  const presents = [...document.querySelectorAll('[data-clipkin-present-start-frame][data-clipkin-present-end-frame]')];
  const media = (root) => [root, ...root.querySelectorAll('img,source,video,audio,image')];
  const activate = (root) => {
    for (const element of media(root)) {
      for (const attribute of ['src', 'href']) {
        const deferred = 'data-clipkin-resource-' + attribute;
        const value = element.getAttribute(deferred);
        if (value === null) continue;
        // Compiler-planned source-time video is decoded once by the Provider
        // and supplied as exact source frames. Leaving its URL inert prevents
        // every browser Worker from independently traversing the same video.
        // Studio has no frame selection and therefore keeps native playback.
        if (htmlRequestedFrameSpans !== null && attribute === 'src'
          && element.matches('video[data-clipkin-sampling-part]')) continue;
        element.setAttribute(attribute, value);
        element.removeAttribute(deferred);
      }
    }
  };
  const exclude = (root) => {
    root.setAttribute('data-clipkin-capture-excluded', '');
    root.style.setProperty('display', 'none', 'important');
    for (const element of media(root)) {
      const name = element.localName;
      const attributes = name === 'img' || name === 'source' ? ['src', 'srcset']
        : name === 'video' ? ['src', 'poster']
        : name === 'audio' ? ['src']
        : name === 'image' ? ['href'] : [];
      for (const attribute of attributes) element.removeAttribute(attribute);
      element.removeAttribute('data-clipkin-resource-src');
      element.removeAttribute('data-clipkin-resource-href');
      if (name === 'image') element.removeAttributeNS('http://www.w3.org/1999/xlink', 'href');
    }
    // The complete document has already been parsed, but a render Worker will
    // never request this Present. Detach it before DOMContentLoaded so generic
    // browser adapters discover only live selected work. Compiler-owned shared
    // definitions live outside Present roots; Present-local masks, paths and
    // HtmlVisual structure leave with their owner.
    root.remove();
  };
  for (const root of presents) {
    const startFrame = Number(root.getAttribute('data-clipkin-present-start-frame'));
    const endFrameExclusive = Number(root.getAttribute('data-clipkin-present-end-frame'));
    if (!Number.isSafeInteger(startFrame) || !Number.isSafeInteger(endFrameExclusive)
      || startFrame < 0 || endFrameExclusive <= startFrame) {
      throw new Error('HTML renderer Present has an invalid capture span.');
    }
    if (htmlSelectionOverlaps(startFrame, endFrameExclusive)) selected.push(root);
    else exclude(root);
  }
  // Compiler-owned direct media URLs become observable to the browser only
  // after unrelated Present roots are gone. Opaque author HTML remains opaque.
  for (const root of selected) activate(root);
  const definitions = [...document.querySelectorAll('[data-clipkin-document-definitions]')];
  Object.defineProperty(globalThis, '__clipkinCaptureRoots', {
    value: Object.freeze([...definitions, ...selected]),
    writable: false,
    configurable: false,
  });
})();`;function $e(e,t){return`(() => {
    const entries = [...document.querySelectorAll('[data-clipkin-visibility]')].map((element, order) => ({
      element,
      order,
      spans: JSON.parse(element.dataset.clipkinVisibility),
    }));
    const workIndex = htmlCreateFrameWorkIndex(entries.flatMap(entry => entry.spans
      .filter(span => htmlSelectionOverlaps(span.startFrame, span.endFrameExclusive)).map(span => ({
      startFrame: span.startFrame,
      endFrameExclusive: span.endFrameExclusive,
      order: entry.order,
      payload: entry.element,
    }))));
    let visible = new Set();
    for (const entry of entries) entry.element.style.opacity = '0';
    const apply = frame => {
      const next = new Set(workIndex.at(frame).map(work => work.payload));
      // A presentation mask controls painting, not layout or animation existence.
      // Only roots whose absolute visibility changed need a DOM write.
      for (const element of visible) if (!next.has(element)) element.style.opacity = '0';
      for (const element of next) if (!visible.has(element)) element.style.opacity = '';
      visible = next;
    };
    apply(0);
    window.addEventListener('clipkin-frame', event => apply(event.detail?.frame));
  })();`}var ae=String.raw`
const htmlRequestedFrameSpans = (() => {
  const source = globalThis.__htmlRequestedFrameSpans;
  if (source === undefined) return null;
  if (!Array.isArray(source)) throw new Error('HTML renderer requested frame spans must be an array.');
  let previousEnd = -1;
  return Object.freeze(source.map((span) => {
    if (!Array.isArray(span) || span.length !== 2) {
      throw new Error('HTML renderer requested frame span must be a [start, end) pair.');
    }
    const startFrame = Number(span[0]);
    const endFrameExclusive = Number(span[1]);
    if (!Number.isSafeInteger(startFrame) || !Number.isSafeInteger(endFrameExclusive)
      || startFrame < 0 || endFrameExclusive <= startFrame || startFrame < previousEnd) {
      throw new Error('HTML renderer requested frame spans must be ordered, disjoint and valid.');
    }
    previousEnd = endFrameExclusive;
    return Object.freeze({ startFrame, endFrameExclusive });
  }));
})();
const htmlSelectionOverlaps = (startFrame, endFrameExclusive) => {
  if (!Number.isSafeInteger(startFrame) || !Number.isSafeInteger(endFrameExclusive)
    || startFrame < 0 || endFrameExclusive <= startFrame) {
    throw new Error('HTML renderer selection query span is invalid.');
  }
  if (htmlRequestedFrameSpans === null) return true;
  let low = 0;
  let high = htmlRequestedFrameSpans.length;
  while (low < high) {
    const middle = (low + high) >>> 1;
    if (htmlRequestedFrameSpans[middle].endFrameExclusive <= startFrame) low = middle + 1;
    else high = middle;
  }
  const candidate = htmlRequestedFrameSpans[low];
  return candidate !== undefined && candidate.startFrame < endFrameExclusive;
};
`,Se=String.raw`${ae}
const htmlCreateFrameWorkIndex = (sourceEntries) => {
  const entries = sourceEntries.map((entry, serial) => {
    const startFrame = Number(entry.startFrame);
    const endFrameExclusive = Number(entry.endFrameExclusive);
    const order = entry.order === undefined ? serial : Number(entry.order);
    if (!Number.isSafeInteger(startFrame) || !Number.isSafeInteger(endFrameExclusive)
      || startFrame < 0 || endFrameExclusive <= startFrame || !Number.isSafeInteger(order)) {
      throw new Error('HTML renderer frame work has an invalid span or order.');
    }
    return Object.freeze({ startFrame, endFrameExclusive, order, serial, payload: entry.payload });
  });
  const build = (items) => {
    if (items.length === 0) return null;
    const centers = items
      .map((entry) => entry.startFrame + (entry.endFrameExclusive - entry.startFrame) / 2)
      .sort((left, right) => left - right);
    const center = centers[Math.floor(centers.length / 2)];
    const left = [];
    const right = [];
    const overlaps = [];
    for (const entry of items) {
      if (entry.endFrameExclusive <= center) left.push(entry);
      else if (entry.startFrame > center) right.push(entry);
      else overlaps.push(entry);
    }
    return Object.freeze({
      center,
      byStart: Object.freeze([...overlaps].sort((a, b) =>
        a.startFrame - b.startFrame || a.endFrameExclusive - b.endFrameExclusive || a.serial - b.serial)),
      byEnd: Object.freeze([...overlaps].sort((a, b) =>
        b.endFrameExclusive - a.endFrameExclusive || a.startFrame - b.startFrame || a.serial - b.serial)),
      left: build(left),
      right: build(right),
    });
  };
  const root = build(entries);
  const collect = (node, frame, result) => {
    if (node === null) return;
    if (frame < node.center) {
      for (const entry of node.byStart) {
        if (entry.startFrame > frame) break;
        result.push(entry);
      }
      collect(node.left, frame, result);
      return;
    }
    for (const entry of node.byEnd) {
      if (entry.endFrameExclusive <= frame) break;
      result.push(entry);
    }
    collect(node.right, frame, result);
  };
  const collectOverlapping = (node, span, result) => {
    if (node === null) return;
    for (const entry of node.byStart) {
      if (entry.startFrame >= span.endFrameExclusive) break;
      if (entry.endFrameExclusive > span.startFrame) result.push(entry);
    }
    if (span.startFrame < node.center) collectOverlapping(node.left, span, result);
    if (span.endFrameExclusive > node.center) collectOverlapping(node.right, span, result);
  };
  const ordered = (result) => result.sort((left, right) => left.order - right.order || left.serial - right.serial);
  return Object.freeze({
    at(frame) {
      if (!Number.isSafeInteger(frame) || frame < 0) throw new Error('HTML renderer frame work query is invalid.');
      const result = [];
      collect(root, frame, result);
      return ordered(result);
    },
    overlapping(span) {
      const startFrame = Number(span?.startFrame);
      const endFrameExclusive = Number(span?.endFrameExclusive);
      if (!Number.isSafeInteger(startFrame) || !Number.isSafeInteger(endFrameExclusive)
        || startFrame < 0 || endFrameExclusive <= startFrame) {
        throw new Error('HTML renderer frame work query span is invalid.');
      }
      const result = [];
      collectOverlapping(root, { startFrame, endFrameExclusive }, result);
      return ordered(result);
    },
  });
};`;function dt(e){let t=-1,r=e.map(n=>{if(!Number.isSafeInteger(n.startFrame)||!Number.isSafeInteger(n.endFrameExclusive)||n.startFrame<0||n.endFrameExclusive<=n.startFrame||n.startFrame<t)throw new Error("HTML renderer requested frame spans have to be valid, ordered and non-overlapping.");return t=n.endFrameExclusive,[n.startFrame,n.endFrameExclusive]});return`Object.defineProperty(globalThis,"__htmlRequestedFrameSpans",{value:${JSON.stringify(r)},writable:false,configurable:false});`}import{canonicalStringify as z}from"@clipkin/clipkin/protocol";function c(e){return Object.is(e,-0)?"0":Number.isInteger(e)?String(e):String(Number(e.toFixed(8)))}function ut(e){return`${e.opacity===1?e.color:`color-mix(in srgb,${e.color} ${c(e.opacity*100)}%,transparent)`} ${c(e.offset*100)}%`}function ie(e){if(e.kind==="solid")return e.color;let t=e.stops.map(ut).join(",");return e.kind==="linear-gradient"?`linear-gradient(${c(e.angleDeg)}deg,${t})`:`radial-gradient(circle at ${c(e.center.x*100)}% ${c(e.center.y*100)}%,${t})`}function Y(e){return e.kind==="solid"?e.color:void 0}function pt(e,t){return e===void 0?[]:[`font-family:${e.map(t).join(",")}`,`font-weight:${e[0].weight}`,`font-style:${e[0].style}`,"font-synthesis:none"]}function K(e,t){let r=e.synthesis==="weight-style"?"weight style":e.synthesis,n=e.decorations,a=n[0];if(n.some(i=>i.paint.kind!=="solid"))throw new Error("HTML renderer Text decorations only support solid Paint for now.");if(a!==void 0&&n.some(i=>i.style!==a.style||i.paint.kind!=="solid"||a.paint.kind!=="solid"||i.paint.color!==a.paint.color||i.thicknessPx!==a.thicknessPx||i.offsetPx!==a.offsetPx||i.skipInk!==a.skipInk))throw new Error("HTML renderer Text decorations within one run have to use the same Paint and metric settings.");return[...pt(e.fonts,t),`font-size:${c(e.sizePx)}px`,`font-weight:${e.weight}`,`font-style:${e.style}`,`font-synthesis:${r}`,`font-kerning:${e.kerning}`,`font-variation-settings:${e.axes.length===0?"normal":e.axes.map(i=>`"${i.tag}" ${c(i.value)}`).join(",")}`,`font-feature-settings:${e.features.length===0?"normal":e.features.map(i=>`"${i.tag}" ${i.enabled?1:0}`).join(",")}`,`letter-spacing:${c(e.trackingPx)}px`,`word-spacing:${c(e.wordSpacingPx)}px`,`line-height:${c(e.lineHeight)}`,...e.direction==="auto"?[]:[`direction:${e.direction}`],`writing-mode:${e.writingMode}`,`text-transform:${e.transform}`,`font-variant-caps:${e.variantCaps}`,`tab-size:${e.tabSize}`,`text-indent:${c(e.indentationPx)}px`,...e.baselineShiftPx===0?[]:[`vertical-align:${c(e.baselineShiftPx)}px`],...e.baselineShiftPx!==0||e.verticalAlign==="baseline"?[]:[`vertical-align:${e.verticalAlign}`],`text-autospace:${e.cjk.textSpacing==="normal"?"normal":"no-autospace"}`,`text-spacing-trim:${e.cjk.punctuationTrim==="none"?"space-all":e.cjk.punctuationTrim==="start"?"trim-start":e.cjk.punctuationTrim==="adjacent"?"trim-both":e.cjk.punctuationTrim==="all"?"trim-all":"space-first"}`,...a===void 0?[]:[`text-decoration-line:${n.map(i=>i.line).join(" ")}`,`text-decoration-color:${a.paint.kind==="solid"?a.paint.color:"currentColor"}`,`text-decoration-style:${a.style}`,...a.thicknessPx===void 0?[]:[`text-decoration-thickness:${c(a.thicknessPx)}px`],...a.offsetPx===void 0?[]:[`text-underline-offset:${c(a.offsetPx)}px`],`text-decoration-skip-ink:${a.skipInk?"auto":"none"}`]]}function _(e,t,r,n){let a=r??e.language,i=n??e.direction;return[...a===void 0?[]:[`lang="${t(a)}"`],`dir="${i}"`].join(" ")}function O(e,t){let r=t?.typography;if(r===void 0)return e;let{fonts:n,axes:a,features:i,decorations:o,cjk:l,...s}=r;return{...e,...s,fonts:r.fonts??e.fonts,axes:r.axes??e.axes,features:r.features??e.features,decorations:r.decorations??e.decorations,cjk:r.cjk===void 0?e.cjk:{...e.cjk,...r.cjk}}}function N(e){return e.filter(t=>t.kind!=="box")}function Te(e){return e.kind==="shadow"||e.kind==="glow"||e.kind==="stroke"&&e.placement!=="outside"}function Pe(e){let t=N(e).filter(r=>r.kind==="fill");return t.length===1&&t[0].paint.kind==="solid"?[`color:${t[0].paint.color}`]:[]}function Z(e,t){return t.stableId(["text-glyph-filter",z(e)])}function oe(e,t){let r=Y(e.paint);if(r===void 0)throw new Error(`HTML renderer ${e.kind} Text Paint supports solid color only; render a gradient ${e.kind} as a Surface instead.`);let n=Z(e,t),a=`<feFlood flood-color="${t.escape(r)}" result="paint"/>`;if(e.kind==="stroke"){let s=e.placement==="center"?e.widthPx/2:e.widthPx,d=`<feMorphology in="SourceAlpha" operator="dilate" radius="${c(s)}" result="expanded"/>`,u=`<feMorphology in="SourceAlpha" operator="erode" radius="${c(s)}" result="contracted"/>`,m=e.placement==="outside"?'<feComposite in="expanded" in2="SourceAlpha" operator="out" result="shape"/>':e.placement==="inside"?'<feComposite in="SourceAlpha" in2="contracted" operator="out" result="shape"/>':'<feComposite in="expanded" in2="contracted" operator="out" result="shape"/>';return`<filter id="${n}" x="-100%" y="-100%" width="300%" height="300%" color-interpolation-filters="sRGB">${d}${u}${m}${a}<feComposite in="paint" in2="shape" operator="in"/></filter>`}let i=e.spreadPx<=0?'<feComposite in="SourceAlpha" in2="SourceAlpha" operator="in" result="spread"/>':`<feMorphology in="SourceAlpha" operator="dilate" radius="${c(e.spreadPx)}" result="spread"/>`,o=`<feGaussianBlur in="spread" stdDeviation="${c(e.blurPx)}" result="blurred"/>`,l=e.kind==="shadow"?`<feOffset in="blurred" dx="${c(e.offsetX)}" dy="${c(e.offsetY)}" result="shape"/>`:'<feComposite in="blurred" in2="blurred" operator="in" result="shape"/>';return`<filter id="${n}" x="-100%" y="-100%" width="300%" height="300%" color-interpolation-filters="sRGB">${i}${o}${l}${a}<feComposite in="paint" in2="shape" operator="in"/></filter>`}function ft(e){let t=[],r=n=>{t.push(...N(n??[]))};r(e.paints);for(let n of e.document.paragraphs){r(n.style?.paints);for(let a of n.inlines)a.kind==="text"&&r(a.style?.paints)}return t}function Ee(e,t){let n=ft(e).filter(Te);return[...new Map(n.map(i=>[z(i),i])).values()].map(i=>oe(i,t)).join("")}function gt(e,t){let r=Ee(e,t);return r.length===0?"":`<svg aria-hidden="true" width="0" height="0" style="position:absolute;overflow:hidden"><defs>${r}</defs></svg>`}function ht(e,t,r){let n=["grid-area:1/1","position:relative","pointer-events:none"];if(e.kind==="fill")return e.paint.kind==="solid"?[...n,`color:${t?"inherit":e.paint.color}`]:[...n,`background-image:${ie(e.paint)}`,"background-clip:text","-webkit-background-clip:text","color:transparent","-webkit-text-fill-color:transparent"];if(e.kind==="stroke"&&e.placement==="outside"){let a=Y(e.paint);if(a===void 0)throw new Error("HTML renderer outside Text stroke supports solid color only; render a gradient stroke as a Surface instead.");return[...n,`color:${a}`,`-webkit-text-fill-color:${a}`,`-webkit-text-stroke:${c(e.widthPx*2)}px ${a}`,"paint-order:stroke fill"]}return[...n,"color:#ffffff","-webkit-text-fill-color:#ffffff","text-shadow:none",`filter:url(#${Z(e,r)})`]}function Re(e,t,r){let n=N(t);if(n.length===0)return r.escape(e);let a=n.length===1&&n[0]?.kind==="fill"&&n[0].paint.kind==="solid";return n.map((i,o)=>`<span aria-hidden="${o===n.length-1?"false":"true"}" data-clipkin-text-paint-layer="${o}"${S(ht(i,a,r),r.escape)}>${r.escape(e)}</span>`).join("")}function Ae(e,t,r){let n=N(t);if(n.length===0)return r.escape(e);let a=n.filter(Te),i=r.emittedFilterIds,o=[...new Map(a.map(s=>[z(s),s])).values()].filter(s=>{let d=Z(s,r);return i===void 0?!0:i.has(d)?!1:(i.add(d),!0)}).map(s=>oe(s,r)).join("");return o.length>0&&r.sharedGlyphFilterDefinitions!==void 0&&r.sharedGlyphFilterDefinitions.push(o),`${o.length===0||r.sharedGlyphFilterDefinitions!==void 0?"":`<svg aria-hidden="true" width="0" height="0" style="position:absolute;overflow:hidden"><defs>${o}</defs></svg>`}<span style="position:relative;display:inline-grid">${Re(e,t,r)}</span>`}function Ie(e,t,r){return e.filter(n=>n.kind==="box"&&n.target===t&&(r===void 0||n.continuity===r))}function M(e,t,r){let n=Ie(e,t,r);if(n.length===0)return[];let a=[],i=[],o=[];for(let l of n){let s=l.decoration;if(s.fill!==void 0&&o.push(s.fill.kind==="solid"?`linear-gradient(${s.fill.color},${s.fill.color})`:ie(s.fill)),s.border!==void 0){let d=Y(s.border.paint);if(d===void 0)throw new Error("HTML renderer Text Box borders only support solid Paint.");a.push(`border-style:${s.border.style}`,`border-color:${d}`,`border-width:${c(s.border.widthsPx.top)}px ${c(s.border.widthsPx.right)}px ${c(s.border.widthsPx.bottom)}px ${c(s.border.widthsPx.left)}px`)}a.push(`padding:${c(s.paddingPx.top)}px ${c(s.paddingPx.right)}px ${c(s.paddingPx.bottom)}px ${c(s.paddingPx.left)}px`,`border-radius:${c(s.radiiPx.topLeft)}px ${c(s.radiiPx.topRight)}px ${c(s.radiiPx.bottomRight)}px ${c(s.radiiPx.bottomLeft)}px`);for(let d of s.shadows){let u=Y(d.paint);if(u===void 0)throw new Error("HTML renderer Text Box shadows only support solid Paint.");i.push(`${c(d.offsetX)}px ${c(d.offsetY)}px ${c(d.blurPx)}px ${c(d.spreadPx)}px ${u}`)}}return o.length>0&&a.push(`background-image:${o.reverse().join(",")}`),i.length>0&&a.push(`box-shadow:${i.join(",")}`),a}function V(e,t,r,n){return Ie(e,t,n).flatMap((a,i)=>{let o=a.decoration.tail;if(o===void 0)return[];let l=o.side,s=l==="top"?`left:${c(o.offset)}px;top:${c(-o.heightPx)}px`:l==="bottom"?`left:${c(o.offset)}px;bottom:${c(-o.heightPx)}px`:l==="left"?`left:${c(-o.widthPx)}px;top:${c(o.offset)}px`:`right:${c(-o.widthPx)}px;top:${c(o.offset)}px`,d=l==="top"?"0 100%,50% 0,100% 100%":l==="bottom"?"0 0,100% 0,50% 100%":l==="left"?"100% 0,0 50%,100% 100%":"0 0,100% 50%,0 100%",u=`position:absolute;pointer-events:none;width:${c(o.widthPx)}px;height:${c(o.heightPx)}px;${s};background:${ie(o.paint)};clip-path:polygon(${d});z-index:${i}`;return[`<span aria-hidden="true" data-clipkin-text-tail="${l}" style="${r.escape(u)}"></span>`]}).join("")}function yt(e){let t=e.flow,r=t.overflow==="visible"?"visible":"hidden",n=t.inlineAlign==="start"?"start":t.inlineAlign==="end"?"end":t.inlineAlign;return["box-sizing:border-box","flex-shrink:0",`padding:${c(t.paddingPx.blockStart)}px ${c(t.paddingPx.inlineEnd)}px ${c(t.paddingPx.blockEnd)}px ${c(t.paddingPx.inlineStart)}px`,`text-align:${n}`,`overflow:${r}`,`white-space:${t.wrap==="none"?"pre":"pre-wrap"}`,`overflow-wrap:${t.wrap==="grapheme"?"anywhere":t.wrap==="word"?"break-word":"normal"}`,`word-break:${t.wrap==="grapheme"?"break-all":"normal"}`,`column-count:${t.columns}`,`column-gap:${c(t.columnGapPx)}px`,...t.inlineSize==="hug"?["width:max-content"]:["width:100%"],...t.blockSize==="hug"?["height:max-content"]:["height:100%"],...t.overflow!=="ellipsis"||t.wrap==="none"?[]:["display:-webkit-box","-webkit-box-orient:vertical",...t.maxLines===void 0?[]:[`-webkit-line-clamp:${t.maxLines}`]],...t.overflow==="ellipsis"&&t.wrap==="none"?["text-overflow:ellipsis"]:[]]}function xt(e,t){return e==="line-box"?[]:[`text-box-trim:${t}`,`text-box-edge:${e==="cap-height"?"cap alphabetic":"text alphabetic"}`]}function H(e,t,r,n){return[]}function S(e,t){return e.length===0?"":` style="${t(e.join(";"))}"`}function se(e,t){return[...new Intl.Segmenter(t,{granularity:"word"}).segment(e)].map(n=>({text:n.segment,wordLike:n.isWordLike??!1}))}function U(e,t){return[...new Intl.Segmenter(t,{granularity:"grapheme"}).segment(e)].map(r=>r.segment)}function bt(e,t){let r={paragraph:e.paragraphs.length,run:0,word:0,grapheme:0};for(let n of e.paragraphs){let a=O(t,n.style);for(let i of n.inlines){if(i.kind==="break")continue;r.run+=1;let o=O(a,i.style),l=i.language??o.language;for(let s of se(i.text,l))s.wordLike&&(r.word+=1),r.grapheme+=U(s.text,l).length}}return r}function kt(e){let t=bt(e.document,e.typography);for(let r of e.sequences)if(r.unit!=="line"&&r.range.endExclusive>t[r.unit])throw new Error(`Text sequence ${r.id} selects ${r.unit} ${r.range.endExclusive}, yet there are only ${t[r.unit]}.`)}function wt(e,t,r){let n={paragraph:0,run:0,word:0,grapheme:0},a=(i,o)=>{let l=n.grapheme++,s=["position:relative","display:inline-grid",...M(o,"grapheme","isolated"),...H(t,"grapheme",l,r)];return`<span data-clipkin-text-unit-grapheme="${l}"${S(s,r.escape)}>${V(o,"grapheme",r,"isolated")}${Re(i,o,r)}</span>`};return e.paragraphs.map((i,o)=>{let l=n.paragraph++,s=O(t.typography,i.style),d=i.style?.paints??t.paints,u=i.inlines.map(x=>{if(x.kind==="break")return"<br/>";let I=n.run++,b=O(s,x.style),y=x.style?.paints??d,T=se(x.text,x.language??b.language).map(w=>{if(!w.wordLike)return U(w.text,x.language??b.language).map(j=>a(j,y)).join("");let F=n.word++,R=U(w.text,x.language??b.language).map(j=>a(j,y)).join("");return`<span data-clipkin-text-unit-word="${F}"${S(["position:relative",...M(y,"word","isolated"),...H(t,"word",F,r)],r.escape)}>${V(y,"word",r,"isolated")}${R}</span>`}).join(""),v=["position:relative","box-decoration-break:clone","-webkit-box-decoration-break:clone",...K(b,r.exactFontFamily),...Pe(y),...M(y,"run"),...M(y,"word","joined"),...M(y,"grapheme","joined"),...H(t,"run",I,r)];return`<span data-clipkin-text-run="${r.escape(x.id)}" data-clipkin-text-unit-run="${I}" ${_(b,r.escape,x.language,x.direction)}${S(v,r.escape)}>${V(y,"run",r)}${V(y,"word",r,"joined")}${V(y,"grapheme",r,"joined")}${T}</span>`}).join(""),m=["position:relative",`margin:${c(s.paragraphBeforePx)}px 0 ${c(s.paragraphAfterPx)}px 0`,...M(d,"paragraph"),...H(t,"paragraph",l,r)],h=o===0,p=o===e.paragraphs.length-1,f=h&&p?"trim-both":h?"trim-start":p?"trim-end":void 0,g=`<span data-clipkin-text-line-fragments${S(["position:relative","box-decoration-break:clone","-webkit-box-decoration-break:clone",...M(d,"line")],r.escape)}>${V(d,"line",r)}${u}</span>`,k=t.flow.metricEdge==="line-box"||f===void 0?g:`<span data-clipkin-text-metrics${S(["display:block",...xt(t.flow.metricEdge,f)],r.escape)}>${g}</span>`;return`<div data-clipkin-text-paragraph="${r.escape(i.id)}" data-clipkin-text-unit-paragraph="${l}" ${_(s,r.escape)}${S(m,r.escape)}>${V(d,"paragraph",r)}${k}</div>`}).join("")}function vt(e){return e.map(t=>t.kind==="move"?`M ${c(t.x)} ${c(t.y)}`:t.kind==="line"?`L ${c(t.x)} ${c(t.y)}`:t.kind==="quadratic"?`Q ${c(t.controlX)} ${c(t.controlY)} ${c(t.x)} ${c(t.y)}`:t.kind==="cubic"?`C ${c(t.control1X)} ${c(t.control1Y)} ${c(t.control2X)} ${c(t.control2Y)} ${c(t.x)} ${c(t.y)}`:"Z").join(" ")}function Ft(e){let t=[],r,n,a=[],i=!1,o=()=>{if(r===void 0||n===void 0)return;let l=[...a].reverse();t.push({kind:"move",x:n.x,y:n.y});for(let s of l)s.kind==="line"?t.push({kind:"line",x:s.from.x,y:s.from.y}):s.kind==="quadratic"?t.push({kind:"quadratic",controlX:s.controlX,controlY:s.controlY,x:s.from.x,y:s.from.y}):t.push({kind:"cubic",control1X:s.control2X,control1Y:s.control2Y,control2X:s.control1X,control2Y:s.control1Y,x:s.from.x,y:s.from.y});i&&t.push({kind:"close"}),r=void 0,n=void 0,a=[],i=!1};for(let l of e)if(l.kind==="move")o(),r={x:l.x,y:l.y},n=r;else if(l.kind==="close"){if(r===void 0||n===void 0)throw new Error("Path close has no open subpath to close.");(n.x!==r.x||n.y!==r.y)&&a.push({kind:"line",from:n,x:r.x,y:r.y}),n=r,i=!0}else{if(n===void 0)throw new Error("Path segment has no current point to start from.");if(l.kind==="line")a.push({kind:"line",x:l.x,y:l.y,from:n});else if(l.kind==="quadratic")a.push({...l,from:n});else if(l.kind==="cubic")a.push({...l,from:n});else throw new Error("Path segment kind is not supported.");n={x:l.x,y:l.y}}return o(),t}function $t(e){let t=[],r=n=>{for(let a of n??[])a.kind==="box"?(a.decoration.fill!==void 0&&t.push(a.decoration.fill),a.decoration.border!==void 0&&t.push(a.decoration.border.paint)):t.push(a.paint)};r(e.paints);for(let n of e.document.paragraphs){r(n.style?.paints);for(let a of n.inlines)a.kind==="text"&&r(a.style?.paints)}return[...new Map(t.map(n=>[z(n),n])).values()]}function Ce(e,t){return t.stableId([t.trackId,t.presentId,"text-paint",z(e)])}function St(e,t){return e.kind==="solid"?e.color:`url(#${Ce(e,t)})`}function Tt(e,t){return $t(e).flatMap(r=>{if(r.kind==="solid")return[];let n=r.stops.map(s=>`<stop offset="${c(s.offset*100)}%" stop-color="${t.escape(s.color)}" stop-opacity="${c(s.opacity)}"/>`).join(""),a=Ce(r,t);if(r.kind==="radial-gradient")return[`<radialGradient id="${a}" cx="${c(r.center.x*100)}%" cy="${c(r.center.y*100)}%" r="70.710678%">${n}</radialGradient>`];let i=(r.angleDeg-90)*Math.PI/180,o=Math.cos(i)*50,l=Math.sin(i)*50;return[`<linearGradient id="${a}" x1="${c(50-o)}%" y1="${c(50-l)}%" x2="${c(50+o)}%" y2="${c(50+l)}%">${n}</linearGradient>`]}).join("")}function Pt(e,t){return e===void 0?["fill:transparent","stroke:none","filter:none"]:e.kind==="fill"?[`fill:${St(e.paint,t)}`,"stroke:none","filter:none"]:(oe(e,t),["fill:#ffffff","stroke:none",`filter:url(#${Z(e,t)})`])}function Et(e){let t=N(e.paints).length,r=n=>{for(let a of n??[])if(a.kind==="box")throw new Error("HTML renderer Path Text needs its owning package to render Box Paint itself.");t=Math.max(t,N(n??[]).length)};r(e.paints);for(let n of e.document.paragraphs){r(n.style?.paints);for(let a of n.inlines)a.kind==="text"&&r(a.style?.paints)}return Math.max(1,t)}function Rt(e,t,r){let n={paragraph:0,run:0,word:0,grapheme:0};return e.document.paragraphs.map((a,i)=>{let o=n.paragraph++,l=O(e.typography,a.style),s=a.style?.paints??e.paints,d=a.inlines.map(m=>{if(m.kind==="break")return" ";let h=n.run++,p=O(l,m.style),f=m.style?.paints??s,g=N(f)[r],k=se(m.text,m.language??p.language).map(I=>{if(!I.wordLike)return U(I.text,m.language??p.language).map(T=>{let v=n.grapheme++;return`<tspan data-clipkin-text-unit-grapheme="${v}"${S(H(e,"grapheme",v,t),t.escape)}>${t.escape(T)}</tspan>`}).join("");let b=n.word++,y=U(I.text,m.language??p.language).map(T=>{let v=n.grapheme++;return`<tspan data-clipkin-text-unit-grapheme="${v}"${S(H(e,"grapheme",v,t),t.escape)}>${t.escape(T)}</tspan>`}).join("");return`<tspan data-clipkin-text-unit-word="${b}"${S(H(e,"word",b,t),t.escape)}>${y}</tspan>`}).join(""),x=[...K(p,t.exactFontFamily),...Pt(g,t),...H(e,"run",h,t)];return`<tspan data-clipkin-text-unit-run="${h}" ${_(p,t.escape,m.language,m.direction)}${S(x,t.escape)}>${k}</tspan>`}).join("");return`${i===0?"":" "}<tspan data-clipkin-text-unit-paragraph="${o}"${S(H(e,"paragraph",o,t),t.escape)}>${d}</tspan>`}).join("")}function Me(e,t){kt(e);let r=`data-clipkin-text-clock data-clipkin-text-start-frame="${t.presentStartFrame}" data-clipkin-text-duration-frames="${t.durationFrames}" data-clipkin-text-frame-numerator="${t.programNumerator}" data-clipkin-text-frame-denominator="${t.programDenominator}"`,n=e.sequences.length===0?"":` data-clipkin-text-sequences="${t.escape(JSON.stringify(e.sequences))}"`;if(e.kind==="path-text"){let d=t.stableId([t.trackId,t.presentId,e.id,"path"]),u=e.align==="start"?"start":e.align==="end"?"end":"middle",m=e.marginAnimation?.keyframes[0]?.startMarginPx??(e.align==="start"?e.startMarginPx:e.align==="end"?"100%":"50%"),h=e.marginAnimation===void 0?` data-clipkin-text-path-placement="${t.escape(JSON.stringify({align:e.align,startMarginPx:e.startMarginPx,endMarginPx:e.endMarginPx}))}"`:` data-clipkin-text-path-margin="${t.escape(JSON.stringify({startFrame:t.presentStartFrame,numerator:t.programNumerator,denominator:t.programDenominator,align:e.align,endMarginPx:e.endMarginPx,keyframes:e.marginAnimation.keyframes}))}"`,p=Et(e),f=Array.from({length:p},(g,k)=>{let x=[...K(e.typography,t.exactFontFamily),"fill:transparent","stroke:none"].join(";");return`<text aria-hidden="${k===p-1?"false":"true"}" data-clipkin-text-path-paint-layer="${k}" style="${t.escape(x)}" text-anchor="${u}" dominant-baseline="central"><textPath href="#${d}" startOffset="${typeof m=="number"?c(m):m}" side="${e.side}"${h}${e.orientation==="upright"?' data-clipkin-text-path-upright="true"':""}>${Rt(e,t,k)}</textPath></text>`}).join("");return`<svg ${t.commonAttributes} ${r}${n} ${_(e.typography,t.escape)} width="100%" height="100%" style="${t.escape(`${t.baseStyle};overflow:${e.overflow==="clip"?"hidden":"visible"}`)}"><defs><path id="${d}" d="${t.escape(vt(e.reverse?Ft(e.path):e.path))}"/>${Tt(e,t)}${Ee(e,t)}</defs>${f}</svg>`}let a=[t.baseStyle,"display:flex",`align-items:${e.flow.blockAlign==="start"?"flex-start":e.flow.blockAlign==="end"?"flex-end":"center"}`,`justify-content:${e.flow.inlineAlign==="start"?"flex-start":e.flow.inlineAlign==="end"?"flex-end":"center"}`,...e.flow.clipToFrame?["overflow:hidden"]:[],...M(e.paints,"frame")],i=["position:relative",...yt(e),...K(e.typography,t.exactFontFamily),...Pe(e.paints),...M(e.paints,"content")],o=e.sequences.filter(d=>d.unit==="line"),l=[`data-clipkin-text-overflow="${e.flow.overflow}"`,`data-clipkin-text-inline-size="${e.flow.inlineSize}"`,`data-clipkin-text-block-size="${e.flow.blockSize}"`,`data-clipkin-text-inline-align="${e.flow.inlineAlign}"`,`data-clipkin-text-block-align="${e.flow.blockAlign}"`,`data-clipkin-text-writing-mode="${e.typography.writingMode}"`,...e.flow.minimumScale===void 0?[]:[`data-clipkin-text-minimum-scale="${c(e.flow.minimumScale)}"`],...e.flow.maxLines===void 0?[]:[`data-clipkin-text-max-lines="${e.flow.maxLines}"`]].join(" "),s=o.length===0?"":` data-clipkin-text-line-sequences="${t.escape(JSON.stringify(o))}"`;return`<div ${t.commonAttributes} ${r}${n} ${_(e.typography,t.escape)} style="${t.escape(a.join(";"))}">${gt(e,t)}${V(e.paints,"frame",t)}<div data-clipkin-text-flow ${l}${s}${S(i,t.escape)}>${V(e.paints,"content",t)}${wt(e.document,e,t)}</div></div>`}function le(e){let t=[...e.typography.fonts];for(let n of e.document.paragraphs){t.push(...n.style?.typography?.fonts??[]);for(let a of n.inlines)a.kind==="text"&&t.push(...a.style?.typography?.fonts??[])}return[...new Map(t.map(n=>[z(n),n])).values()]}var Ve=String.raw`
const reelTextRootSelected = (root) => {
  const startFrame = Number(root.getAttribute('data-clipkin-text-start-frame'));
  const durationFrames = Number(root.getAttribute('data-clipkin-text-duration-frames'));
  if (!Number.isSafeInteger(startFrame) || !Number.isSafeInteger(durationFrames)
    || startFrame < 0 || durationFrames <= 0 || !Number.isSafeInteger(startFrame + durationFrames)) {
    throw new Error('Invalid terminal Text Present span.');
  }
  return htmlSelectionOverlaps(startFrame, startFrame + durationFrames);
};
const reelSelectedTextElements = (selector) => [...document.querySelectorAll(selector)].filter((element) => {
  const root = element.closest('[data-clipkin-text-clock]');
  if (!root) throw new Error('Terminal Text layout work is outside its frame clock root.');
  return reelTextRootSelected(root);
});
const reelTextEase = (name, value) => {
  if (name === 'ease-in') return value * value;
  if (name === 'ease-out') return 1 - (1 - value) * (1 - value);
  if (name === 'ease-in-out') return value < 0.5 ? 2 * value * value : 1 - Math.pow(-2 * value + 2, 2) / 2;
  return value;
};
const reelUpdateUprightTextPaths = () => {
  for (const path of reelSelectedTextElements('[data-clipkin-text-path-upright]')) {
    for (const glyph of path.querySelectorAll('[data-clipkin-text-unit-grapheme]')) {
      try {
        glyph.removeAttribute('rotate');
        const pathRotation = glyph.getRotationOfChar(0);
        glyph.setAttribute('rotate', String(-pathRotation));
      } catch (error) {
        throw new Error('Upright Path Text could not resolve exact glyph orientation.', { cause: error });
      }
    }
  }
};
const reelUpdateStaticTextPathPlacements = () => {
  for (const textPath of reelSelectedTextElements('[data-clipkin-text-path-placement]')) {
    const data = JSON.parse(textPath.getAttribute('data-clipkin-text-path-placement'));
    const href = textPath.getAttribute('href');
    const path = href && document.getElementById(href.slice(1));
    if (!path || typeof path.getTotalLength !== 'function') throw new Error('Path Text cannot resolve its owned vector path.');
    const length = path.getTotalLength();
    const start = data.startMarginPx;
    const end = length - data.endMarginPx;
    if (end < start) throw new Error('Path Text margins exceed the owned path length.');
    textPath.setAttribute('startOffset', String(data.align === 'start' ? start : data.align === 'end' ? end : (start + end) / 2));
  }
};
const reelUpdateTextPathMargins = (programFrame) => {
  for (const path of reelSelectedTextElements('[data-clipkin-text-path-margin]')) {
    const data = JSON.parse(path.getAttribute('data-clipkin-text-path-margin'));
    const frames = data.keyframes;
    // The page ABI already supplies the authored integer frame; no seconds
    // conversion or worker history participates in package-owned motion.
    const local = programFrame - data.startFrame;
    let value = frames[0].startMarginPx;
    if (local >= frames[frames.length - 1].atFrame) value = frames[frames.length - 1].startMarginPx;
    else {
      for (let index = 0; index < frames.length - 1; index += 1) {
        const left = frames[index];
        const right = frames[index + 1];
        if (local < left.atFrame || local > right.atFrame) continue;
        const progress = reelTextEase(left.easing || 'linear', (local - left.atFrame) / (right.atFrame - left.atFrame));
        value = left.startMarginPx + (right.startMarginPx - left.startMarginPx) * progress;
        break;
      }
    }
    const href = path.getAttribute('href');
    const geometry = href && document.getElementById(href.slice(1));
    if (!geometry || typeof geometry.getTotalLength !== 'function') throw new Error('Animated Path Text cannot resolve its owned vector path.');
    const end = geometry.getTotalLength() - data.endMarginPx;
    if (end < value) throw new Error('Animated Path Text margins exceed the owned path length.');
    path.setAttribute('startOffset', String(data.align === 'start' ? value : data.align === 'end' ? end : (value + end) / 2));
  }
  reelUpdateUprightTextPaths();
};
const reelTextPropertyName = (name) => {
  if (name === '-webkit-text-fill-color') return 'webkitTextFillColor';
  if (name === '-webkit-text-stroke-color') return 'webkitTextStrokeColor';
  if (name === 'background-color') return 'backgroundColor';
  return name;
};
const reelTextSeededOrder = (length, seed) => {
  const result = Array.from({ length }, (_, index) => index);
  let state = seed >>> 0;
  for (let index = result.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const selected = state % (index + 1);
    [result[index], result[selected]] = [result[selected], result[index]];
  }
  return result;
};
const reelTextPrepareSequence = (sequence) => {
  const length = sequence.range.endExclusive - sequence.range.start;
  let rankByLocalIndex;
  if (sequence.order !== 'forward' && sequence.order !== 'reverse') {
    rankByLocalIndex = new Array(length);
    for (const [rank, local] of reelTextSeededOrder(length, sequence.seed || 0).entries()) {
      rankByLocalIndex[local] = rank;
    }
  }
  const keyframes = sequence.keyframes.map((point) => {
    const frame = { offset: point.atProgress, ...(point.easing ? { easing: point.easing } : {}) };
    for (const declaration of point.style) frame[reelTextPropertyName(declaration.name)] = declaration.value;
    return frame;
  });
  return { ...sequence, rankByLocalIndex, nativeKeyframes: keyframes };
};
const reelTextSequenceRank = (sequence, index) => {
  if (index < sequence.range.start || index >= sequence.range.endExclusive) return null;
  const length = sequence.range.endExclusive - sequence.range.start;
  const local = index - sequence.range.start;
  if (sequence.order === 'forward') return local;
  if (sequence.order === 'reverse') return length - 1 - local;
  return sequence.rankByLocalIndex[local];
};
const reelTextSequenceClock = (sequence, rank, frame) => {
  const start = sequence.startFrame + rank * sequence.staggerFrames;
  const end = start + sequence.unitDurationFrames * sequence.cycles;
  if (frame <= start) return 0;
  if (frame >= end) return sequence.unitDurationFrames;
  // Every cycle is a half-open interval. At an exact cycle boundary the next
  // cycle begins at progress zero; the result therefore depends only on this
  // absolute authored frame, never on which partition rendered the previous
  // frame. A repeated keyframe-offset list cannot express that law reliably
  // across fresh and incrementally-seeked browser animation instances.
  return (frame - start) % sequence.unitDurationFrames;
};
const reelTextUnitSelector = '[data-clipkin-text-unit-paragraph],[data-clipkin-text-unit-run],[data-clipkin-text-unit-word],[data-clipkin-text-unit-grapheme]';
let reelTextAnimationIndex = htmlCreateFrameWorkIndex([]);
let reelTextAnimationFrameRate;
const reelPrepareTextRootApplications = (prepared) => {
  if (prepared.units !== undefined) return prepared.units;
  const sequences = JSON.parse(prepared.encodedSequences || '[]').map(reelTextPrepareSequence);
  prepared.units = [...prepared.root.querySelectorAll(reelTextUnitSelector)].map((unit) => {
    const applications = [];
    for (const sequence of sequences) {
      const attribute = sequence.unit === 'line' ? 'data-clipkin-text-physical-line' : 'data-clipkin-text-unit-' + sequence.unit;
      if (!unit.hasAttribute(attribute)) continue;
      const index = Number(unit.getAttribute(attribute));
      const rank = Number.isSafeInteger(index) ? reelTextSequenceRank(sequence, index) : null;
      if (rank === null) continue;
      const animation = unit.animate(sequence.nativeKeyframes, { duration: sequence.unitDurationFrames, fill: 'both', iterations: 1 });
      animation.pause();
      animation.currentTime = 0;
      applications.push({ sequence, rank, animation });
    }
    return { applications };
  }).filter((unit) => unit.applications.length > 0);
  return prepared.units;
};
const reelPrepareTextUnitAnimations = () => {
  const work = [...document.querySelectorAll('[data-clipkin-text-clock][data-clipkin-text-sequences]')]
    .filter(reelTextRootSelected).map((root, order) => {
    const startFrame = Number(root.getAttribute('data-clipkin-text-start-frame'));
    const numerator = Number(root.getAttribute('data-clipkin-text-frame-numerator'));
    const denominator = Number(root.getAttribute('data-clipkin-text-frame-denominator'));
    const durationFrames = Number(root.getAttribute('data-clipkin-text-duration-frames'));
    if (!Number.isSafeInteger(startFrame) || !Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator)
      || !Number.isSafeInteger(durationFrames) || numerator <= 0 || denominator <= 0 || durationFrames <= 0) {
      throw new Error('Invalid terminal Text animation clock.');
    }
    if (reelTextAnimationFrameRate === undefined) reelTextAnimationFrameRate = { numerator, denominator };
    else if (reelTextAnimationFrameRate.numerator !== numerator || reelTextAnimationFrameRate.denominator !== denominator) {
      throw new Error('Terminal Text roots disagree on the Program frame rate.');
    }
    return {
      startFrame,
      endFrameExclusive: startFrame + durationFrames,
      order,
      payload: {
        root,
        encodedSequences: root.getAttribute('data-clipkin-text-sequences') || '[]',
        units: undefined,
      },
    };
  });
  reelTextAnimationIndex = htmlCreateFrameWorkIndex(work);
};
const reelSeekTextUnitAnimations = (programFrame) => {
  if (reelTextAnimationFrameRate === undefined) return;
  for (const work of reelTextAnimationIndex.at(programFrame)) {
    const units = reelPrepareTextRootApplications(work.payload);
    const localFrame = programFrame - work.startFrame;
    for (const preparedUnit of units) {
      for (const application of preparedUnit.applications) {
        const { sequence, rank, animation } = application;
        const clock = reelTextSequenceClock(sequence, rank, localFrame);
        animation.currentTime = clock;
      }
    }
  }
};
let reelTextAbsoluteFrame = 0;
let reelTextReady = false;
const reelApplyTextFrame = (frame) => {
    reelTextAbsoluteFrame = Math.max(0, Number(frame) || 0);
    if (reelTextReady) {
      reelSeekTextUnitAnimations(reelTextAbsoluteFrame);
      reelUpdateTextPathMargins(reelTextAbsoluteFrame);
      // Attribute changes on SVG text paths and browser text layout are
      // sampled synchronously for the exact authored frame. Do not wait for a
      // requestAnimationFrame from HTML renderer' seek barrier: capture is
      // paused behind that barrier, so doing so would deadlock both clocks.
      document.documentElement.getBoundingClientRect();
    }
};
const reelTextLayoutReady = document.fonts.ready.then(() => {
  reelUpdateStaticTextPathPlacements();
  reelUpdateUprightTextPaths();
  const physicalLines = (flow) => {
    const values = [];
    const vertical = flow.getAttribute('data-clipkin-text-writing-mode') !== 'horizontal-tb';
    for (const glyph of flow.querySelectorAll('[data-clipkin-text-unit-grapheme]')) {
      const rect = glyph.getBoundingClientRect();
      const axis = vertical ? rect.left : rect.top;
      if (!values.some((value) => Math.abs(value - axis) < 0.5)) values.push(axis);
    }
    return values;
  };
  for (const flow of reelSelectedTextElements('[data-clipkin-text-flow][data-clipkin-text-overflow="ellipsis"]')) {
    if (flow.getAttribute('data-clipkin-text-max-lines') || getComputedStyle(flow).whiteSpace === 'pre') continue;
    const parent = flow.parentElement;
    if (!parent) throw new Error('Ellipsis Text has no placement frame.');
    const vertical = flow.getAttribute('data-clipkin-text-writing-mode') !== 'horizontal-tb';
    const boundary = parent.getBoundingClientRect();
    const groups = [];
    for (const glyph of flow.querySelectorAll('[data-clipkin-text-unit-grapheme]')) {
      const rect = glyph.getBoundingClientRect();
      const axis = vertical ? rect.left : rect.top;
      let group = groups.find((item) => Math.abs(item.axis - axis) < 0.5);
      if (!group) { group = { axis, rects: [] }; groups.push(group); }
      group.rects.push(rect);
    }
    const visible = groups.filter((group) => group.rects.some((rect) => vertical
      ? rect.left >= boundary.left - 0.5 && rect.right <= boundary.right + 0.5
      : rect.top >= boundary.top - 0.5 && rect.bottom <= boundary.bottom + 0.5)).length;
    flow.style.webkitLineClamp = String(Math.max(1, visible));
  }
  for (const flow of reelSelectedTextElements('[data-clipkin-text-flow][data-clipkin-text-overflow="shrink"]')) {
    const minimum = Number(flow.getAttribute('data-clipkin-text-minimum-scale'));
    const maximumLines = Number(flow.getAttribute('data-clipkin-text-max-lines') || '0');
    const inlineSize = flow.getAttribute('data-clipkin-text-inline-size');
    const blockSize = flow.getAttribute('data-clipkin-text-block-size');
    const inlineAlign = flow.getAttribute('data-clipkin-text-inline-align');
    const blockAlign = flow.getAttribute('data-clipkin-text-block-align');
    const parent = flow.parentElement;
    if (!parent || !Number.isFinite(minimum) || minimum <= 0 || minimum > 1
      || (inlineSize !== 'fixed' && inlineSize !== 'hug')
      || (blockSize !== 'fixed' && blockSize !== 'hug')) throw new Error('Invalid bounded Text shrink request.');
    const availableWidth = parent.clientWidth;
    const availableHeight = parent.clientHeight;
    const apply = (scale) => {
      flow.style.position = 'relative';
      flow.style.left = '';
      flow.style.top = '';
      flow.style.zoom = '';
      const inlineOrigin = inlineAlign === 'start' ? 'left' : inlineAlign === 'end' ? 'right' : 'center';
      const blockOrigin = blockAlign === 'start' ? 'top' : blockAlign === 'end' ? 'bottom' : 'center';
      flow.style.transformOrigin = inlineOrigin + ' ' + blockOrigin;
      flow.style.transform = 'scale(' + scale + ')';
      flow.style.width = inlineSize === 'fixed' ? String(100 / scale) + '%' : 'max-content';
      flow.style.height = blockSize === 'fixed' ? String(100 / scale) + '%' : 'max-content';
    };
    const measure = (scale) => {
      apply(scale);
      const lines = physicalLines(flow).length;
      const boundary = parent.getBoundingClientRect();
      const glyphRects = [...flow.querySelectorAll('[data-clipkin-text-unit-grapheme]')]
        .map((glyph) => glyph.getBoundingClientRect());
      const left = glyphRects.length === 0 ? boundary.left : Math.min(...glyphRects.map((rect) => rect.left));
      const right = glyphRects.length === 0 ? boundary.left : Math.max(...glyphRects.map((rect) => rect.right));
      const top = glyphRects.length === 0 ? boundary.top : Math.min(...glyphRects.map((rect) => rect.top));
      const bottom = glyphRects.length === 0 ? boundary.top : Math.max(...glyphRects.map((rect) => rect.bottom));
      const width = right - left;
      const height = bottom - top;
      return {
        fits: left >= boundary.left - 0.5
          && right <= boundary.right + 0.5
          && top >= boundary.top - 0.5
          && bottom <= boundary.bottom + 0.5
          && (maximumLines === 0 || lines <= maximumLines),
        width, height, lines,
        offsets: {
          left: left - boundary.left,
          right: boundary.right - right,
          top: top - boundary.top,
          bottom: boundary.bottom - bottom,
        },
      };
    };
    const fullSizeMeasurement = measure(1);
    if (fullSizeMeasurement.fits) {
      apply(1);
      flow.setAttribute('data-clipkin-text-shrink-scale', '1.00000000');
      continue;
    }
    const minimumMeasurement = measure(minimum);
    if (!minimumMeasurement.fits) throw new Error('Text cannot fit at its authored minimum scale: '
      + minimumMeasurement.width.toFixed(2) + 'x' + minimumMeasurement.height.toFixed(2)
      + ' in ' + availableWidth + 'x' + availableHeight + ', lines=' + minimumMeasurement.lines
      + ', offsets=' + JSON.stringify(minimumMeasurement.offsets)
      + (maximumLines === 0 ? '' : ', maxLines=' + maximumLines) + '.');
    let low = minimum;
    let high = 1;
    for (let index = 0; index < 20; index += 1) {
      const middle = (low + high) / 2;
      if (measure(middle).fits) low = middle;
      else high = middle;
    }
    apply(low);
    flow.setAttribute('data-clipkin-text-shrink-scale', low.toFixed(8));
  }
  for (const flow of reelSelectedTextElements('[data-clipkin-text-flow][data-clipkin-text-line-sequences]')) {
    const sequences = JSON.parse(flow.getAttribute('data-clipkin-text-line-sequences') || '[]');
    const glyphs = [...flow.querySelectorAll('[data-clipkin-text-unit-grapheme]')];
    const vertical = flow.getAttribute('data-clipkin-text-writing-mode') !== 'horizontal-tb';
    const axes = [];
    const lineOf = new Map();
    for (const glyph of glyphs) {
      const rect = glyph.getBoundingClientRect();
      const axis = vertical ? rect.left : rect.top;
      let line = axes.findIndex((value) => Math.abs(value - axis) < 0.5);
      if (line < 0) { line = axes.length; axes.push(axis); }
      lineOf.set(glyph, line);
    }
    for (const sequence of sequences) {
      if (sequence.range.endExclusive > axes.length) throw new Error('Text line sequence selects a line that does not exist.');
    }
    for (let line = 0; line < axes.length; line += 1) {
      const members = glyphs.filter((glyph) => lineOf.get(glyph) === line);
      const rects = members.map((glyph) => glyph.getBoundingClientRect());
      const left = Math.min(...rects.map((rect) => rect.left));
      const right = Math.max(...rects.map((rect) => rect.right));
      const top = Math.min(...rects.map((rect) => rect.top));
      const bottom = Math.max(...rects.map((rect) => rect.bottom));
      for (const [memberIndex, glyph] of members.entries()) {
        const rect = rects[memberIndex];
        glyph.style.transformOrigin = String((left + right) / 2 - rect.left) + 'px ' + String((top + bottom) / 2 - rect.top) + 'px';
        glyph.setAttribute('data-clipkin-text-physical-line', String(line));
      }
    }
  }
  reelPrepareTextUnitAnimations();
  reelTextReady = true;
  reelApplyTextFrame(reelTextAbsoluteFrame);
});
window.addEventListener('clipkin-frame', (event) => {
  if (!event?.detail || typeof event.detail.waitUntil !== 'function') return;
  reelApplyTextFrame(event.detail.frame);
  // HTML renderer requires waitUntil to be registered synchronously while the
  // seek event is dispatched. The Promise itself waits for exact fonts and
  // deterministic static layout validation. Per-frame sampling is synchronous
  // inside the registered timeline and forces layout before it returns. A
  // rejected layout (for example bounded shrink below the authored minimum)
  // therefore rejects the render instead of becoming an unobserved Promise.
  event.detail.waitUntil(reelTextLayoutReady);
});
`;var ce=1000000000n,Le=/clipkin-resource:\/\/(res_[a-zA-Z0-9._:-]+)/gu,Ct=/data-clipkin-surface-resource="(res_[a-zA-Z0-9._:-]+)"/gu;function $(e){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function W(e,t,r){let n=BigInt(e)*BigInt(r)*ce/BigInt(t),a=n/ce,i=n%ce;return i===0n?String(a):`${a}.${String(i).padStart(9,"0").replace(/0+$/u,"")}`}function Mt(e,t){let r=1000000000000n,n=BigInt(e)*r/BigInt(t),a=n/r,i=n%r;return i===0n?String(a):`${a}.${String(i).padStart(12,"0").replace(/0+$/u,"")}`}function Ne(e,t){return t===1?String(e):`${e}/${t}`}function me(e,t){let r=BigInt(e.sourceAtStart.denominator)*BigInt(e.rate.denominator),n=BigInt(e.sourceAtStart.numerator)*BigInt(e.rate.denominator)+BigInt(t)*BigInt(e.rate.numerator)*BigInt(e.sourceAtStart.denominator);if(e.wrap===void 0){if(n<0n||n>BigInt(Number.MAX_SAFE_INTEGER)||r>BigInt(Number.MAX_SAFE_INTEGER))throw new Error("HTML renderer visual source time is too large for safe arithmetic.");return{position:{numerator:Number(n),denominator:Number(r)},cycle:0n}}let a=BigInt(e.wrap.startFrame)*r,i=BigInt(e.wrap.endFrameExclusive-e.wrap.startFrame)*r,o=n-a,l=o>=0n?o/i:-((-o+i-1n)/i),s=(o%i+i)%i,d=a+s;if(d>BigInt(Number.MAX_SAFE_INTEGER)||r>BigInt(Number.MAX_SAFE_INTEGER))throw new Error("HTML renderer visual sampling is too large for safe arithmetic.");return{position:{numerator:Number(d),denominator:Number(r)},cycle:l}}function Vt(e){let t=e.target.endFrameExclusive-e.target.startFrame,r=[];if(e.rate.numerator===0||e.wrap===void 0)return[{startFrame:e.target.startFrame,endFrameExclusive:e.target.endFrameExclusive,sourceFrame:me(e,0).position}];let n=0;for(;n<t;){let a=me(e,n),i=n+1,o=t;for(;i<o;){let l=i+Math.floor((o-i)/2),s=me(e,l).cycle;(e.rate.numerator>0?s>a.cycle:s<a.cycle)?o=l:i=l+1}r.push({startFrame:e.target.startFrame+n,endFrameExclusive:e.target.startFrame+i,sourceFrame:a.position}),n=i}return r}function Ht(e,t){let r=1000000000n,n=BigInt(e)*100n*r/BigInt(t),a=n/r,i=n%r;return i===0n?`${a}%`:`${a}.${String(i).padStart(9,"0").replace(/0+$/u,"")}%`}function ge(e){if(!fe(e))throw new Error("HTML renderer Resource id is not valid.");return`clipkin-resource://${e}`}function G(e,t){return`data-clipkin-resource-${e}="${$(ge(t))}"`}function je(e){return e.map(({name:t,value:r})=>`${t}:${String(r)}`).join(";")}function B(e,t){let r=e.find(i=>i.name===t)?.value;if(typeof r!="string"||/^(?:0|[1-9][0-9]*(?:\.[0-9]+)?)px$/u.exec(r)===null)return;let a=Number.parseFloat(r.slice(0,-2));return Number.isFinite(a)&&a>0?a:void 0}function Oe(e){return(e??[]).map(({name:t,value:r})=>` ${t}="${$(r)}"`).join("")}function qt(){let e=new Map;return t=>{let r=D(t),n=e.get(r);if(n!==void 0)return n;let a=`clipkin-${e.size+1}`;return e.set(r,a),a}}function he(e,t){return t(["font",D(e)])}function Lt(e,t){if(e.kind!=="text")return[];let r=e.fonts[0];return[`font-family:${e.fonts.map(n=>he(n,t)).join(",")}`,`font-weight:${r.weight}`,`font-style:${r.style}`,"font-synthesis:none"]}function He(e,t){let r=t.stableId([t.trackId,t.presentId,e.id]),n=e.animation===void 0?void 0:t.stableId(["animation",t.trackId,t.presentId,e.id]),a=e.animation===void 0?t.presentDurationFrames:Math.max(t.presentDurationFrames,e.animation.keyframes.at(-1)?.atFrame??0),i=W(a,t.programNumerator,t.programDenominator),o=[je(e.style),...Lt(e,t.stableId),...n===void 0?[]:[`animation-name:${n}`,`animation-duration:${i}s`,"animation-fill-mode:both","animation-play-state:paused","animation-timing-function:linear"]].filter(Boolean).join(";"),l=`id="${r}" data-clipkin-element-id="${$(e.id)}"${Oe(e.attributes)}`,s=n===void 0?"":` data-clipkin-frame-animation data-clipkin-animation-start-frame="${t.presentStartFrame}" data-clipkin-animation-sample-frames="${t.presentDurationFrames}"`,d=`${l}${s} style="${$(o)}"`;return{inlineStyle:o,commonAttributes:`${l}${s}`,common:d}}function Q(e,t,r){let{inlineStyle:n,commonAttributes:a,common:i}=He(e,r),o=r.stableId([r.trackId,r.presentId,e.id]);if(e.kind==="mask"){let u=t.get(e.id)??[],m=u.find(b=>b.id===e.maskElement),h=u.find(b=>b.id===e.contentElement);if(m===void 0||h===void 0||u.length!==2)throw new Error(`Local mask ${e.id} lacks the owned roots it declares.`);let p=r.stableId([r.trackId,r.presentId,e.id,"mask"]),f=B(e.style,"width"),g=B(e.style,"height"),k=f===void 0||g===void 0?"":` viewBox="0 0 ${f} ${g}" preserveAspectRatio="none"`,x=b=>Q(b,t,r);if((t.get(m.id)??[]).length!==0)throw new Error(`Local mask ${e.id} needs a single terminal owned element as its mask source.`);let I=(()=>{let b=He(m,r);if(m.kind==="text"){let y=m.style.find(te=>te.name==="text-align")?.value,T=y==="right"||y==="end"?"end":y==="left"||y==="start"?"start":"middle",v=m.style.find(te=>te.name==="align-items")?.value,w=B(m.style,"padding-left")??0,F=B(m.style,"padding-right")??0,R=B(m.style,"padding-top")??0,j=B(m.style,"padding-bottom")??0,_e=f===void 0?T==="start"?"0":T==="end"?"100%":"50%":String(T==="start"?w:T==="end"?f-F:(w+f-F)/2),Ue=g===void 0?v==="flex-start"?"0":v==="flex-end"?"100%":"50%":String(v==="flex-start"?R:v==="flex-end"?g-j:(R+g-j)/2),Ge=v==="flex-start"?"text-before-edge":v==="flex-end"?"text-after-edge":"central",We=`${b.inlineStyle};fill:currentColor`;return`<text ${b.commonAttributes} x="${_e}" y="${Ue}" text-anchor="${T}" dominant-baseline="${Ge}" style="${$(We)}">${$(m.text)}</text>`}if(m.kind==="text-flow"||m.kind==="path-text")return`<foreignObject x="0" y="0" width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml" style="position:relative;width:100%;height:100%">${x(m)}</div></foreignObject>`;if(m.kind==="image")return`<image ${b.common} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" ${G("href",m.artifact.resource)}/>`;if(m.kind==="surface"&&m.surface.timing.kind==="still")return`<image ${b.common} data-clipkin-surface-resource="${m.surface.artifact.resource}" x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" ${G("href",m.surface.artifact.resource)}/>`;throw new Error(`Local mask ${e.id} needs its mask source to be a terminal owned text, image or still Surface.`)})();return`<svg ${i}${k} width="100%" height="100%" overflow="visible"><defs><mask id="${p}" x="0" y="0" width="100%" height="100%" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" style="mask-type:${e.mode}">${I}</mask></defs><foreignObject x="0" y="0" width="100%" height="100%" mask="url(#${p})"><div xmlns="http://www.w3.org/1999/xhtml" style="position:relative;width:100%;height:100%">${x(h)}</div></foreignObject></svg>`}if(e.kind==="program"){let u=ne(e.program),m=new Map((t.get(e.id)??[]).map(h=>[h.id,Q(h,t,r)]));return`<div ${i}>${we(u,m)}</div>`}let l=(t.get(e.id)??[]).map(u=>Q(u,t,r)).join("");if(e.kind==="box")return`<div ${i}>${l}</div>`;let s={trackId:r.trackId,presentId:r.presentId,durationFrames:r.presentDurationFrames,durationSeconds:r.presentDuration,presentStartFrame:r.presentStartFrame,programNumerator:r.programNumerator,programDenominator:r.programDenominator,escape:$,stableId:r.stableId,exactFontFamily:u=>he(u,r.stableId),baseStyle:n,commonAttributes:a,emittedFilterIds:r.emittedFilterIds,sharedGlyphFilterDefinitions:r.sharedGlyphFilterDefinitions};if(e.kind==="text"){let u=e.paints===void 0?$(e.text):Ae(e.text,e.paints,s);return`<div ${i}>${u}${l}</div>`}if(e.kind==="text-flow"||e.kind==="path-text")return Me(e,s);if((e.kind==="video"||e.kind==="surface")&&e.sourceTime!==void 0){let u=e.kind==="surface"?e.surface.artifact:e.artifact,m=0;return e.sourceTime.pieces.flatMap(h=>Vt(h).map(p=>{m+=1;let f=r.presentStartFrame+p.startFrame,g=p.endFrameExclusive-p.startFrame,k=`${o}-sample-${String(m).padStart(4,"0")}`;return r.frameSources.push({id:k,resource:u.resource,startFrame:f,endFrameExclusive:f+g,sourceFrame:{...p.sourceFrame},sourceRate:{...h.rate},sourceFrameRate:{...e.sourceTime.sourceFrameRate}}),`<video ${[`id="${k}"`,`data-clipkin-element-id="${$(e.id)}"`,`data-clipkin-sampling-part="${m}"`,`data-clipkin-source-frame="${p.sourceFrame.numerator}/${p.sourceFrame.denominator}"`,`data-clipkin-source-rate="${h.rate.numerator}/${h.rate.denominator}"`,`data-clipkin-start-frame="${f}"`,`data-clipkin-end-frame="${f+g}"`,`data-clipkin-source-fps="${e.sourceTime.sourceFrameRate.numerator}/${e.sourceTime.sourceFrameRate.denominator}"`,`style="${$(n)}"`,Oe(e.attributes).trim(),"muted","playsinline",...e.kind==="surface"?[`data-clipkin-surface-resource="${e.surface.artifact.resource}"`,`data-clipkin-alpha-mode="${e.surface.alphaMode}"`,`data-clipkin-color-space="${e.surface.colorSpace}"`,`width="${e.surface.width}"`,`height="${e.surface.height}"`]:[]].filter(Boolean).join(" ")} ${G("src",u.resource)}></video>`})).join("")}if(e.kind==="surface"){let u=[`data-clipkin-surface-resource="${e.surface.artifact.resource}"`,`data-clipkin-alpha-mode="${e.surface.alphaMode}"`,`data-clipkin-color-space="${e.surface.colorSpace}"`,`width="${e.surface.width}"`,`height="${e.surface.height}"`].join(" ");if(e.surface.timing.kind==="still")return`<img ${i} ${u} ${G("src",e.surface.artifact.resource)}/>`;throw new Error(`Timed Surface ${e.id} lacks a source-time map.`)}let d=[e.kind==="video"&&e.muted!==!1?"muted":"",e.kind==="video"?"playsinline":""].filter(Boolean).join(" ");if(e.kind==="image")return`<img ${i} ${d} ${G("src",e.artifact.resource)}/>`;throw new Error(`Timed visual element ${e.id} lacks a source-time map.`)}function Nt(e,t,r,n,a,i,o,l,s){let d=W(t.span.startFrame,n,a),u=W(t.span.endFrameExclusive-t.span.startFrame,n,a),m=new Map;for(let f of t.elements){if(f.parent===void 0)continue;let g=m.get(f.parent)??[];g.push(f),m.set(f.parent,g)}for(let f of m.values())f.sort((g,k)=>g.order-k.order||g.id.localeCompare(k.id));let h=t.elements.find(f=>f.parent===void 0),p=Q(h,m,{trackId:e.id,presentId:t.id,presentStart:d,presentDuration:u,presentDurationFrames:t.span.endFrameExclusive-t.span.startFrame,presentStartFrame:t.span.startFrame,programNumerator:n,programDenominator:a,stackIndex:r,emittedFilterIds:i,sharedGlyphFilterDefinitions:o,stableId:l,frameSources:s});return`<div class="clipkin-visual-present" data-clipkin-track-id="${$(e.id)}" data-clipkin-present-id="${$(t.id)}" data-clipkin-present-start-frame="${t.span.startFrame}" data-clipkin-present-end-frame="${t.span.endFrameExclusive}" data-clipkin-present-order="${t.order}" data-clipkin-z="${t.z}" style="position:absolute;inset:0;z-index:${r};overflow:hidden;pointer-events:none">${t.visibility===void 0?p:`<div data-clipkin-visibility="${$(JSON.stringify(t.visibility))}" style="position:absolute;inset:0">${p}</div>`}</div>`}function jt(e,t,r){let n=t.span.endFrameExclusive-t.span.startFrame;return t.elements.flatMap(a=>{if(a.animation===void 0)return[];let i=Math.max(n,a.animation.keyframes.at(-1)?.atFrame??0),o=r(["animation",e.id,t.id,a.id]),s=(a.animation.keyframes.at(-1)?.atFrame===i?a.animation.keyframes:[...a.animation.keyframes,{atFrame:i,style:a.animation.keyframes.at(-1).style}]).map(d=>{let u=d.easing===void 0?"":`;animation-timing-function:${d.easing}`;return`${Ht(d.atFrame,i)}{${je(d.style)}${u}}`}).join("");return[`@keyframes ${o}{${s}}`]})}function Ot(e){return e.filter(t=>t.kind==="visual").flatMap(t=>t.presents.map(r=>({track:t,present:r}))).sort((t,r)=>t.present.z-r.present.z||t.track.id.localeCompare(r.track.id)||t.present.order-r.present.order||t.present.id.localeCompare(r.present.id))}function ze(e){let t=[];for(let r of[...e].sort((n,a)=>n.startFrame-a.startFrame||n.endFrameExclusive-a.endFrameExclusive)){let n=t.at(-1);n!==void 0&&r.startFrame<=n.endFrameExclusive?t[t.length-1]={startFrame:n.startFrame,endFrameExclusive:Math.max(n.endFrameExclusive,r.endFrameExclusive)}:t.push({...r})}return t}function zt(e){let t=new Map,r=(n,a)=>{let i={kind:"blob",resource:n.resource,size:n.size,mediaType:n.mediaType},o=t.get(n.resource);if(o!==void 0&&(o.artifact.size!==i.size||o.artifact.mediaType!==i.mediaType))throw new Error(`HTML renderer Artifact ${n.resource} carries metadata that disagrees.`);let l=o??{artifact:i,always:!1,spans:[]};a==="always"?l.always=!0:l.always||l.spans.push({...a}),t.set(n.resource,l)};for(let n of e.tracks)if(n.kind!=="audio")for(let a of n.presents)for(let i of a.elements){if((i.kind==="image"||i.kind==="video")&&r(i.artifact,a.span),i.kind==="surface"&&r(i.surface.artifact,a.span),i.kind==="program")for(let o of i.program.artifacts)r(o,"always");if(i.kind==="text")for(let o of i.fonts??[])for(let l of o.sources)r(l.artifact,"always");if(i.kind==="text-flow"||i.kind==="path-text")for(let o of le(i))for(let l of o.sources)r(l.artifact,"always")}return[...t.values()].map(({artifact:n,always:a,spans:i})=>({artifact:n,usage:a?{kind:"always"}:{kind:"frames",spans:ze(i)}})).sort((n,a)=>n.artifact.resource.localeCompare(a.artifact.resource))}function Bt(e){let t=new Map;for(let r of e.tracks)if(r.kind==="visual")for(let n of r.presents)for(let a of n.elements){if(a.kind!=="surface")continue;let i=structuredClone(a.surface),o=t.get(i.artifact.resource);if(o!==void 0&&D(o)!==D(i))throw new Error(`HTML renderer Surface ${i.artifact.resource} is declared in ways that disagree.`);t.set(i.artifact.resource,i)}return[...t.values()].sort((r,n)=>r.artifact.resource.localeCompare(n.artifact.resource))}function Dt(e){let t=new Map;for(let r of e.tracks)if(r.kind==="visual"){for(let n of r.presents)for(let a of n.elements)if(a.kind==="text")for(let i of a.fonts??[])t.set(D(i),i)}for(let r of e.tracks)if(r.kind==="visual"){for(let n of r.presents)for(let a of n.elements)if(!(a.kind!=="text-flow"&&a.kind!=="path-text"))for(let i of le(a))t.set(D(i),i)}return[...t.entries()].sort(([r],[n])=>r.localeCompare(n)).map(([,r])=>r)}function _t(e){return e==="font/woff2"?"woff2":e==="font/woff"?"woff":e==="font/otf"?"opentype":"truetype"}function Ut(e,t){return Dt(e).flatMap(r=>r.sources.map(n=>["@font-face{",`font-family:${he(r,t)};`,`src:url("${ge(n.artifact.resource)}") format("${_t(n.artifact.mediaType)}");`,`font-weight:${r.weight};`,`font-style:${r.style};`,"font-display:block;",...n.unicodeRange===void 0?[]:[`unicode-range:${n.unicodeRange};`],"}"].join(""))).join(`
    `)}function de(e){return e.tracks.some(t=>t.kind==="visual"&&t.presents.some(r=>r.elements.some(n=>n.kind==="text-flow"||n.kind==="path-text")))}function ue(e){return e.tracks.some(t=>t.kind==="visual"&&t.presents.some(r=>r.elements.some(n=>n.animation!==void 0)))}function Gt(e,t){return String.raw`
(() => {
  const numerator = ${e};
  const denominator = ${t};
  const millisecondsPerFrame = denominator * 1000 / numerator;
  const groupsBySpan = new Map();
  for (const element of document.querySelectorAll("[data-clipkin-frame-animation]")) {
    const start = Number(element.getAttribute("data-clipkin-animation-start-frame"));
    const duration = Number(element.getAttribute("data-clipkin-animation-sample-frames"));
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(duration) || start < 0 || duration <= 0) {
      throw new Error("Visual IR frame animation has an invalid Present span.");
    }
    const end = start + duration;
    if (!Number.isSafeInteger(end)) throw new Error("Visual IR frame animation Present span exceeds safe arithmetic.");
    // CSS already keeps every authored animation paused. Only materialize the
    // browser Animation objects which this render can actually sample.
    if (!htmlSelectionOverlaps(start, end)) continue;
    void element.getBoundingClientRect();
    const animation = element.getAnimations()[0];
    if (animation === undefined) throw new Error("Visual IR frame animation did not materialize.");
    // The authored keyframes are already the compact state function. Keep them
    // instead of expanding every Present frame into a second table of
    // computed-style strings in every render Worker, but do not leave the CSS
    // animation live: HTML renderer' css and waapi adapters seek every live
    // document animation to absolute composition time, which replaces this
    // Present-relative pose whenever the Present does not start at frame 0.
    const keyframes = animation.effect.getKeyframes();
    const timing = animation.effect.getTiming();
    const properties = [...new Set(keyframes.flatMap((keyframe) => Object.keys(keyframe)))]
      .filter((name) => name !== "offset" && name !== "computedOffset" && name !== "easing" && name !== "composite");
    animation.cancel();
    element.style.animationName = "none";
    const key = start + ":" + end;
    let work = groupsBySpan.get(key);
    if (work === undefined) {
      work = {
        startFrame: start,
        endFrameExclusive: end,
        order: groupsBySpan.size,
        payload: { animations: [] },
      };
      groupsBySpan.set(key, work);
    }
    work.payload.animations.push({ element, keyframes, timing, properties });
  }
  // The shared index owns only frame-span lookup. Animation materialization and
  // absolute currentTime evaluation remain private to this adapter.
  const workIndex = htmlCreateFrameWorkIndex([...groupsBySpan.values()]);
  const read = (style, name) => name.startsWith("--") ? style.getPropertyValue(name) : style[name];
  const write = (style, name, value) => {
    if (name.startsWith("--")) style.setProperty(name, value);
    else style[name] = value;
  };
  const applyFrame = (programFrame) => {
    const active = [];
    for (const work of workIndex.at(programFrame)) {
      const localTime = (programFrame - work.startFrame) * millisecondsPerFrame;
      // Always derive the pose from the absolute requested frame. Worker
      // partitioning, seek order and the previously rendered frame are not
      // inputs to animation state.
      for (const item of work.payload.animations) active.push({ item, localTime });
    }
    // Evaluate each pose with a transient Animation, read it and cancel it before
    // this seek returns, so no adapter ever sees it. The Animation constructor,
    // unlike Element.animate, is not tracked by HTML renderer' waapi adapter. Only
    // the resulting inline style reaches the captured frame.
    const probes = active.map(({ item, localTime }) => {
      const probe = new Animation(new KeyframeEffect(item.element, item.keyframes, item.timing), document.timeline);
      probe.currentTime = localTime;
      return probe;
    });
    const poses = active.map(({ item }) => {
      const style = getComputedStyle(item.element);
      return item.properties.map((name) => read(style, name));
    });
    for (const probe of probes) probe.cancel();
    active.forEach(({ item }, index) => {
      item.properties.forEach((name, position) => write(item.element.style, name, poses[index][position]));
    });
    void document.documentElement.getBoundingClientRect();
  };
  void document.documentElement.getBoundingClientRect();
  window.addEventListener("clipkin-frame", (event) => applyFrame(event.detail?.frame));
})();`}function Wt(e){return`(() => {
    const presents = [...document.querySelectorAll('[data-clipkin-present-start-frame]')].map(element => ({
      element,
      startFrame: Number(element.getAttribute('data-clipkin-present-start-frame')),
      endFrameExclusive: Number(element.getAttribute('data-clipkin-present-end-frame')),
    }));
    const applyFrame = async frame => {
      if (!Number.isSafeInteger(frame) || frame < 0 || frame >= ${e}) {
        throw new Error('HTML Program frame is outside its domain.');
      }
      for (const present of presents) {
        present.element.style.display = frame >= present.startFrame && frame < present.endFrameExclusive ? '' : 'none';
      }
      const pending = [];
      window.dispatchEvent(new CustomEvent('clipkin-frame', { detail: {
        frame,
        waitUntil(value) { pending.push(Promise.resolve(value)); },
      }}));
      await Promise.all(pending);
      void document.documentElement.getBoundingClientRect();
    };
    Object.defineProperty(window, '__clipkinFrameProgram', { configurable: false, writable: false, value: Object.freeze({
      frameCount: ${e},
      async prepare() { await document.fonts.ready; await applyFrame(0); },
      applyFrame,
    }) });
  })();`}function Jt(e,t,r){let{numerator:n,denominator:a}=t.frameRate,i=Ot(e.tracks),o=new Set,l=[],s=qt(),d=i.map(({track:w,present:F},R)=>Nt(w,F,R,n,a,o,l,s,r)).join(`
    `),u=l.length===0?"":`<svg data-clipkin-document-definitions aria-hidden="true" width="0" height="0" style="position:absolute;overflow:hidden"><defs>${l.join("")}</defs></svg>`,m=i.flatMap(({track:w,present:F})=>jt(w,F,s)).join(`
    `),h=Ut(e,s),p=i.flatMap(({track:w,present:F})=>F.elements.flatMap(R=>R.kind!=="program"?[]:[{id:s([w.id,F.id,R.id]),startFrame:F.span.startFrame,durationFrames:F.span.endFrameExclusive-F.span.startFrame,program:ne(R.program)}])),f=p.map(w=>`@scope (#${w.id}) { ${w.program.css??""} }`).join(`
`),g=i.some(({present:w})=>w.visibility!==void 0),k=p.length===0?"":`<script>${ve(p,n,a)}</script>`,x=g?`<script>${$e(n,a)}</script>`:"",I=W(pe(t),n,a),b=Ne(n,a),y=pe(t),v=`
  <script>
    ${ue(e)||de(e)||p.length>0||g?Se:ae}
  </script>
  <script>${Fe}</script>${ue(e)||de(e)?`
  <script>${ue(e)?`
    ${Gt(n,a)}`:""}${de(e)?`
    ${Ve}`:""}
  </script>`:""}`;return`<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <style>
    html,body{margin:0;width:100%;height:100%;overflow:hidden;background:${e.canvas.clearColor}}
    [data-clipkin-program-root]{position:relative;overflow:hidden;background:${e.canvas.clearColor}}
    *,*::before,*::after{box-sizing:border-box}
    ${h}
    ${m}
    ${f}
  </style>
</head>
<body>
  <div data-clipkin-program-root data-clipkin-program-id="${$(e.id)}" data-clipkin-width="${e.canvas.width}" data-clipkin-height="${e.canvas.height}" data-clipkin-frame-numerator="${n}" data-clipkin-frame-denominator="${a}" data-clipkin-frame-count="${y}" style="width:${e.canvas.width}px;height:${e.canvas.height}px">
    ${u}${u.length===0?"":`
    `}${d}
  </div>${v}${k}
  ${x}
  <script>${Wt(y)}</script>
</body>
</html>
`}function Xt(e){return{visualIr:e.visualIr,frameRate:{...e.frameRate},frameCount:e.frameCount,canvas:{...e.canvas},artifacts:[...e.artifacts].map(t=>({artifact:{...t.artifact},usage:t.usage.kind==="always"?{kind:"always"}:{kind:"frames",spans:t.usage.spans.map(r=>({...r}))}})).sort((t,r)=>t.artifact.resource.localeCompare(r.artifact.resource)),surfaces:[...e.surfaces].map(t=>structuredClone(t)).sort((t,r)=>t.artifact.resource.localeCompare(r.artifact.resource)),frameSources:[...e.frameSources].map(t=>({...t,sourceFrame:{...t.sourceFrame},sourceRate:{...t.sourceRate},sourceFrameRate:{...t.sourceFrameRate}})).sort((t,r)=>t.startFrame-r.startFrame||t.id.localeCompare(r.id)),html:e.html}}function ye(e,t){It(e,t);let r=[];return Xt({visualIr:qe,frameRate:{...t.frameRate},frameCount:pe(t),canvas:{width:e.canvas.width,height:e.canvas.height},artifacts:zt(e),surfaces:Bt(e),frameSources:r,html:Jt(e,t,r)})}function q(e){if(e.visualIr!==qe)throw new Error("HtmlProgram visual IR is not supported.");if(!Number.isSafeInteger(e.frameRate.numerator)||e.frameRate.numerator<=0||!Number.isSafeInteger(e.frameRate.denominator)||e.frameRate.denominator<=0||!Number.isSafeInteger(e.frameCount)||e.frameCount<=0||!Number.isSafeInteger(e.canvas.width)||e.canvas.width<=0||!Number.isSafeInteger(e.canvas.height)||e.canvas.height<=0)throw new Error("HtmlProgram frame domain or canvas is not valid.");if(!e.html.startsWith("<!doctype html>"))throw new Error("HtmlProgram HTML is not valid.");let t=[...e.artifacts];if(t.some(o=>{let l=o?.artifact;return l?.kind!=="blob"||!fe(l.resource)||!Number.isSafeInteger(l.size)||l.size<0||l.mediaType.length===0?!0:o.usage?.kind==="always"?Object.keys(o.usage).length!==1:o.usage?.kind!=="frames"||!Array.isArray(o.usage.spans)||o.usage.spans.length===0||o.usage.spans.some(s=>s===null||typeof s!="object"||!Number.isSafeInteger(s.startFrame)||!Number.isSafeInteger(s.endFrameExclusive)||s.startFrame<0||s.endFrameExclusive<=s.startFrame||s.endFrameExclusive>e.frameCount)?!0:JSON.stringify(ze(o.usage.spans))!==JSON.stringify(o.usage.spans)})||new Set(t.map(o=>o.artifact.resource)).size!==t.length)throw new Error("HtmlProgram Artifact set is not valid.");let r=[...e.html.matchAll(Le)].map(o=>o[1]),n=[...new Set(r)].sort();if(JSON.stringify(n)!==JSON.stringify(t.map(o=>o.artifact.resource).sort()))throw new Error("HtmlProgram Artifact placeholders disagree with its declared dependencies.");if(!Array.isArray(e.surfaces))throw new Error("HtmlProgram Surface set is not valid.");if(!Array.isArray(e.frameSources)||e.frameSources.some(o=>typeof o?.id!="string"||o.id.length===0||!fe(o.resource)||!Number.isSafeInteger(o.startFrame)||!Number.isSafeInteger(o.endFrameExclusive)||o.startFrame<0||o.endFrameExclusive<=o.startFrame||o.endFrameExclusive>e.frameCount||!Number.isSafeInteger(o.sourceFrame?.numerator)||o.sourceFrame.numerator<0||!Number.isSafeInteger(o.sourceFrame?.denominator)||o.sourceFrame.denominator<=0||!Number.isSafeInteger(o.sourceRate?.numerator)||!Number.isSafeInteger(o.sourceRate?.denominator)||o.sourceRate.denominator<=0||!Number.isSafeInteger(o.sourceFrameRate?.numerator)||o.sourceFrameRate.numerator<=0||!Number.isSafeInteger(o.sourceFrameRate?.denominator)||o.sourceFrameRate.denominator<=0||!t.some(l=>l.artifact.resource===o.resource)))throw new Error("HtmlProgram frame-source plan is not valid.");if(new Set(e.frameSources.map(o=>o.id)).size!==e.frameSources.length)throw new Error("HtmlProgram frame-source identities have to be distinct.");let a=new Set;for(let[o,l]of e.surfaces.entries()){if(At(l,`HtmlProgram.surfaces.${o}`),a.has(l.artifact.resource))throw new Error("HtmlProgram Surface set lists an Artifact more than once.");a.add(l.artifact.resource);let s=t.find(d=>d.artifact.resource===l.artifact.resource)?.artifact;if(s===void 0||s.size!==l.artifact.size||s.mediaType!==l.artifact.mediaType)throw new Error("HtmlProgram Surface lacks a binding to its declared Artifact.")}let i=[...new Set([...e.html.matchAll(Ct)].map(o=>o[1]))].sort();if(JSON.stringify(i)!==JSON.stringify([...a].sort()))throw new Error("HtmlProgram Surface markers disagree with its typed dependencies.")}function Yt(e,t){if(q(e),!Number.isSafeInteger(t)||t<0||t>=e.frameCount)throw new Error(`HTML renderer frame ${t} falls outside [0, ${e.frameCount}).`)}function Kt(e,t){if(q(e),!Number.isSafeInteger(t.startFrame)||!Number.isSafeInteger(t.endFrameExclusive)||t.startFrame<0||t.endFrameExclusive<=t.startFrame||t.endFrameExclusive>e.frameCount)throw new Error(`HTML renderer frame span [${t.startFrame}, ${t.endFrameExclusive}) falls outside [0, ${e.frameCount}).`)}function Zt(e,t){if(t.length===0)throw new Error("HTML renderer Artifact selection cannot be empty");let r=0;for(let[n,a]of t.entries()){if(a===null||typeof a!="object"||!Number.isSafeInteger(a.startFrame)||!Number.isSafeInteger(a.endFrameExclusive)||a.startFrame<0||a.endFrameExclusive<=a.startFrame||a.endFrameExclusive>e.frameCount||n>0&&a.startFrame<r)throw new Error("HTML renderer Artifact selection has to consist of ordered, non-overlapping spans within the document frame domain");r=a.endFrameExclusive}}function Qt(e,t){return e.some(r=>{let n=0,a=t.length;for(;n<a;){let i=n+Math.floor((a-n)/2);t[i].endFrameExclusive<=r.startFrame?n=i+1:a=i}return n<t.length&&t[n].startFrame<r.endFrameExclusive})}function er(e,t){return q(e),t===void 0?e.artifacts:(Zt(e,t),e.artifacts.filter(r=>r.usage.kind==="always"||Qt(r.usage.spans,t)))}function tr(e,t){q(e);let r=new Map(e.artifacts.map(n=>[n.artifact.resource,n.artifact]));return e.html.replace(Le,(n,a)=>{let i=r.get(a);if(i===void 0)throw new Error(`HTML renderer Resource ${a} was never declared.`);return $(t(i))})}var rr={frameSeconds:W,fpsDecimal:Mt,fpsRational:Ne};import{isResourceId as nr}from"@clipkin/clipkin/protocol";import{verifyMediaFrameRange as Be}from"@clipkin/media";function De(e){if(!e||typeof e!="object"||Array.isArray(e)||Object.keys(e).some(r=>!["program","frames"].includes(r)))throw new Error("HTML frame request has to name one program and its frames");let t=e;if(q(t.program),!Array.isArray(t.frames)||t.frames.length===0||t.frames.some((r,n)=>!Number.isSafeInteger(r)||r<0||r>=t.program.frameCount||n>0&&r<=t.frames[n-1]))throw new Error(`Frames have to be whole numbers in [0, ${t.program.frameCount}), each larger than the last`)}function ar(e){return De(e),e}function ir(e){if(!Array.isArray(e)||e.length===0||e.some(t=>!t||t.kind!=="blob"||!nr(t.resource)||t.mediaType!=="image/png"||!Number.isSafeInteger(t.size)||t.size<=0))throw new Error("HTML frame images have to be PNG BlobRefs in the order they were requested")}function or(e){if(e===null||typeof e!="object"||Array.isArray(e)||Object.keys(e).some(r=>r!=="program"&&r!=="range"))throw new Error("HTML raster request takes a program and, optionally, a range");let t=e;q(t.program),t.range!==void 0&&Be(t.range,t.program.frameCount)}function xe(e,t={}){return q(e),t.range!==void 0&&Be(t.range,e.frameCount),{program:e,...t.range===void 0?{}:{range:t.range}}}function ee(e,t){if(e.kind!=="inline")throw new Error(`${t} has to be an inline value`);return e.value}var cr={producers:[{producer:P.compile,handler:({inputs:e})=>({outputs:{program:{kind:"inline",value:lr(ye(ee(e.composition.value,"Composition"),ee(e.timeline.value,"Timeline")))}},needs:{}})},...[P.requestVisual,P.requestVisualRange].map(e=>({producer:e,handler:({inputs:t})=>({outputs:{},needs:{visual:xe(ee(t.program.value,"HtmlProgram"),t.range===void 0?{}:{range:ee(t.range.value,"MediaFrameRange")})}})}))],plannedNeeds:[P.requestVisual,P.requestVisualRange].map(e=>({producer:e,port:"visual",capability:L.rasterizeVisual,plan({state:t,step:r}){return{constraints:{},pendingInputs:sr(t,r)}},present(t){let r=t.constraints;if(r.program===void 0)return{fields:{},references:{}};let{program:n,range:a}=r;return{fields:{width:[n.canvas.width],height:[n.canvas.height],startFrame:[a?.startFrame??0],endFrameExclusive:[a?.endFrameExclusive??n.frameCount],frameRate:[`${n.frameRate.numerator}/${n.frameRate.denominator}`]},references:{}}}}))};export{A as a,C as b,L as c,P as d,tt as e,rt as f,st as g,re as h,ct as i,dt as j,ge as k,ye as l,q as m,Yt as n,Kt as o,er as p,tr as q,rr as r,De as s,ar as t,ir as u,or as v,xe as w,cr as x};

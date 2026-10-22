import{parseHTML as D}from"linkedom";import{assertHtmlProgram as f,compileHtmlProgram as H,materializeHtmlProgram as R}from"@clipkin/html-program";import{compileAudioProgramPlan as M,verifyAudioProgramPlan as y}from"@clipkin/media-operations";import{injectRuntimeShim as T}from"@clipkin/html-program/playback";function g(e,i){let o=H(e,i),r=M(e,i),n=new Map([...o.artifacts.map(t=>t.artifact),...r.clips.map(t=>t.artifact)].map(t=>[t.resource,t]));return{format:"clipkin.html-document@1",program:o,audio:r,bindings:[...n].map(([t,a])=>({id:t,artifact:a}))}}function w(e){if(!Array.isArray(e.bindings))throw new Error("The HTML document is missing its material bindings");let i=new Map(e.bindings.map(n=>[n.artifact?.resource,n.id]));if(new Set(e.bindings.map(n=>n.id)).size!==e.bindings.length)throw new Error("The HTML document lists the same material identity more than once");let r=n=>{let t=i.get(n.resource);if(t===void 0)throw new Error("A material in the HTML document is not bound");return{...n,resource:t}};return{...e.program,artifacts:e.program.artifacts.map(n=>({...n,artifact:r(n.artifact)})),surfaces:e.program.surfaces.map(n=>({...n,artifact:r(n.artifact)}))}}function p(e){if(e===null||typeof e!="object"||e.format!=="clipkin.html-document@1")throw new Error("The HTML document format is not supported");let{program:i,audio:o}=e;if(f(w(e)),y(o),i.frameCount!==o.frameCount||i.frameRate.numerator!==o.frameRate.numerator||i.frameRate.denominator!==o.frameRate.denominator)throw new Error("The HTML picture and its sound have to share one frame clock")}var x=e=>e.replaceAll("&","&amp;").replaceAll('"',"&quot;").replaceAll("<","&lt;").replaceAll(">","&gt;");function E(e,i,o){f(e),y(i);let r=R(e,o),n=i.clips.map(t=>`<audio class="clipkin-studio-audio" preload="auto"
    src="${x(o(t.artifact))}"
    data-start="${t.targetStartSample/48e3}"
    data-duration="${(t.targetEndSampleExclusive-t.targetStartSample)/48e3}"
    data-media-start="${t.sourceStartSample/48e3}"
    data-media-end="${t.sourceEndSampleExclusive/48e3}"
    data-loop="${t.sourceLoop}" data-phase="${t.sourcePhaseSample/48e3}"
    data-playback-rate="${t.playbackRate}" data-gain="${t.gain}"
    data-level-automation="${encodeURIComponent(JSON.stringify({gainEnvelope:t.gainEnvelope,audibility:t.audibility,fadeInSamples:t.fadeInSamples,fadeOutSamples:t.fadeOutSamples,mixStartSample:t.mixStartSample,mixEndSampleExclusive:t.mixEndSampleExclusive}))}"></audio>`).join("");return{html:r,preview:T(r,n)}}function K(e,i,o={}){p(e);let r=w(e),n=e.audio,t=new Map(e.bindings.map(m=>[m.id,m.artifact])),a=E(r,n,m=>i(t.get(m.resource)??m)).preview,{document:d}=D(a),v=Array.from(d.querySelectorAll("script")).map(m=>{let P=m.textContent??"";return m.remove(),P}),b=d.toString(),S=`<script>
(() => {
  const options = ${JSON.stringify({autoplay:o.autoplay??!0,loop:o.loop??!0,muted:o.muted??!0,responsive:o.responsive??!0})}, count = ${r.frameCount}, fps = ${r.frameRate.numerator}/${r.frameRate.denominator};
  let frame = 0, playing = false, request, generation = 0, started, lastReport = 0;
  function report(force = false) {
    if (window.parent === window) return;
    const now = performance.now();
    if (!force && now - lastReport < 100) return;
    lastReport = now;
    window.parent.postMessage({type:'clipkin.html-document.state@1',frame,frameCount:count,frameRate:fps,playing}, '*');
  }
  let readyResolve, readyReject;
  const ready = new Promise((resolve, reject) => { readyResolve = resolve; readyReject = reject; });
  function pause() {
    playing = false; generation++; cancelAnimationFrame(request);
    return ready.then(async () => { await window.__clipkinSeekFrame(frame); report(true); });
  }
  async function play() {
    await ready;
    if (playing) return;
    playing = true; started = performance.now() - frame * 1000 / fps;
    report(true);
    const current = ++generation;
    async function tick(now) {
      if (!playing || generation !== current) return;
      const elapsed = Math.floor((now - started) * fps / 1000);
      frame = options.loop ? elapsed % count : Math.min(elapsed, count - 1);
      try { await window.__clipkinPlayFrame(frame); }
      catch (error) { playing = false; window.dispatchEvent(new CustomEvent('clipkin-playback-error', {detail: error})); return; }
      if (!playing || generation !== current) return;
      report();
      if (!options.loop && elapsed >= count - 1) { await pause(); return; }
      request = requestAnimationFrame(tick);
    }
    request = requestAnimationFrame(tick);
  }
  window.__clipkinDocument = {
    ready, play, pause,
    get frame() { return frame; }, get playing() { return playing; },
    async seekFrame(value) {
      if (!Number.isSafeInteger(value) || value < 0 || value >= count) throw new RangeError('Frame outside HTML document');
      await pause(); frame = value; await window.__clipkinSeekFrame(frame); report(true);
    },
    async setMuted(value) { await ready; await window.__clipkinSetMuted(value); }
  };
  let commands = Promise.resolve();
  window.addEventListener('message', event => {
    if (event.source !== window.parent || window.parent === window || event.data?.type !== 'clipkin.html-document.command@1') return;
    const {action,frame:target,muted} = event.data;
    commands = commands.then(async () => {
      await ready;
      if (action === 'play') await play();
      else if (action === 'pause') await pause();
      else if (action === 'seek') await window.__clipkinDocument.seekFrame(target);
      else if (action === 'mute') await window.__clipkinDocument.setMuted(muted);
      else if (action === 'state') report(true);
    }).catch(error => window.parent.postMessage({type:'clipkin.html-document.error@1',message:String(error)}, '*'));
  });
  window.addEventListener('load', async () => {
    try {
      await document.fonts.ready;
      await new Promise(requestAnimationFrame);
      ${v.join(`
`)}
      await window.__clipkinFrameProgram.prepare();
      await window.__clipkinFrameReady;
      await window.__clipkinSetMuted(options.muted);
      if (options.responsive) {
        const root = document.querySelector('[data-clipkin-program-root]');
        function resize() {
          const scale = Math.min(innerWidth/${r.canvas.width}, innerHeight/${r.canvas.height});
          Object.assign(root.style, {position:'absolute', transformOrigin:'top left', transform:'scale('+scale+')', left:((innerWidth-${r.canvas.width}*scale)/2)+'px', top:((innerHeight-${r.canvas.height}*scale)/2)+'px'});
        }
        new ResizeObserver(resize).observe(document.documentElement); resize();
      }
      readyResolve();
      report(true);
      if (options.autoplay) await play();
    } catch (error) { readyReject(error); }
  }, {once:true});
})();
</script>`;return b.replace("</body>",S+"</body>")}import{compositionDependency as _,compositionTypes as h}from"@clipkin/composition";import{htmlProgramModuleRef as $,htmlProgramSchema as A}from"@clipkin/html-program";import{audioProgramPlanSchema as L,mediaOperationsModuleRef as j}from"@clipkin/media-operations";import{timelineDependency as C,timelineTypes as k}from"@clipkin/timeline";var l={name:"@clipkin/html-document",version:"1"},s={document:{module:l,name:"HtmlDocument"}},c={compile:{module:l,name:"compile-document"}},te={kind:"object",fields:{format:{schema:{kind:"literal",value:"clipkin.html-document@1"}},program:{schema:A},audio:{schema:L},bindings:{schema:{kind:"array",items:{kind:"object",fields:{id:{schema:{kind:"string",minLength:1}},artifact:{schema:{kind:"object",fields:{kind:{schema:{kind:"literal",value:"blob"}},resource:{schema:{kind:"string",minLength:1}},size:{schema:{kind:"number",integer:!0,minimum:0}},mediaType:{schema:{kind:"string",minLength:1}}}}}}}}}}},oe=[{name:"document",tag:"Document",mode:"structured",outputs:[s.document],vocabulary:{summary:"Produces a playable HTML document with its picture, sound and material references.",attributes:[{name:"id",kind:"identifier",required:!0,summary:"Names the document output."},{name:"composition",kind:"reference",required:!0,accepts:[h.composition],summary:"Selects the picture and sound."},{name:"timeline",kind:"reference",required:!0,accepts:[k.timeline],summary:"Selects the frame clock and duration."}],ports:[{name:"document",type:s.document,summary:"The document, addressed as <id>.document."}],example:'<page:Document id="preview" composition={main.composition} timeline={animation.timeline}/>'}}],ne={format:"clipkin.module@1",...l,dependencies:[_,C,{module:$},{module:j}],types:[{name:"HtmlDocument"}],capabilities:[],producers:[{name:c.compile.name,inputs:[{name:"composition",type:h.composition},{name:"timeline",type:k.timeline}],outputs:[{name:"document",type:s.document}],needs:[]}]};import{sealGraphFragment as F}from"@clipkin/clipkin/author";import{compositionTypes as q}from"@clipkin/composition";import{timelineTypes as O}from"@clipkin/timeline";var u=F({inputs:[{name:"composition",type:q.composition},{name:"timeline",type:O.timeline}],operations:[{id:"compile-document",producer:c.compile,inputs:{composition:{kind:"fragment-input",name:"composition"},timeline:{kind:"fragment-input",name:"timeline"}},result:{kind:"output",name:"document"}}],exports:[{name:"document",type:s.document,root:{kind:"fragment-operation",operation:"compile-document"}}]});import{canonicalize as z}from"@clipkin/clipkin/protocol";var de={producers:[{producer:c.compile,handler:({inputs:e})=>{let i=e.composition.value,o=e.timeline.value;if(i.kind!=="inline"||o.kind!=="inline")throw new Error("An HTML document needs both its Composition and its Timeline inline");return{outputs:{document:{kind:"inline",value:z(g(i.value,o.value))}},needs:{}}}}],validators:[{type:s.document,handler({value:e}){if(e.kind!=="inline")throw new Error("An HTML document has to be supplied inline");p(e.value)}}]};import{compositionTypes as B}from"@clipkin/composition";import{resolveTemporalContext as I}from"@clipkin/temporal/markup";import{sameType as N}from"@clipkin/clipkin/protocol";var ke=({element:e,resolveReference:i})=>{if(Object.keys(e.attributes).some(a=>!["id","composition","timeline"].includes(a)))throw new Error(`${e.name} has attributes that are not supported`);if(e.children.some(a=>a.kind==="element"||a.value.trim().length>0))throw new Error(`${e.name} cannot have content`);let o=e.attributes.id;if(typeof o!="string"||o.length===0)throw new Error(`${e.name}.id is missing`);let r=e.attributes.composition;if(typeof r!="object"||r.kind!=="reference")throw new Error(`${e.name}.composition has to be given as a reference`);let n=i(r.path);if(n===void 0||!N(n.type,B.composition))throw new Error(`${e.name}.composition has to point at a Composition`);let t=I({element:e,resolveReference:i});return{records:[],fragments:[u],components:[{id:o,fragment:u.id,inputs:{composition:n.ref,timeline:t.timeline.ref},outputs:{document:`${o}.document`},range:e.range}]}};export{g as a,p as b,K as c,l as d,s as e,c as f,te as g,oe as h,ne as i,u as j,de as k,ke as l};

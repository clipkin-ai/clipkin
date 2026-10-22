import{a as b,d as k,g as C}from"./c-7OEY2KGY.js";import{mkdir as R,stat as S,writeFile as A}from"node:fs/promises";import{dirname as F,resolve as E}from"node:path";import{cliProviderLine as X,cliProviderView as I,createCliScratchResources as M,openCliRuntimeHost as N,selectCliProvider as W}from"@clipkin/clipkin/cli";import{speechEvidenceFile as D}from"@clipkin/media-local";import{sealSpeechEvidenceAudio as _,speechEvidenceTypes as q,transcriptDocumentFromEvidence as z}from"@clipkin/speech-evidence";function c(e,n){if(!e)throw new Error(n)}function J(e){let n=new Set(["--language","--to","--runtime","--project"]),i=[],t=new Map,l=!1;for(let s=1;s<e.length;s++){let r=e[s];if(r==="--json"){l=!0;continue}if(["--debug","--verbose","--no-color"].includes(r))continue;if(r==="--color"){s+=1;continue}if(!r.startsWith("--")){i.push(r);continue}c(n.has(r),`transcribe does not recognize the option ${r}`),c(!t.has(r),`${r} may be given only once`);let d=e[++s];c(d!==void 0&&!d.startsWith("--"),`${r} requires a value`),t.set(r,d)}return{positionals:i,options:t,json:l}}async function L(e,n){let i=e.options.get("--to");c(i!==void 0,"--to is missing: name the transcript file to write");let t=E(n,i);return c(!await S(t).then(()=>!0,()=>!1),`Destination ${t} exists already`),t}async function O(e,n){await R(F(e),{recursive:!0});try{await A(e,n,{flag:"wx"})}catch(i){throw i instanceof Error&&"code"in i&&i.code==="EEXIST"?new Error(`Destination ${e} exists already`):i}}function B(e){return{cwd:e.cwd,openHost:async(n,i)=>await N(e,n,i)}}function x(e){e.write(`clipkin transcribe
Establish word times with the WhisperX alignment Endpoint selected by the Runtime Profile.

  clipkin transcribe <audio|video> --to <transcript.json> --language <code> [--runtime <profile>] [--project <directory>]

The local media capability projects 16 kHz mono evidence; WhisperX owns alignment and the transcript view.
This is one immediate request: no Build or Result state is created.
`)}async function V(e,n,i){if(e.includes("--help")){x(n);return}let t=J(e);c(t.positionals.length===1,"transcribe accepts exactly one audio or video file");let l=E(i.cwd,t.positionals[0]),s=b(t.options.get("--language"),"transcribe --language"),r=await L(t,i.cwd),{profile:d,host:u}=await i.openHost(t.options.get("--runtime"),t.options.get("--project")),p=await D(l),m=M(),P=await m.put(p.bytes,"audio/wav"),$=_({domainId:"cli-transcribe",artifact:P,sampleFrames:p.sampleFrames}),g={id:"need:clipkin-transcribe",capability:C.alignment,returns:q.alignedTranscript,constraints:k($,{language:s}),result:"record:clipkin-transcribe"},w=await W(u,g,d);t.json||n.write(`Transcribing with ${X(w)}
`);let f=t.json?n.writeProgress:n.writeProgress??n.write,h,y=await u.invoke(g,m,{reportProgress:async a=>{a.phase!==h&&(h=a.phase,f?.(`  \xB7 ${a.phase}
`))},reportDiagnostic:async a=>{f?.(`  \xB7 ${a.message}
`)}});c(y.value.kind==="inline","the transcript was returned by reference instead of inline");let T=y.value.value,o=z(T,{source:l,language:s}),v=o.passages.reduce((a,H)=>a+H.words.length,0);await O(r,`${JSON.stringify(o,null,2)}
`);let j={format:"clipkin.whisperx-transcribe@1",source:l,language:s,audio_seconds:o.audio_seconds,extracted:p.extracted,...I(w),passages:o.passages.length,words:v,path:r};t.json?n.write(`${JSON.stringify(j,null,2)}
`):n.write(`\u2713 Transcript written

  ${v} words in ${o.passages.length} passage${o.passages.length===1?"":"s"} over ${o.audio_seconds}s
  ${r}
`)}var ie=[{format:"clipkin.cli-command@1",id:"@clipkin/whisperx",commands:["transcribe"],writeRootHelp(e){e.write(`
Speech alignment
  transcribe
  clipkin transcribe --help for inputs and Runtime selection
`)},writeHelp(e,n){x(n)},async run(e,n,i){await V(e,n,B(i))}}];export{ie as cliCommandModules,V as runTranscribeCli,B as transcribeEnvironment,x as writeTranscribeHelp};

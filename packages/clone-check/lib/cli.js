import{h as m,i as u,j as k}from"./c-SNPJEBTJ.js";import{spawnSync as g}from"node:child_process";var l={shots:`clipkin shots <reference> [--to shots] [--language en] [--no-transcribe]
The blueprint for a clone, before planning: every shot of the reference with its times, words and
speaking pitch, a full-size frame of each, and the clip's loudness and room. Writes <to>/shots.md,
shots.json, sheet.png and frames/shot-NN.png. Transcription is a fraction of a credit on hosted models.
`,"voice-check":`clipkin voice-check <sample> --like <reference> (--at <times> | --speaker lower|higher) [--sample-at <times>] [--json]
A voice sample against the speaker it stands in for, before any paid video uses it: speaking pitch over
the times that speaker talks in the reference (--at 0-1.7,10-10.8, from clipkin shots). --sample-at
measures only those times of the sample, to check one speaker in a finished draft. Within 15% passes.
`,compare:`clipkin compare <original> <draft> [--language en] [--no-transcribe] [--frames compare-shots.png] [--json]
A draft against the reference it clones, before delivery: length, cuts, loudness, the room under the
voices, speech share, changed words, and a frame-per-shot sheet (original above draft) to look at.
`};function o(n,e){let t=n.indexOf(e);return t>=0?n[t+1]:void 0}var w=["--to","--language","--frames","--like","--at","--sample-at","--speaker"],C=n=>n.filter((e,t)=>!e.startsWith("--")&&!w.includes(n[t-1]??""));function y(n,e){let t=process.env.CLIPKIN_CLI_SELF||process.argv[1];return{write:n.write,cwd:e.cwd,...t===void 0?{}:{transcribe:(i,s,c)=>{let r=g(process.execPath,[t,"transcribe",i,"--language",s,"--to",c,"--json"],{encoding:"utf8",maxBuffer:16777216,env:process.env});return r.status===0?void 0:(r.stderr||r.stdout||"no output").trim().slice(-300)}}}}function b(n,e,t,i){let s=C(e),c=l[n],r=y(t,i),h=!e.includes("--no-transcribe"),d=o(e,"--language"),a;if(n==="shots"){if(s.length!==1)throw new Error(c.trim());a=u(r,s[0],{...o(e,"--to")===void 0?{}:{to:o(e,"--to")},...d===void 0?{}:{language:d},transcribe:h})}else if(n==="voice-check"){let f=o(e,"--like");if(s.length!==1||f===void 0)throw new Error(c.trim());let p=o(e,"--speaker");a=k(r,s[0],{like:f,...o(e,"--at")===void 0?{}:{at:o(e,"--at")},...o(e,"--sample-at")===void 0?{}:{sampleAt:o(e,"--sample-at")},...p==="lower"||p==="higher"?{speaker:p}:{},json:e.includes("--json")})}else{if(s.length!==2)throw new Error(c.trim());a=m(r,s[0],s[1],{...d===void 0?{}:{language:d},...o(e,"--frames")===void 0?{}:{frames:o(e,"--frames")},transcribe:h,json:e.includes("--json")})}a!==0&&t.setExitCode?.(a)}var x=[{format:"clipkin.cli-command@1",id:"@clipkin/clone-check",commands:["shots","voice-check","compare"],writeRootHelp(n){n.write(`
Cloning checks
  shots
  voice-check
  compare
  clipkin <command> --help for inputs
`)},writeHelp(n,e){let t=n.find(i=>l[i]!==void 0)??"compare";e.write(l[t])},async run(n,e,t){let[i,...s]=n;if(i===void 0||l[i]===void 0)throw new Error("clipkin shots, voice-check or compare");if(s.includes("--help")){e.write(l[i]);return}b(i,s,e,t)}}];export{x as cliCommandModules};

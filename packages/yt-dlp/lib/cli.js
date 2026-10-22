import{b as l,c as p,d as c}from"./c-HZWNCPAH.js";import{mkdir as w,stat as f}from"node:fs/promises";import{dirname as m,resolve as h}from"node:path";import{probeMedia as y}from"@clipkin/media-local/files";function d(n,o){if(!n)throw new Error(o)}function g(n){let o=[],a,t=!1;for(let i=1;i<n.length;i+=1){let e=n[i];if(e==="--json"){t=!0;continue}if(!["--debug","--verbose","--no-color"].includes(e)){if(e==="--color"){i+=1;continue}if(e==="--to"){d(a===void 0,"--to may be given only once");let r=n[++i];d(r!==void 0&&!r.startsWith("--"),"--to needs a destination file after it"),a=r;continue}d(!e.startsWith("--"),`download does not recognize the option ${e}`),o.push(e)}}return{positionals:o,...a===void 0?{}:{to:a},json:t}}function u(n){n.write(`clipkin download
Acquire one network video through the pinned yt-dlp environment.

  clipkin download <http-or-https-url> --to <video.mp4>
  clipkin download prepare

Preparation installs the package's locked environment explicitly. Download never prepares, updates,
overwrites an existing destination or creates Runtime/Build state. Add --json for the machine view.
`)}async function k(n,o,a=process.cwd()){if(n[1]===void 0||n.includes("--help")){u(o);return}let t=g(n);if(t.positionals[0]==="prepare"){d(t.positionals.length===1&&t.to===void 0,"download prepare does not take a URL or --to"),o.writeProgress?.(`Setting up the selected yt-dlp environment\u2026
`);let s=l();o.write(t.json?`${JSON.stringify({executable:s})}
`:`yt-dlp ready: ${s}
`);return}let[i]=t.positionals;d(i!==void 0&&p(i),"download expects a single http or https URL"),d(t.positionals.length===1,"download accepts exactly one URL"),d(t.to!==void 0,"download needs --to <video.mp4>");let e=h(a,t.to);d(!await f(e).then(()=>!0,()=>!1),`Destination ${e} exists already`),await w(m(e),{recursive:!0}),await c(i,e);let r=await y(e);if(d(r.hasVideo,`${e}: the downloaded media contains no video stream`),t.json){o.write(`${JSON.stringify({path:e,url:i,...r},null,2)}
`);return}o.write(`${e}
  ${r.duration} s  ${r.width}\xD7${r.height}  ${r.hasAudio?"with audio":"no audio"}
`)}var j=[{format:"clipkin.cli-command@1",id:"@clipkin/yt-dlp",commands:["download"],writeRootHelp(n){n.write(`
Network media
  download
  clipkin download --help for preparation and destination options
`)},writeHelp(n,o){u(o)},async run(n,o,a){await k(n,o,a.cwd)}}];export{j as cliCommandModules,k as runDownloadCli,u as writeDownloadHelp};

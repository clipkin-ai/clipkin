import{stat as F}from"node:fs/promises";import{resolve as w}from"node:path";import{pathToFileURL as N}from"node:url";import{parseArgs as H}from"node:util";function k(t){t.write(`Browser capture \u2014 save website or local HTML material to project files.

  clipkin capture screenshot <url-or-file> --to <image> [options]
  clipkin capture run <script.mjs> [browser options] [-- script arguments]
  clipkin capture install-browser

Screenshot options:
  --full-page                 Capture the full document
  --selector <selector>       Capture one visible element (Puppeteer selector syntax)
  --clip <x,y,width,height>   Capture a rectangle in CSS pixels
  --transparent              Preserve a transparent page background
  --wait-for <selector>       Wait for a visible element before capture
  --wait-ms <milliseconds>    Additional explicitly chosen delay

Browser options:
  --viewport <width>x<height> CSS viewport size (default: 1280x720)
  --scale <number>            Device pixel ratio (default: 1)
  --channel <name>            Installed Chrome channel, e.g. chrome
  --browser <path>            Explicit browser executable instead of a channel
  --browser-version <version> Exact Chrome for Testing version
  --browser-cache <directory> Cache shared by installation and capture
  --browser-download-base-url <url> Compatible archive source for install-browser
  --headed                   Show the browser
  --timeout-ms <milliseconds> Page operation and navigation timeout
  --json                     Print all saved files with their actual dimensions

The browser defaults to this package's tested Chrome for Testing revision. Prepare
it once with install-browser, or select a compatible installed browser. Native page
recording requires Chrome 153+ and ffprobe on PATH. A script exports default async ({ page, browser, screenshot,
record, args, log }) => { ... }; optional export const options configures Puppeteer
launch options and ffprobePath. Use page.goto/click/type/evaluate normally, then
screenshot({ path: 'assets/page.png' }) or record({ path: 'assets/demo.mp4' }).
Await recorder.stop() to finish a recording; returning finishes open recordings.
Native recording produces MP4; audio is included when record({ audio: true, ... }).

Outputs refuse to overwrite existing files. Paths are relative to the working
directory. Scripts are ordinary project code executed with Node.js permissions.
`)}function x(t,o,s=!1){if(t===void 0)return;let i=Number(t);if(!Number.isFinite(i)||(s?i<0:i<=0))throw new Error(`${o} has to be ${s?"non-negative":"positive"}`);return i}async function B(t,o){if(/^https?:\/\//i.test(t)||t.startsWith("file:"))return new URL(t).href;let s=w(o,t);if(!(await F(s)).isFile())throw new Error(`${s} is not a file`);return N(s).href}async function M(t,o,s=process.cwd()){let i=t[1];if(i===void 0||i==="--help"){k(o);return}if(i!=="screenshot"&&i!=="run"&&i!=="install-browser")throw new Error(`${i} is not a capture command`);let d=t.indexOf("--"),g=d<0?[]:t.slice(d+1);if(i==="screenshot"&&g.length>0)throw new Error("Script arguments are only accepted by capture run");let f=H({args:(d<0?t:t.slice(0,d)).slice(2),allowPositionals:!0,options:{viewport:{type:"string"},scale:{type:"string"},channel:{type:"string"},"browser-version":{type:"string"},"browser-cache":{type:"string"},"browser-download-base-url":{type:"string"},browser:{type:"string"},headed:{type:"boolean"},"timeout-ms":{type:"string"},json:{type:"boolean"},debug:{type:"boolean"},verbose:{type:"boolean"},"no-color":{type:"boolean"},color:{type:"string"},help:{type:"boolean"},to:{type:"string"},"full-page":{type:"boolean"},selector:{type:"string"},clip:{type:"string"},transparent:{type:"boolean"},"wait-for":{type:"string"},"wait-ms":{type:"string"}}}),e=f.values;if(e.help){k(o);return}let m={...e["browser-version"]===void 0?{}:{version:e["browser-version"]},...e["browser-cache"]===void 0?{}:{cacheDirectory:w(s,e["browser-cache"])},...e["browser-download-base-url"]===void 0?{}:{downloadBaseUrl:e["browser-download-base-url"]}};if(i==="install-browser"){if(f.positionals.length>0||g.length>0)throw new Error("install-browser does not accept positional arguments");for(let b of Object.keys(e))if(!["json","debug","verbose","color","no-color","browser-version","browser-cache","browser-download-base-url"].includes(b))throw new Error(`install-browser has no --${b} option`);o.writeProgress?.(`Setting up the capture browser\u2026
`);let{installCaptureBrowser:r}=await import("@clipkin/browser-capture"),n=await r(m);o.write(e.json?`${JSON.stringify({format:"clipkin.capture-browser@1",path:n})}
`:`Capture browser ready: ${n}
`);return}let y=f.positionals[0];if(y===void 0||f.positionals.length!==1)throw new Error(`capture ${i} takes exactly one ${i==="run"?"script":"URL or local file"}`);if(e.browser&&e.channel)throw new Error("Use either --browser or --channel, not both");let a={},v;if(i==="run"){for(let n of["to","full-page","selector","clip","transparent","wait-for","wait-ms"])if(e[n]!==void 0)throw new Error(`--${n} only applies to capture screenshot; with capture run, do this in the script`);let r=await import(N(w(s,y)).href);if(typeof r.default!="function")throw new Error("Capture script has to export an async function as its default export");a=r.options??{},v=r.default}else{if(!e.to)throw new Error("capture screenshot needs --to <image>");if([e["full-page"],e.selector,e.clip].filter(Boolean).length>1)throw new Error("Use only one of --full-page, --selector or --clip");let n;if(e.clip){let[c,u,p,h,U]=e.clip.split(",").map(Number);if(U!==void 0||[c,u,p,h].some(S=>S===void 0||!Number.isFinite(S))||c<0||u<0||p<=0||h<=0)throw new Error("--clip takes x,y,width,height, with coordinates of zero or more and dimensions greater than zero");n={x:c,y:u,width:p,height:h}}let b=await B(y,s),T=w(s,e.to),E=x(e["wait-ms"],"--wait-ms",!0);v=async({page:c,screenshot:u})=>{let p=await c.goto(b,{waitUntil:"load"});if(p&&!p.ok())throw new Error(`Page answered with HTTP ${p.status()}: ${c.url()}`);e["wait-for"]&&await c.waitForSelector(e["wait-for"],{visible:!0}),E&&await new Promise(h=>setTimeout(h,E)),await u({path:T,...e["full-page"]?{fullPage:!0}:{},...e.selector?{selector:e.selector}:{},...n?{clip:n}:{},...e.transparent?{omitBackground:!0}:{}})}}if(Object.keys(m).length>0&&(a={...a,browser:{...a.browser,...m}}),e.browser||e.channel){if(Object.keys(m).length>0)throw new Error("Use either managed browser options or --browser/--channel, not both");let{browser:r,...n}=a;a=n}let l={...a.launch};if(e.browser&&(l.executablePath=w(s,e.browser),delete l.channel),e.channel){if(!["chrome","chrome-beta","chrome-canary","chrome-dev"].includes(e.channel))throw new Error("--channel has to be a Puppeteer Chrome channel: chrome, chrome-beta, chrome-canary or chrome-dev");l.channel=e.channel,delete l.executablePath}if(e.headed&&(l.headless=!1),e.viewport||e.scale){let r={width:1280,height:720,deviceScaleFactor:1,...l.defaultViewport};if(e.viewport){let n=/^(\d+)x(\d+)$/.exec(e.viewport);if(!n||Number(n[1])<1||Number(n[2])<1)throw new Error("--viewport takes WIDTHxHEIGHT with both values greater than zero");r.width=Number(n[1]),r.height=Number(n[2])}r.deviceScaleFactor=x(e.scale,"--scale")??r.deviceScaleFactor,l.defaultViewport=r}let P=x(e["timeout-ms"],"--timeout-ms",!0)??a.timeoutMs,$=r=>{o.writeProgress?o.writeProgress(`${r}
`):e.json||o.write(`${r}
`)},j=r=>$(`Saved ${r.path} (${r.width}\xD7${r.height}${r.duration===void 0?"":`, ${r.duration.toFixed(2)}s`})`),{withCapture:O}=await import("@clipkin/browser-capture"),C=await O({...a,launch:l,...P===void 0?{}:{timeoutMs:P}},async r=>await v({...r,args:g,log:$}),j);e.json?o.write(`${JSON.stringify({format:"clipkin.capture@1",outputs:C},null,2)}
`):o.write(`Capture complete: ${C.length} file${C.length===1?"":"s"}.
`)}var z=[{format:"clipkin.cli-command@1",id:"@clipkin/browser-capture",commands:["capture"],writeRootHelp(t){t.write(`
Browser capture
  capture screenshot | run | install-browser
  clipkin capture --help for options
`)},writeHelp(t,o){k(o)},async run(t,o,s){await M(t,o,s.cwd)}}];export{z as cliCommandModules,M as runCaptureCli,k as writeCaptureHelp};

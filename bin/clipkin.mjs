#!/usr/bin/env node
import{readFileSync as r,realpathSync as p}from"node:fs";import{dirname as d,resolve as s,sep as e}from"node:path";import{fileURLToPath as f,pathToFileURL as u}from"node:url";
const a=process.argv.slice(2);if(a.length===1&&(a[0]==="--version"||a[0]==="-v")){console.log(JSON.parse(r(new URL("../package.json",import.meta.url),"utf8")).version);process.exit(0)}
const w=process.emitWarning;process.emitWarning=function(m,...x){if(String(m instanceof Error?m.message:m).startsWith("SQLite is an experimental feature"))return;return w.call(process,m,...x)};
const root=p.native(s(d(f(import.meta.url)),"..")),base=u(root+e),launcher=f(import.meta.url);
const{installDistributionPackageResolution:i}=await import(new URL("packages/loader/lib/launch-resolution.js",base).href);i([root]);
const{runInstalledCliApplication:c,runNodeCli:n}=await import(new URL("packages/cli/lib/launch-cli.js",base).href);
const{createVideoDistribution:v}=await import("@clipkin/video");const distribution=v({packageRoot:root,launcher});
await n(a,async(argv,io)=>await c(argv,io,{distribution,distributionRoot:root,launcher}));

import{dirname as q,resolve as l}from"node:path";import{fileURLToPath as z}from"node:url";var j=l(q(z(import.meta.url)),"..");function H(t){t.write(`clipkin studio
Open a Run in the browser to inspect its composition, Sources and Results.

  clipkin studio --run <build.slate> [--runtime <clipkin.runtime.json>]
    [--port <number>] [--project <directory>] [--package-root <directory>]
    [--locale-pack <./language.json | installed-package/language.json>]...

  clipkin studio --check-locale <./language.json | installed-package/language.json>
    [--package-root <directory>]

Language packs are explicit JSON data. Relative files use the current directory;
package exports resolve from --package-root (the project by default).
--check-locale lists missing translations and unknown IDs without opening a Run.

Relative command-line paths start at the current directory; --project selects
the project, without rebasing those paths. Otherwise the nearest package.json
whose clipkin.project is true defines the project.
Without --runtime, Studio uses that project's .clipkin/runtime selection.
The server prints its project, Run, Runtime selection and browser URL.
Press Ctrl+C to stop it.
`)}function w(t){throw new Error(`${t}. See clipkin studio --help.`)}function J(t){let d=new Set(["run","runtime","port","project","package-root","locale-pack","check-locale"]),i=new Map;for(let e=0;e<t.length;e+=2){let o=t[e],s=t[e+1];(o===void 0||!o.startsWith("--")||s===void 0||s.startsWith("--"))&&w(`Malformed argument near ${o??"end of command"}`);let a=o.slice(2);d.has(a)||w(`Unknown option --${a}`),i.set(a,[...i.get(a)??[],s])}return i}async function Q(t,d,i){if(t.includes("--help")||t.includes("-h")){H(d);return}let e=J(t[0]==="--"?t.slice(1):t),o=process.env.INIT_CWD??i.cwd,s=e.get("run")?.at(-1),a=e.get("package-root")?.at(-1),P=e.get("project")?.at(-1),C=P===void 0?void 0:l(o,P),r=await i.resolveProjectRoot(C),c=a===void 0?r:l(o,a),{describeLanguagePack:I,loadLanguagePack:L,studioLanguages:$,studioLocalizationPlugin:x}=await import("./c-3OOQYG47.js"),y=e.get("check-locale")?.at(-1);if(y!==void 0){d.write(I(await L(y,o,c))+`
`);return}(s===void 0||s.trim().length===0)&&w("Missing --run");let p=l(o,s),{createServer:A}=await import("vite"),{resolveDistributionPackageImport:N}=await import("@clipkin/clipkin/loader/node"),{openStudioBuildLibrary:U}=await import("./c-I63OVVBQ.js"),{loadStudioCompanionRegistry:D}=await import("./c-OCT5HTYF.js"),{loadStudioDomain:M}=await import("./c-BG3UDGBT.js"),{loadStudioRun:W}=await import("./c-DCZJET4Y.js"),{studioPlugin:F}=await import("./c-PPQZBAJ6.js"),{studioFeedbackPlugin:O}=await import("./c-FDGS3CGB.js"),{inspectStudioRun:T}=await import("./c-ENR32LGD.js"),B=await $(e.get("locale-pack")??[],o,c),g=e.get("runtime")?.at(-1),v=g===void 0?await i.distribution.resolveProjectRuntime?.(r):void 0,S=g===void 0?v?.profile:l(o,g);console.info([`  Project            ${r}`,`  Run                ${p}`,`  Runtime Profile    ${S??"not selected"}`,`  Runtime selection  ${g!==void 0?"command argument (this session only)":v===void 0?"none":"project selection"}`,...c===r?[]:[`  Package root       ${c}`],""].join(`
`));let h=Number(e.get("port")?.at(-1)??"5179");(!Number.isSafeInteger(h)||h<=0)&&w("--port must be a positive integer");let m=i.distribution.packageRoot??l(j,"../.."),R=await M({run:p,workspaceRoot:r,packageRoot:c,distribution:i.distribution}),b=await D({distributionPackageRoot:m,sourcePackages:R.packages}),u=await U(i.distribution,S,c,r,m),f;try{f=await W({run:p,domain:R,registry:b,buildLibrary:u})}catch(n){throw await u.close(),n}let E=f.authorSource;try{T(b,f.source,f)}catch(n){throw await u.close(),n}let k=await A({configFile:!1,root:j,server:{port:h,fs:{allow:[r,c,m,j]}},plugins:[{name:"clipkin-distribution-imports",enforce:"pre",resolveId(n){return N(m,n)}},x(B),O(r,p),F({source:E,runPath:p,workspaceRoot:r,domain:R,registry:b,...u===void 0?{}:{buildLibrary:u}})]});k.httpServer?.once("close",()=>{u.close().catch(n=>{console.error(n instanceof Error?n.message:String(n))})}),await k.listen(),k.printUrls();for(let n of k.resolvedUrls?.local??[])d.write(`  Comments           ${n}#comments
`)}export{Q as runStudio,H as writeStudioHelp};

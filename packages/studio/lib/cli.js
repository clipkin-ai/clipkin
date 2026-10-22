var l=[{format:"clipkin.cli-command@1",id:"@clipkin/studio",commands:["studio","snapshot"],writeRootHelp(i){i.write(`
Studio
  studio --run <build.slate>
  snapshot --studio <url> ...
  clipkin studio --help or clipkin snapshot --help
`)},async writeHelp(i,o){if((i[0]==="help"?i[1]:i[0])==="snapshot"){let{writeSnapshotHelp:t}=await import("./c-3OIE2AR5.js");t(o)}else{let{writeStudioHelp:t}=await import("./start.js");t(o)}},async run(i,o,t){if(i[0]==="snapshot"){let{runSnapshotCli:n}=await import("./c-3OIE2AR5.js");await n(i,o,t)}else{let{runStudio:n}=await import("./start.js");await n(i.slice(1).filter(s=>s!=="--debug"),o,t)}}}];export{l as cliCommandModules};

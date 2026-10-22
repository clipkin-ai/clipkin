import{d as m,e as a,n as d,o as n}from"./c-S4B5DYE4.js";import"./c-JPK6P2PY.js";var t=[{format:"clipkin.cli-command@1",id:"@clipkin/media-local",commands:["media"],writeRootHelp(i){i.write(`
Local media
  media ${m.join(" | ")}
  clipkin media --help for exact options
`)},writeHelp(i,o){let e=i[0]==="help"?i[2]:i[1];d(o,a(e)?e:void 0)},async run(i,o,e){await n(i,o,e.cwd)}}];export{t as cliCommandModules,a as isMediaCommand,m as mediaCommands,n as runMediaCli,d as writeMediaHelp};

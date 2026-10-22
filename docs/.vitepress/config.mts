import { defineConfig } from "vitepress";

export default defineConfig({
  markdown: {
    languageAlias: {
      reel: "xml",
      slate: "xml",
      grade: "css",
      prompt: "text",
    },
  },
});

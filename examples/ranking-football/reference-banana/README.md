# Banana reference variant

An independent ranking variant with a banana presenter. Read `reference-banana.reel`, its Grade
recipes, and `build.slate` together; the Run starts with no generated media satisfied.

From this directory, install the locked dependencies and check the Run:

```sh
npm ci
npx clipkin check build.slate
```

The project installs `@clipkin/ranking` from npm. Review its Runtime Profile and
`npx clipkin plan build.slate --runtime ./clipkin.runtime.json` before paid execution.

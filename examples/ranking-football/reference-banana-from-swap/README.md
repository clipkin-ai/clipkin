# Banana-from-swap variant

An independent ranking variant using the banana presenter. Its Reel, Grade, Slate, and project Runtime
Profile describe the full generation and composition. `build.slate` uses the authored generation
route.

From this directory, install the locked dependencies and check the Run:

```sh
npm ci
npx clipkin check build.slate
```

The project installs `@clipkin/ranking` from npm. Review its Runtime Profile and
`npx clipkin plan build.slate --runtime ./clipkin.runtime.json` before paid execution.

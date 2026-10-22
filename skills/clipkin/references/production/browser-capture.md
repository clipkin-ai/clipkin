# Capturing websites and authored HTML

Use this page when a web page, a product interface or a locally written HTML file should become
captured picture material. What the screen must show, and why, belongs to
[screen demonstrations](../playbooks/craft/screen-demonstrations.md); this page is about saving it.

- `clipkin capture` provides browser capture from the installed Distribution.
- The project's own scripts describe the real page interactions.
- Saved screenshots and recordings reach the composition as Media files; an editable demonstration can
  instead be a project component.
- [Spatial layout](spatial.md) fits either one into its destination.

## Save a page or region

```bash
clipkin capture screenshot https://example.com/product \
  --viewport 540x960 --scale 2 --full-page --to assets/product-page.png

clipkin capture screenshot https://example.com/product \
  --selector '#comparison' --to assets/comparison.png

clipkin capture screenshot ./assets/card.html \
  --viewport 1080x300 --transparent --to assets/card.png
```

**Extent.** By default the visible viewport is captured. `--full-page`, `--selector <selector>` (one
visible element) and `--clip x,y,width,height` (a rectangle in CSS pixels) each pick a different
extent.

**Size.** Viewport and device scale are independent: a `540x960` viewport at `--scale 2` yields a
1080 × 1920 image. Defaults are `1280x720` at scale 1; choose both for the task. When mobile behavior
or a specific user agent matters, use Puppeteer's device emulation inside a script.

**Readiness.** The command waits for page load. `--wait-for <selector>` also holds until that element
is visible, and `--wait-ms` inserts an extra pause of your choosing. Content that appears only after scrolling or
interaction needs a script.

Open the saved image and confirm that it really contains the intended evidence and will be readable
inside its destination Frame.

## Use ordinary page interactions

For several captures, lazy-loaded content, a signed-in page or a demonstration, write the real
interactions in a project `.mjs` file. No Puppeteer import is needed:

```js
// scripts/capture-product.mjs
export const options = {
  launch: { defaultViewport: { width: 1280, height: 720, deviceScaleFactor: 1 } },
};

export default async ({ page, screenshot, record, args, log }) => {
  const [url, destination] = args;
  await page.goto(url);
  await page.waitForSelector('#comparison', { visible: true });
  await screenshot({ path: 'assets/comparison.png', selector: '#comparison' });

  log('Recording the product interaction');
  const recording = await record({ path: destination, fps: 30 });
  await page.click('#show-example');
  await page.waitForSelector('#example-result', { visible: true });
  await recording.stop();
};
```

```bash
clipkin capture run scripts/capture-product.mjs -- \
  https://example.com/product assets/product-demo.mp4
```

The selectors belong to an imaginary page. Use the real controls and the meaningful start and end
states of the page you are capturing, expressed with normal Puppeteer navigation, locators, input and
evaluation.

What the script receives and how it ends:

- `page` and `browser` are ordinary Puppeteer objects. Open more pages from `browser`, and pass a page
  as the second argument to `screenshot` or `record` to capture it.
- `args` holds the arguments after `--`, unchanged; `log` reports progress separately from JSON output.
- Returning finishes any open recordings and closes the browser. Captures that completed earlier
  survive a later failure in the script.
- Inputs next to the script can be found with `new URL('../assets/card.html', import.meta.url).href`.
  Relative *output* paths resolve from the directory where you run the command.
- Output paths must be new; helpers refuse to overwrite. Files a script writes by other means are
  outside that list.
- `--json` lists every completed helper output with its path and real dimensions, plus duration and
  frame rate for recordings.
- Scripts are ordinary Node.js code running with your permissions.

**Scrolling demonstrations.** Find the element that actually scrolls; a gallery may move inside a
page that stays fixed. Record the interaction, then compare well-separated saved frames to confirm the
rows or states really change. Crop and presentation can be revised later around this one recording
without capturing again.

## Browser and recording choices

**Which browser.**

| Option | Effect |
| --- | --- |
| `clipkin capture install-browser` | Prepares the package's tested Chrome for Testing build once, in Puppeteer's browser cache, leaving other browsers alone |
| `--browser-version <exact-version>` + `--browser-cache <directory>` | An explicit alternative; use the same pair for preparation and capture |
| `--browser-download-base-url <url>` | For `install-browser` only: a compatible archive source, with no fallback to another source |
| `--channel chrome` | An installed Chrome |
| `--browser <executable>` | Another explicit, compatible executable |
| `--headed` | A visible window |
| `--timeout-ms` | Page operation and navigation timeout |

The package manifest names the recommended version. Capture never installs a missing browser; it
fails instead. A script's `options.launch` takes normal Puppeteer launch options, such as a
`userDataDir` when a dedicated persistent profile helps, and CLI browser options win over the
script's. For a slow browser download, see
[network preparation](../environment/local-tools.md#make-network-preparation-practical).

**Native recordings.**

- Require Chrome 153 or newer (what `install-browser` supplies) and `ffprobe` on `PATH`;
  `options.ffprobePath` can name a different one. `ffprobe` only reads the finished file's real
  dimensions and duration; the browser does the encoding.
- Always produce MP4, so give an `.mp4` destination.
- Capture picture only, unless you call `record({ path, audio: true })` for page sound. Any
  music, voice-over or effects you add later are separate authored audio Clips.
- Accept Puppeteer's `RecordOptions`: `fps` / `frameRate` set a *maximum* capture rate, and
  `maxWidth` / `maxHeight` cap output size. The helper defaults those caps to the viewport's
  device-pixel size, but Chrome decides the recorded size. A higher device scale can enlarge a
  screenshot without enlarging a recording, so place the video using the dimensions it reports.

## Place the captured material

Store captures among the project assets, and write down which page each came from and why in the
project notes. An image enters as `media:Image`; a recording enters as `media:Video` and follows the normal
[normalization path](media.md). Place them with
[Visual Clips](visual-clips.md#keep-destination-time-and-source-sampling-distinct) against the
Script's Selections or Moments as fits. Visibility, crop, scroll and transitions belong to the
composition, so changing them reuses the captured file.

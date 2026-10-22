# Downloading a video from a link

Come here when the clip you need, as reference or as source, is hosted on a video site. `clipkin
download` fetches it with yt-dlp into an ordinary project file. For a website's interface, scrolling or interaction, use
[browser capture](browser-capture.md) instead.

## Save the source video

```bash
clipkin download "https://example.com/watch?v=VIDEO_ID" \
  --to references/ad/source.mp4
```

- Put the real link in place of the example, and keep it in quotes so `?`, `&` and similar characters
  stay inside the argument.
- `--to` is relative to the current directory. Parent directories are created; an existing file is
  never overwritten.
- `--json` adds a machine view: where the file landed, the URL it came from, its duration,
  dimensions and frame rate, and whether it carries audio.

What you get: one video, with its audio when the source has it, even if the link also belongs to a
playlist. The request prefers H.264 near 1080p, but the formats the source offers decide the outcome.
The destination may end in `.mp4`, `.mkv`, `.webm` or `.mov`. A download keeps the source's own
timing; putting the clip on a production's frame clock is a separate, later step.

## Prepare the downloader

Before the first download, run `clipkin download prepare` once. It uses `uv` to install the
Distribution's locked downloader together with its JavaScript solver, and prints the executable path.
Later downloads reuse that environment.

`download` itself never installs dependencies, updates tools or fetches remote components; if the
environment is missing, it tells you the preparation command. Two host tools are also involved:
`ffmpeg` joins picture and sound when the site serves them apart, and `ffprobe` inspects the result.
[Local tools](../environment/local-tools.md#supply-host-executables-at-machine-scope) covers
installing these on macOS, Windows and Linux. The command runs directly; it needs no Runtime Profile,
no model credential and no Build.

Which sites work, and what access they require, depends on yt-dlp and on the site. A failed download
shows the downloader's own error. If a site needs extra download options, the installed
`@clipkin/yt-dlp/runtime/README.md` explains invoking the packaged tool directly. The site's own
download or export feature can also produce the same local file.

## Continue from the saved file

Record the source URL and the local path in the reference notes, and reuse the saved file whenever
you come back to the reference. Use it for [reference understanding](../creation/reference-video.md):
transcription, timed frames and grids all share that file's clock.

If footage from the download will actually appear in the new piece, declare the file with
`media:Video` and continue with [media preparation](media.md); from there the composition lines the
prepared clip up with the events of the target video.

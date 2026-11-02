# Watch face simulator

An approximate, browser-based renderer of `watchface/src/main/res/raw/watchface.xml`, useful to preview the face and take screenshots without a Wear OS emulator.

> **Not the real Watch Face Format renderer.** The scene is mirrored by hand in `simulator.html`: when you change `watchface.xml`, update the matching block in the simulator. Curved text placement and variable font weights may differ slightly from a real watch.

## Preview in a browser

Fonts cannot be loaded over `file://`, so serve the repository root:

```sh
python3 -m http.server        # from the repository root
```

Then open <http://localhost:8000/tools/simulator/simulator.html>, with optional query parameters:

| Parameter | Values | Default |
|-----------|--------|---------|
| `theme`   | `0` Luciole, `1` Bahia, `2` Abeille, `3` Banner | `0` |
| `unread`  | number of unread notifications | `0` |
| `ambient` | `1` for ambient (always-on) mode | off |
| `date`    | `bottom` (bottom right) or `top` | `bottom` |
| `time`    | `HH:MM` | now |
| `day`     | `YYYY-MM-DD` | today |
| `locale`  | locale used for the day of week (`fr`, `en`, …) | browser |
| `comp`    | SHORT_TEXT complication text (empty slot if absent) | — |
| `icon`    | complication icon: `heart` or `steps` | `heart` |

Example: `simulator.html?unread=1&date=top&comp=72&locale=fr`

## Screenshots

Requires Node.js and [Playwright](https://playwright.dev/):

```sh
cd tools/simulator
npm install
npx playwright install chromium
npm run shoot                 # or: node shoot.js [output-dir]
```

Writes to `tools/simulator/out/` (git-ignored):

- `1-active.png` … `8-theme-banner.png`: 450×450 screenshots of each state
- `overview.png`: all states on one sheet
- `edge-*.png`: edge cases (e.g. a long complication text running into the date when it is on top)

The states are listed in `shoot.js`.

# Adding notes to the Learning slides

The Learning page (`/learning`) turns hand-written study notes into slide
decks. This file is the playbook for turning a new notes file into a topic.
Follow it end to end. The last section is the checklist.

## Where things live

| What                                  | Where                                                                                   |
| ------------------------------------- | --------------------------------------------------------------------------------------- |
| Source notes (markdown)               | `../system-design/docs/<track>/NN-slug.md` in the `system-design` repo next to this one |
| Slide data, one file per topic        | `src/constants/learning/<track>/NN-slug.ts`                                             |
| Track index (topic order)             | `src/constants/learning/<track>/index.ts`                                               |
| Root index (track order)              | `src/constants/learning/index.ts`                                                       |
| Types for topics, slides, blocks      | `src/interfaces/components.ts`: `ILearningTopic` and everything `SlideBlock` uses       |
| Slide renderer / diagram renderer     | `src/components/learning.tsx` / `src/components/diagrams.tsx`                           |
| Complete, recent example to copy from | `src/constants/learning/hld/04-signs-of-a-good-system.ts`                               |

Tracks: `hld` (High-Level Design) exists. LLD notes live in
`../system-design/docs/lld` and have no track yet; see "New track" below.

## 1. Format the notes first (in system-design)

Slides are mapped from the structure of the notes file, so make it look like
its siblings before anything else:

- Filename `NN-slug.md`: two-digit number continuing the sequence in that
  folder, then a kebab-case slug. No `?`, no spaces, no trailing hyphens.
- One `## Title` at the top, then the intro bullets.
- `### N. Section` for each numbered point, with its bullets under it
  (4-space indentation for nested bullets).
- A `mermaid` code block after each idea that benefits from a picture
  (`flowchart`, `sequenceDiagram`, `erDiagram`). A markdown table for
  comparisons.
- Keep the author's meaning and structure, but reword, tighten or expand an
  explanation when that makes it clearer and easier to follow, and fix typos.
  List every wording change and every added explanation in your final
  message so the author can check it.
- Use `→` instead of `->` in prose.

## 2. Create the topic file

Copy the example topic file and change it. Rules:

- Filename: the same `NN-slug` as the notes file, with `.ts`.
- Export: `export const <PascalCaseSlug>: ILearningTopic = { ... }`
  (`signs-of-a-good-system` → `SignsOfAGoodSystem`).
- `id`: the slug without the number. It is part of the shareable URL hash
  (`#hld/<id>/<slide>`), so never change an existing id.
- `title`: short, about 30 characters at most. It renders in a small
  uppercase breadcrumb above every slide. Shorten a long question heading
  ("How do you know if the system…" → "Signs of a good system").
- `summary`: one line. Required by the type, not rendered yet.
- Imports: `import { ILearningTopic } from "../../../interfaces/components";`
  plus only the `react-icons/lu` icons the file uses, in alphabetical order.

## 3. Map the notes to slides

- First slide: title is the notes' `##` heading verbatim. Blocks are the
  intro bullets as a `list` plus one overview diagram of the whole topic.
- Then one slide per `###` section, title verbatim (keep the "1. "
  numbering). A section with a lot of content can become two slides; give
  the second a short title of its own ("When in doubt, leave it out",
  "One job each").
- Text goes into `text`, `list` and `note` blocks. List items may nest:
  `{ text, items }`. Strings support `**bold**`, `` `code` `` and
  `[links](url)`.
- Every other block type is a visual. A slide with text and a visual renders
  them side by side, text in a 440px column. `layout: "stack"` puts the
  visual under the text. A slide can be visual-only (a cards grid).

How a notes element becomes a block:

| In the notes                           | Block                                                                            |
| -------------------------------------- | -------------------------------------------------------------------------------- |
| `flowchart`                            | `flow` (nodes and edges)                                                         |
| `sequenceDiagram`                      | `sequence` (actors and steps; a `{ section }` step shades the messages after it) |
| `erDiagram` with two entities          | `entities`                                                                       |
| A linear scale (weak → strong)         | `spectrum`                                                                       |
| Table comparing a few things           | `cards` with `meta` rows; `badge` for lettered items like ACID                   |
| 3 to 5 parallel points with no diagram | `cards` with an icon each                                                        |

## 4. Draw the flow diagrams

Read the `IFlowNode` and `IFlowEdge` comments in `src/interfaces/components.ts`
before drawing.

- Coordinates are the diagram's own pixel space, scaled to fit the slide.
  `x` and `y` are the node centre. Existing diagrams are 460 to 1120 wide
  and 220 to 500 tall. Check that every node fits inside `width` and
  `height` (`x ± w/2`, `y ± h/2`).
- Defaults are `w` 180 and `h` 60 (circle 72, chip 110 by 32). Sizes in
  use: card (default kind) `w` 170 to 330, `h` 64; `tile` `w` 190, `h` 120
  to 200; `pill` `h` 54; `db` `w` 150 to 220, `h` 100 to 130; `circle` `w`
  80; `diamond` `w` 220, `h` 110; `hex` `w` 320, `h` 100; `group` wraps a
  row of tiles.
- One node per slide gets `glow: true`: the thing the slide is about.
  `tone: "good"` for outcomes, `"accent"` for the focus, `"bad"` for what to
  avoid.
- Optional things and things to avoid are `kind: "ghost"`. An edge to a
  "don't" node is `blocked: true` with `tone: "bad"`.
- `pulse: true` on the main path. A hub fanning out to a column of nodes
  uses `anchor: "x"`. A bend goes through `via: [[x, y]]` corners.
- Reuse the layout of an existing slide for the same shape of idea: a hub
  with four checks ("3. For each sub-component look into"), a pill over a
  row of tiles ("Large Problem → Top-down"), a vertical checklist ("How to
  approach System Design?").

Icons come from `react-icons/lu` only. Keep one icon per concept across
topics:

| Concept                   | Icon                           |
| ------------------------- | ------------------------------ |
| Database / storage        | `LuDatabase` with `kind: "db"` |
| Webserver                 | `LuServer`                     |
| Generator                 | `LuCog`                        |
| Aggregator                | `LuGitMerge`                   |
| User                      | `LuUser` with `kind: "circle"` |
| Client / app              | `LuMonitorSmartphone`          |
| Component / sub-component | `LuComponent`                  |
| Components (plural)       | `LuBoxes`                      |
| Scaling                   | `LuTrendingUp`                 |
| Fault tolerance           | `LuLifeBuoy`                   |
| Availability              | `LuHeartPulse`                 |
| Cache                     | `LuZap`                        |
| Outage / crash            | `LuZapOff`                     |
| Disk                      | `LuHardDrive`                  |
| Transaction               | `LuGitBranch`                  |
| Good outcome / done       | `LuCircleCheck`                |
| Wrong state               | `LuTriangleAlert`              |
| Avoid                     | `LuBan`                        |
| Not sure                  | `LuCircleHelp`                 |

Before using an icon not already in the codebase, confirm it exists:
`grep -c "LuName" node_modules/react-icons/lu/index.d.ts`.

## 5. Register it

Notes arrive in series, so a new topic always goes after the last one.
Add its import and append its export to the end of the `topics` array in
`src/constants/learning/<track>/index.ts`. The array order must match the
numbers in the filenames, so a new notes file takes the next free number
and nothing is inserted in the middle.

New track: create `src/constants/learning/<track>/index.ts` exporting
`<Track>Track: ILearningTrack` with `id`, `label` (short, like "LLD"),
`title` and `topics`, then add it to `LearningTracks` in
`src/constants/learning/index.ts`.

## 6. Verify

```sh
node_modules/.bin/prettier --write src/constants/learning
node_modules/.bin/prettier --check src/constants/learning
node_modules/.bin/tsc --noEmit -p tsconfig.json
git checkout -- tsconfig.tsbuildinfo   # tsc rewrites it; do not commit that
```

Then open `/learning` with `next dev` and step through the new topic. Every
node should sit inside its diagram and nothing should overlap. Do not commit
unless asked.

## Checklist

- [ ] Notes formatted like their siblings, numbered filename
- [ ] Topic file with the same name, PascalCase export, short title, id = slug
- [ ] First slide = `##` heading, intro bullets, overview diagram; one slide per `###`
- [ ] Text copied verbatim; typo fixes reported
- [ ] Every diagram's nodes fit inside its width and height; one glow per slide
- [ ] Only used icons imported, alphabetical, present in `react-icons/lu`
- [ ] Appended to the end of the track index; array order matches filename numbers
- [ ] prettier and tsc clean, `tsconfig.tsbuildinfo` restored

# Design System - Phthalo Cream (Hybrid)

## Philosophy
A two-layer design system. **Chrome** (navbar, login hero, footer) sits on a dark phthalo-green identity; **content** (dashboards, admin, forms, long-form reading) sits on a warm cream page. The dark layer carries the brand mark; the light layer carries the work. Bordeaux is the single accent that punches through both layers - the color of every CTA, active state, and destructive pill, so users learn to read it once.

## Color Tokens

Declared on `:root` in `apps/web/src/app/globals.css`, exposed as Tailwind utilities via `@theme inline`.

### Dark layer - nav, hero, footer
- `--green: #123624` - phthalo green. Nav bg, login hero, primary brand color
- `--green-dark: #133834` - medium jungle. Secondary dark surfaces, dark cards when needed
- `--green-mid: #5C8B73` - wintergreen dream. Links, icons, secondary text *on dark bg*, outlined button borders
- `--bordeaux: #4A1A23` - CTAs, tags, badges, active states, filled buttons (both layers)
- `--cedar: #8C603E` - borders, dividers, section separators, warm icons (usually at alpha, e.g. `cedar/30`)
- `--bone: #D8D0C2` - body text *on dark bg*, footer background

### Light layer - content
- `--bg: #EDE8DF` - page background, main content sections
- `--bg2: #F2EDE4` - card surfaces (slightly warmer white)
- `--bg3: #D8D0C2` - hover states on light, tag pills on light bg (same hex as bone)

### Text on light bg
- `--text: #123624` - headings (phthalo doubles as heading color)
- `--text-muted: #5a5248` - body text, descriptions, labels
- `--text-dim: rgba(0,0,0,0.05)` - subtle fills

### Borders
- `--border: #d0c8be` - dividers, input borders, card outlines
- `--radius: 12px` - base corner radius

### Tailwind utility aliases
`--text` is exposed as `text-ink` / `bg-ink` / `border-ink` in Tailwind. `--text-muted` is exposed as `text-muted`. All other tokens keep their literal name: `bg-green`, `bg-green-dark`, `text-green-mid`, `bg-bg`, `bg-bg2`, `bg-bg3`, `bg-bordeaux`, `bg-cedar`, `bg-bone`, `border-border`, etc.

### Legacy aliases
`--card-bg` → `--bg2`, `--card-border` → `--border`, `--muted` → `--text-muted`, `--phthalo`/`--jungle`/`--surface`/`--wintergreen`/`--white`/`--black`/`--gold`/`--umber` still resolve - new code should prefer the tokens above.

## Semantic usage

### Light layer (content pages)
| Role | Token |
|---|---|
| Page bg | **bg** (`#EDE8DF`) |
| Card / panel / form surface | **bg2** (`#F2EDE4`) |
| Hover on light, pill bg, muted fill | **bg3** (`#D8D0C2`) |
| Heading | **ink** (phthalo) |
| Body text / label | **muted** (sepia) |
| Border, divider | **border** (`#d0c8be`) |
| Primary CTA, active pill, selected state | **bordeaux** fill with **bone** text |
| Error / destructive / disabled badge | **bordeaux** at `/10` with `border bordeaux/30`, **text-bordeaux** |
| Success / public badge | **green** (phthalo) at `/5` with `border green/30`, **text-green** |
| Admin role icon | **text-green** |
| Focus ring | phthalo at `/20`–`/25` |

### Dark layer (nav, login hero, footer)
| Role | Token |
|---|---|
| Surface | **green** (`#123624`) |
| Secondary surface / dark card | **green-dark** (`#133834`) |
| Primary text | **bone** |
| Secondary text | `bone/50`–`bone/70` |
| Link / icon stroke / outline border | **green-mid** (wintergreen) |
| Separator | `cedar/30` |
| CTA | **bordeaux** (same as light layer) |

## Typography

- **Primary font:** DM Sans, loaded via `next/font` as `--font-dm-sans`, wired into Tailwind's `font-sans`. Weights 300/400/500/700/900.
- **Display/hero:** weight 900, `letter-spacing: -0.035em`
- **Section labels:** 10px, uppercase, `letter-spacing: 0.12em`, `text-muted`
- **Body:** 13px base, `line-height: 1.65`, `text-muted` (default body color is muted on light)
- **Card titles:** 18–30px, weight 900, `letter-spacing: -0.02em`, `text-ink`
- **Inline code:** `text-ink` on light cards

## Cards

- **Light content card:** `bg-bg2 border border-border rounded-xl` with subtle shadow `shadow-[0_2px_16px_rgba(18,54,36,0.06)]`
- **Light card hover (on `group`):** `hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(18,54,36,0.14)] hover:border-green/25`; inner icon square flips `bg-bg3` → `bg-green` with `text-bone`
- **Alert pill (light):** `text-bordeaux bg-bordeaux/10 border border-bordeaux/30`
- **Success pill (light):** `text-green border border-green/30 bg-green/5`
- **Dark card (inside chrome surfaces):** `bg-green-dark` with `border-cedar/30`

## Interactions

- **Hover on light cards:** `translateY(-4px)` + deeper shadow + border tints toward green
- **Transitions:** `0.4s cubic-bezier(0.22,1,0.36,1)` for transforms, `0.2s` for colors
- **Focus rings:** `ring-[#123624]/20` on light (inputs, buttons)
- **Selection:** global `::selection` is bordeaux on bone

## Components

- **shadcn/ui** under `apps/web/src/components/ui/*`. Button and Input primitives are tuned for the light layer (their common context) and use hardcoded hex matching the palette for robustness.
- **Button variants:**
  - `default` - `bg-bordeaux text-bone` (works on both layers)
  - `destructive` - identical to default (single red-family)
  - `outline` - `border-border bg-bg2 text-ink hover:bg-bg3` (light-optimized)
  - `secondary` - `bg-bg2 text-ink hover:bg-bg3`, subtle border
  - `ghost` - `hover:bg-bg3 text-ink`
  - `link` - `text-green-mid`, underline on hover
- **Input:** `bg-bg2`, `text-ink`, `border-border`, focus ring phthalo/20
- **Icons:** lucide-react, monochrome
- **Status dots:** 5–6px circles. Healthy=green-mid (wintergreen), unhealthy=cedar, offline=bordeaux

## Layout

- Max content width: `min(1120px, calc(100% - 2rem))` (narrower `760px` for the guide)
- Section padding: 56px desktop, 24px mobile
- Card gaps: ~10px grid gaps
- Nav: 60px, `bg-green` with `border-b border-cedar/30`

## Source of truth

When this doc and the code diverge, **the code wins** - specifically `apps/web/src/app/globals.css` for tokens and `apps/web/src/components/ui/*` for primitive styling. Update this doc when you intentionally change the palette or conventions.

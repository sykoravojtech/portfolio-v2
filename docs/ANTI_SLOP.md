# Anti-slop rules

Vojta's rule (2026-11-25): the site must not look AI-generated. These are the patterns that design
critics list as AI defaults. Check every new page and every copy change against them.
Sources: [Adrian Krebs, design slop in Show HN pages](https://adriankrebs.ch/blog/design-slop/),
[Refero anti-AI-slop guide](https://raw.githubusercontent.com/referodesign/refero_skill/f78b4eccf112d7a179b92afeafdd7e8684560ac2/references/anti-ai-slop.md).
`tests/anti-slop.test.ts` checks the ones a test can see.

## Type
- No accent word: never one word of a headline in italic, a serif or another colour ("Long-form *notes*"). Hierarchy comes from size, weight and layout.
- No eyebrow label above a headline that repeats the nav or the page name ("WRITING" over "Writing").
- Caps text always has letter-spacing (`.kicker`).

## Layout
- No hero metrics: no big number + small label tiles or stat banner rows. Real numbers go in a sentence or one plain line.
- No numbered section labels ("01 Now") and no numbered 1-2-3 step rows.
- A card must be clickable or hold a control. If removing its border, background and shadow loses nothing, remove them.
- No decorative coloured left or top stripe on cards.
- No identical icon-topped feature cards.

## Colour and effects
- One accent (orange). No indigo or violet, no gradient text, no gradient washes, no glassmorphism, no decorative blobs.
- A glow only where it is the subject (the orb), not on cards or buttons.

## Copy
- No "X by training, Y by habit" or other mirrored pairs; no "not just X, but Y"; no three-item rhythm for its own sake.
- No rhetorical-question calls to action ("Building something with AI? Let's talk.").
- No em dashes in new copy.
- The copy test: if it would fit a competitor's site, it is not about Vojta yet. If cutting 30% improves it, keep cutting.

## Media
- Real screenshots (demo data is fine) over illustrations. No emoji as icons.

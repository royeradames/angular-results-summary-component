# Results Summary

The existing Frontend Mentor Results Summary implementation, migrated from Angular to Next.js and Tailwind. The original Angular version remains in Git history at `0b15e36`.

The page uses the supplied local JSON scores and Hanken Grotesk font. It has no accounts, stored results, tracking or connected assessment. Continue opens an accessible native disclosure explaining the end of the sample; it does not invent another test.

## Development

Use Node 24. Run `npm ci`, `npm run dev`. Verification: `npm run lint`, `npm run typecheck`, `npm run build`, then `npm test` against the production build.

## Source and adaptations

[Official challenge](https://www.frontendmentor.io/challenges/results-summary-component-CE_K6s0maV). Supplied assets and design references remain attributed in `reference/README.md`. The data and existing implementation have Visual **72**, although the reference JPEG displays 73; the JSON remains authoritative. Overall 76 is the rounded mean of the four scores. The 65% comparison is supplied sample copy, not a computed ranking or a real user result.

Family adaptations: 16px text floor, stronger text contrast, native disclosure with visible focus, and an explicit sample label. The inherited WeatherBound title/weather icon and unrelated mock Login toggle are removed.

Live: https://results-summary.royeradames.com/

The card follows the Figma desktop (1440), tablet (768, side by side with 41 px gutters) and mobile (375) frames, centred in the first viewport. The category and lavender text colours are darker than the design's, and the result gradient starts at #6943ff instead of #7755ff, so text reaches 4.5:1. The older angular-results-summary-component.royeradames.com host redirects here. `og:site_name` and WebSite JSON-LD name the site "Results Summary". `tests/design.spec.ts` checks the frames, the site identity and every width from 320 to 1600 px in 10 px steps; `PORT` overrides the test port 4388.

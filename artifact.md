# Artifact specification: SNAP recertification recommendation copy review

## Reference

- Source template: `/Users/juliesutherland/Documents/00-SNAP (DTA project) /Prototyping/Verification recommendation list pilot copy  - codex to generate and fill tables.docx`
- Source SHA-256: `9b1d0dd80bf2fc41d5c47dd476be850a6a956224cbd39e2630477f0c4804a7a1`
- Preserve the four-page introductory material, screenshots, page size, margins, typography, and section structure.

## Page and style system

- US Letter portrait, one-inch margins.
- Retain the template's existing Word styles and table grid treatment.
- Use the existing two-column, eight-row review table as the repeated component.
- Start each additional recommendation table on a new page to keep each rule's review block distinct.
- Keep Required recommendations before the existing Optional section heading and intro.

## Table slots

Each recommendation table contains:

1. Recertification answer/trigger
2. Card title
3. Body copy
4. Example toggle label
5. Example toggle text
6. Additional toggle label
7. Additional toggle text
8. EOTSS notes on source

Populate the final notes row with the prototype rule ID and source for traceability. Use `N/A` when a recommendation has no additional toggle.

## Content routing

- Source recommendation copy from the current `VERIFICATION_RULES` array in `src/App.jsx`.
- Exclude all skipped-question/minimal-recertification recommendations.
- Exclude every rule marked `suppressible: true`.
- Preserve recommendation order from the prototype, grouped into Required and Optional sections.
- Preserve bullets, subheads, bold emphasis, and links from the prototype content.

## Fidelity gates

- No edits to the introductory or screen-copy sections.
- No placeholder text remains in generated recommendation tables.
- No clipped table text or unexpected blank pages.
- All required and optional in-scope rules appear exactly once.

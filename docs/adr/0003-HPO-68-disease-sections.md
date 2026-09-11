# 0003 — The Disease Page Omits Medical Actions

## Status

Accepted (2026-09-11). Supersedes the sentence in
[0001](0001-HPO-68-unified-entity-page.md) that has disease omit only LOINC; the
rest of 0001 stands.

## Context

0001 set the rule that missing data is expressed as absence from a type's
section config rather than as a permanent empty state, and applied it per type:
gene omits medical actions and LOINC, disease omits LOINC alone. Disease
therefore kept a Medical Actions section, matching the legacy page, which
renders one behind a tab.

The approved disease design no longer carries that section. Its content column
holds Phenotype Associations and Gene Associations, and the "On this page" panel
lists three items.

The data has not changed: `DiseaseAssociation.medicalActions` is still returned
and still populated, so this removes something the current page shows.

## Options considered

1. **Follow 0001 and keep the section.** Preserves what users have today, at the
   cost of shipping a page that does not match the approved design.
2. **Render it only when it has rows.** Splits the difference, but contradicts
   0001's rule in a subtler way: a section that exists conditionally is neither
   absent nor a genuine empty state, and whether it appears becomes a property
   of the data rather than of the page.
3. **Omit it, as the design does.** Chosen.

## Decision

The disease page renders Summary, Phenotype Associations and Gene Associations.
Medical actions are absent from its section config, the same way they are absent
from gene's.

## Consequences

- A user loses access to disease medical actions in the UI. The field is still
  returned by the annotation API and still reachable through the export dialog
  and the phenotype page's own Medical Actions section.
- `DiseaseAssociation.medicalActions` becomes unread by any page. It stays on the
  model rather than being removed, since the API returns it and the phenotype
  page's section is unaffected.
- Disease and gene now differ from phenotype in the same direction, which makes
  phenotype the only type with medical actions and LOINC. If the section returns,
  it returns as a new decision rather than by reverting this one.

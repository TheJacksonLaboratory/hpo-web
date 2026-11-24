# 0002 — Empty Sections Keep Their Canonical Position

## Status

Accepted (2026-09-10). Supersedes the empty-section ordering decision in
[0001](0001-HPO-68-unified-entity-page.md); the rest of 0001 stands.

## Context

0001 shipped the phenotype page with sections that have no rows pushed to the
bottom of the page and made inert in the "On this page" panel, on the reasoning
that a reader should meet everything with content first. It recorded the cost:
CSS `order` moves a section visually but not in the DOM, so a keyboard or
screen-reader user meets an empty section in its canonical position rather than
its visual one (WCAG 1.3.2 Meaningful Sequence, 2.4.3 Focus Order). That was
logged as deferred, not resolved.

Design review rejected the reordering. A section belongs in the same place on
every term page whether or not it has rows, so that a reader who knows where
LOINC Associations sits does not have to re-find it per term. The section's own
empty state — a heading carrying a zero count, plus a contribute call to action
— already communicates emptiness without moving anything.

## Options considered

1. **Keep sinking, make the entries selectable.** Answers the navigation
   complaint but not the design one, and preserves the DOM/visual mismatch,
   which is the part of 0001 already known to be wrong.
2. **Keep the position, keep the entries inert.** Satisfies the design, but a
   listed destination that cannot be reached is worse than one that is not
   listed, and the scroll-spy still has to skip sections the reader scrolls
   through.
3. **Keep the position, make every entry navigable.** Chosen.

## Decision

Section order is fixed by the content template and does not depend on the data.
Every section in a type's config is a navigable panel-menu entry. Emptiness is
communicated by the entry's `count` and by the section's empty state, and
changes nothing else. `PanelMenuItem` therefore carries no `disabled` flag and
the panel menu has no inert path.

## Consequences

- Resolves the WCAG 1.3.2 / 2.4.3 consequence 0001 deferred. Nothing reorders,
  so DOM order and visual order are the same order.
- `order-last` leaves `AssociationsTableBlockComponent`, and emptiness no longer
  has to be kept in sync between a host binding and the section config — two
  places that could disagree.
- The scroll-spy now considers empty sections, which forced its rule to change.
  A section is active while its bottom edge has not yet scrolled past one
  section gap below the viewport top, so it hands over as its bottom clears the
  gap above the next section. The rule this replaced keyed off a
  line at 30% of the viewport height, which no section shorter than that line
  could ever reach - and Examples and LOINC are 136px tall, so clicking either
  scrolled there and then handed the highlight to the section below.
- Navigation jumps rather than animates. `scrollIntoView` with
  `behavior: 'smooth'` moves this page zero pixels, and animating also let the
  scroll listener sample mid-flight and walk the highlight through every section
  in between.
- A click outranks scroll position until the reader scrolls away from where it
  landed. The document clamps before the last section can reach the top, so
  scroll position alone never names it; scrolling leaves the highlight wherever
  it lands, and reaching that section is what clicking is for.
- Examples loses its special case. It stays a permanently-empty section per
  0001, and is navigable like any other because its anchor renders.

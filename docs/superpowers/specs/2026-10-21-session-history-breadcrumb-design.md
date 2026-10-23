# Session History breadcrumb - design

Date: 2026-10-21
Figma: HPO_Shareable, node 315:3323 ("breadcrumb")
Related: HPO-43 (Session History component), HPO-66 (Entity Pages epic), HPO-68 (unified entity page)

## Intent

Give people a record of the path they took through the app, so they can see
how they got to the page they are on and step back along that path. A person
exploring ontology data typically hops phenotype -> disease -> gene -> another
phenotype; today nothing remembers that route, and the entity page shows a
placeholder (`SessionPlaceholderComponent`) that renders only the current
page's name.

The trail describes the journey actually taken, not the site hierarchy.

## Goals

- Track the entity pages (phenotype term, disease, gene) a person visits in one
  browser tab, in order.
- Show the trail in the existing "Session History" slot on the entity page,
  matching the Figma design.
- Let the person click any earlier step to return to it.
- Keep the trail consistent with the page on screen, including after browser
  Back/Forward and reloads.

## Non-goals

- No history across tabs, browser restarts, or devices.
- No server-side storage, accounts, or analytics on the trail.
- Search results, home, and static pages are not steps and have no icon.
- No "clear history" control and no history list/page beyond the trail itself.
- Not a site-hierarchy breadcrumb (Home > Section > Page).

## Anti-goals (failure even if it technically works)

- A trail that disagrees with the page on screen (after Back, reload, or a
  trail click).
- Duplicate steps from a reload or a same-page navigation.
- Inventing history the app did not track (the old placeholder avoided this;
  the new trail must only contain pages actually visited in this tab).

## Behaviour (decided with the product owner)

The trail is a log of steps plus a pointer to the step that is the page on
screen (`current`). Nothing in the trail is erased by moving around in it.

1. **Steps.** Only term, gene and disease pages add a step. Each step has a
   type, an entity id, and a display name.
2. **Arriving by a link between entity pages** appends a step at the very end
   of the log and makes it current. If the person was on an earlier step, the
   steps after it are left behind: the new step records how many (`skipped`),
   and the row shows them collapsed (see Presentation). Example: `A > B > C > D`,
   click `B`, follow a link to `E` -> `A B C D E`, current `E`, with `C D`
   skipped. A link to the same entity as the last step just makes the last
   step current. (Skipped ranges form only after Back/Forward, since a click
   on a step also appends.)
3. **Reload, or navigating to the page already shown,** adds nothing.
4. **Clicking a step** (in the row or in a menu) navigates to it and, like a
   link, appends the page at the end as a new step and makes it current. Earlier
   steps are never removed or moved, so the trail shows the order things were
   visited in, repeats included. Clicking leads to the same page as the last
   step adds nothing.
5. **Arriving from a non-entity page** (search, home, static pages, or a first
   visit in the tab) **starts a new trail**; the entity opened becomes step one.
   Following links between entity pages continues the trail.
6. **Browser Back/Forward** keeps `current` matched to the page on screen: it
   moves to the most recent step for that entity, or, when the entity is not in
   the trail (for example after Clear), appends it as a new step. Back to a
   non-entity page leaves the trail as is.
7. **Clear.** A "Clear history" button, shown when the trail has more than one
   step, resets the trail to just the page on screen.
8. **Lifetime.** Per browser tab: survives reloads and in-app navigation, is
   cleared when the tab closes. A shared link or a new tab starts empty.
   (sessionStorage, wrapped so it degrades to in-memory when unavailable.)

## Presentation

Follows the Figma frame (full width, light-blue band, small "Session History"
label above a single row of steps), with a "Clear history" text button at the
right end of the label line.

- Each step: a type icon (phenotype, disease, gene, as in the design) and the
  entity name, as a link in the brand blue, separated by chevrons. The current
  step is plain text with `aria-current="page"`; there is no trailing chevron.
- The row never wraps and has no fixed step limit: it shows as many steps as
  fit the width, always including the current step, extending to its earlier
  side first and then its later side.
- Steps that do not fit collapse into a "..." button at the start of the row
  (earlier steps) and/or at the end (later steps). The button opens a dropdown
  menu listing the hidden steps in trail order, each with its type icon and
  name; choosing one behaves like clicking it in the row.
- Steps left behind by a branch (rule 2) collapse into a "..." button between
  the step branched from and the new step, with the same kind of menu. When the
  current step is inside that range the range is shown in full.
- The current step shortens with an ellipsis if it alone is too wide.

## Where it lives

- The slot is the existing `SessionPlaceholderComponent` position in
  `entity-page.component.html`. The placeholder is replaced, not kept beside it.
- The trail state belongs to a root-provided service, not the entity page
  component, because the page component is reused when navigating between two
  entities of the same type and the trail must outlive page instances.
- Entity routes are `term/:id`, `gene/:id`, `disease/:id`
  (`src/app/app.routes.ts`), distinguished by `data.entityType`.
- A step's display name is only known after the entity resolves
  (`EntityDataResolverService`).

## Constraints

- Angular standalone components; Tailwind with the required `tw-` prefix and
  rem units (project styling conventions); PrimeNG theme tokens as used by the
  existing placeholder.
- TSDoc-only comments, per project convention.

## My calls (not yet confirmed - review these)

- The trail stores up to 50 steps; the oldest are dropped past that.
- The current step is not a link and is styled as the current page; the design
  shows every item identically and a stray chevron after the last item, which
  I read as design oversights. No trailing chevron.
- Consecutive identical steps (same type and id) are never stored twice.
- A full page load (typed URL, bookmark, external link) of an entity other than
  the current step starts a new trail; a full load of the same entity is a
  reload and adds nothing. Header search and autocomplete count as search, so
  an entity opened from them starts a new trail (rule 5).
- A step is recorded only once its entity has resolved, using the resolved
  entity's canonical id and name. A failed or superseded resolve (error page,
  or a quick second navigation) records nothing, so a fast A > B > C click-through
  records only the pages that finished loading.
- A step links to the bare `term/:id`, `gene/:id` or `disease/:id` route, not
  to remembered query params, fragments or section state. Trail clicks go
  through a handler that moves the current step, not a plain link that appends.

## Left to the builder

- How to detect "arrived from an entity page" vs. "from elsewhere", and how to
  tell Back/Forward from a link (router events, history state, or other).
- What "..." does when activated (expand in place, popover, or non-interactive).
- Exact storage shape, icon source, and the accessible markup (nav landmark,
  `aria-current` on the last step).
- Tests.

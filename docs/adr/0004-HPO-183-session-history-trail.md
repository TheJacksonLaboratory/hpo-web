# 0004 — Session History Is a Per-Tab Log Kept in a Root Service

## Status

Accepted (2026-10-26).

## Context

The entity page shows a Session History placeholder. The design calls for a
breadcrumb of the entity pages a person has visited, so they can see how they
reached the current page and step back along that route. The trail describes the
journey taken, not the site hierarchy.

The term, gene and disease pages share one entity page component, which the
router reuses when navigating between two entities of the same type. Display
names are known only after an entity resolves.

## Options considered

1. **A stack that truncates on branch, like the browser's history.** Familiar,
   and the trail always agrees with Back. It discards steps the person actually
   visited, so the trail stops describing the journey taken.
2. **State on the entity page component.** No new service. The component is
   reused across entities of the same type and destroyed when the person visits
   a non-entity page, so the trail would not outlive it.
3. **A fixed number of visible steps.** Simple to lay out, but hides steps that
   would fit and cannot adapt to narrow screens.
4. **An append-only log with a pointer to the current step, owned by a
   root-provided service and persisted in sessionStorage.** Chosen.

## Decision

The trail is an append-only log of entity steps plus a pointer to the step on
screen. Moving through it, whether by a step click or by Back and Forward,
changes the pointer or appends; it never removes steps. Steps left behind by a
branch are recorded on the step that follows them.

A root-provided service owns the trail and writes it to sessionStorage, so it
survives reloads and in-app navigation and ends with the tab. Arriving on an
entity page from a non-entity page starts a new trail. A step is recorded only
once its entity has resolved. The row shows as many steps as fit its width and
collapses the rest into menus. The log is capped at 50 steps.

## Consequences

- The trail can contain the same entity more than once, and a click on a step
  appends rather than rewinding, so it grows faster than a stack would.
- The oldest steps are dropped past 50.
- A shared link, a new tab or a browser restart starts with an empty trail.
- The service listens to router events, so any new way of navigating between
  entity pages must pass through the router or the trail will not see it.
- Layout depends on measured widths, which jsdom cannot provide; the component
  tests mock the measurements.

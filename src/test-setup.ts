import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv({
  errorOnUnknownElements: true,
  errorOnUnknownProperties: true,
});

// jsdom has no ResizeObserver, but several PrimeNG components (p-tablist,
// p-select) bind one in ngAfterViewInit. Layout isn't observable in jsdom
// anyway, so a no-op stub is enough to let those components render.
if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    observe(): void { /* no-op */ }
    unobserve(): void { /* no-op */ }
    disconnect(): void { /* no-op */ }
  };
}

/// <reference types="cypress" />

// Smoke-checks the shared EntityPageComponent (HPO-68) on the phenotype/term
// route. Backend calls are stubbed so this is deterministic and does not
// depend on ontology.jax.org being up.
describe('Browse term page (shared entity page)', () => {
  const TERM = {
    id: 'HP:0001250',
    name: 'Seizure',
    definition: 'A seizure is an intermittent abnormality of nervous system physiology.',
    synonyms: ['Epileptic seizure'],
    comment: '',
    xrefs: [],
    descendantCount: 2,
    publicationReferences: ['PMID:12345678', 'PMID:87654321'],
    translations: [],
  };

  const PARENTS = [{ id: 'HP:0012638', name: 'Abnormal nervous system physiology', descendantCount: 500 }];

  const CHILDREN = [
    { id: 'HP:0002133', name: 'Status epilepticus', descendantCount: 0 },
    { id: 'HP:0011146', name: 'Enuresis nocturna', descendantCount: 1 },
  ];

  const ASSOCIATIONS = {
    diseases: [
      {
        id: 'OMIM:100100',
        name: 'Test disease one',
        mondoId: 'MONDO:0000001',
        description: '',
        dbGenes: [{ geneSymbol: 'BRCA1', geneId: 672 }],
      },
    ],
    genes: [{ id: 'NCBIGene:672', name: 'BRCA1' }],
    assays: [],
    medicalActions: [
      { id: 'MAXO:0000001', name: 'Physical therapy', relations: ['treats'], sources: ['PMID:11111111'] },
    ],
  };

  beforeEach(() => {
    cy.intercept('GET', '**/hp/terms/HP:0001250', TERM).as('term');
    cy.intercept('GET', '**/hp/terms/HP:0001250/parents', PARENTS).as('parents');
    cy.intercept('GET', '**/hp/terms/HP:0001250/children', CHILDREN).as('children');
    cy.intercept('GET', '**/network/annotation/HP:0001250', ASSOCIATIONS).as('associations');

    cy.visit('/browse/term/HP:0001250', {
      onBeforeLoad(win) {
        cy.spy(win.console, 'error').as('consoleError');
      },
    });
    cy.wait(['@term', '@parents', '@children', '@associations']);
  });

  it('renders the term summary', () => {
    cy.get('#summary').should('contain.text', 'Seizure');
    cy.get('#summary').should('contain.text', 'HP:0001250');
    cy.get('#summary').should('contain.text', TERM.definition);
  });

  it('makes the whole id chip a copy button', () => {
    cy.get('#summary app-id-badge button')
      .should('have.attr', 'aria-label', 'Copy HP:0001250')
      .and('contain.text', 'HP:0001250');
    // the id itself is inside the button, so the entire chip is clickable
    cy.get('#summary app-id-badge').find('button').should('have.length', 1);
  });

  it('confirms a copy with a tick, then reverts, without shifting the chip', () => {
    cy.get('#summary app-id-badge button').then(($b) => {
      const before = $b[0].getBoundingClientRect().width;
      cy.get('#summary app-id-badge button').click();
      cy.get('#summary app-id-badge button i.pi-check').should('exist');
      cy.get('#summary app-id-badge [role="status"]').should('have.text', 'Copied HP:0001250');
      // the tick glyph is wider than the copy glyph, so the icon box is pinned
      cy.get('#summary app-id-badge button').then(($a) => {
        expect($a[0].getBoundingClientRect().width).to.equal(before);
      });
      cy.get('#summary app-id-badge button i.pi-copy', { timeout: 4000 }).should('exist');
    });
  });

  it('renders the hierarchy tree with parent and child links', () => {
    cy.contains('app-hierarchy-tree a', 'Abnormal nervous system physiology').should('exist');
    cy.contains('app-hierarchy-tree a', 'Status epilepticus').should('exist');
    cy.contains('app-hierarchy-tree a', 'Enuresis nocturna').should('exist');
  });

  it('renders every association section with the right row content', () => {
    cy.get('#disease-associations').should('contain.text', 'Test disease one').and('contain.text', 'Disease Associations (1)');
    cy.get('#gene-associations').should('contain.text', 'BRCA1').and('contain.text', 'Gene Associations (1)');
    cy.get('#medical-actions').should('contain.text', 'Physical therapy');
    cy.get('#loinc-associations').should('contain.text', 'LOINC Associations (0)')
      .and('contain.text', 'Interested in Contributing? Get Started')
      .and('not.contain.text', 'No LOINC associations found');
  });

  it('renders column headers in every association table', () => {
    // Regression guard: projected <th> cells silently rendered nothing when they
    // carried PrimeNG directives that inject Table (NG0201) - the table body
    // still rendered, so only the header row went missing.
    cy.get('#disease-associations thead').should('contain.text', 'Disease Id').and('contain.text', 'Disease Name');
    cy.get('#gene-associations thead').should('contain.text', 'Gene Id').and('contain.text', 'Gene Symbol');
    cy.get('#medical-actions thead').should('contain.text', 'MaXo Id').and('contain.text', 'Relation');
  });

  it('renders the on-this-page panel with every section navigable, empty ones included', () => {
    cy.get('app-on-this-page-panel-menu').contains('button', 'Summary').should('exist');
    cy.get('app-on-this-page-panel-menu').contains('button', 'LOINC Associations').should('not.be.disabled');
    cy.get('app-on-this-page-panel-menu').contains('button', 'Examples').should('not.be.disabled');
    cy.get('app-on-this-page-panel-menu').contains('button', 'Disease Associations').should('not.be.disabled');
  });

  it('lists panel items in page order, whether or not a section has rows', () => {
    cy.get('app-on-this-page-panel-menu button').then(($b) => {
      const labels = [...$b].map((b) => b.textContent!.trim().replace(/\s+/g, ' '));
      expect(labels).to.deep.equal([
        'Summary',
        'Examples (0)',
        'Disease Associations (1)',
        'Gene Associations (1)',
        'Medical Actions (1)',
        'LOINC Associations (0)',
        'Publications (2)',
      ]);
    });
  });

  it('renders sections in canonical page order, empty ones in place', () => {
    // Regression guard: empty sections used to carry `order-last`, which moved
    // them visually without moving them in the DOM.
    const ids = [
      '#examples',
      '#disease-associations',
      '#gene-associations',
      '#medical-actions',
      '#loinc-associations',
      '#publications',
    ];
    cy.get(ids.join(', ')).then(($sections) => {
      expect([...$sections].map((s) => `#${s.id}`), 'DOM order').to.deep.equal(ids);
      const tops = [...$sections].map((s) => s.getBoundingClientRect().top);
      expect(tops, 'visual order matches DOM order').to.deep.equal([...tops].sort((a, b) => a - b));
    });
  });

  it('renders section descriptions as a subheader, with no qualifier in either label', () => {
    // The copy itself is pending curator review, so assert the subheader is
    // present and non-empty rather than pinning exact prose that will change.
    for (const id of ['#disease-associations', '#gene-associations']) {
      cy.get(`${id} h2`).next('p').invoke('text').should('match', /\S/);
    }
    cy.get('#gene-associations h2').should('contain.text', 'Gene Associations').and('not.contain.text', 'Inferred');
    cy.get('app-on-this-page-panel-menu')
      .contains('button', 'Gene Associations')
      .should('not.contain.text', 'Inferred');
  });

  it('renders Examples as a contribute-only section', () => {
    cy.get('#examples').should('contain.text', '(0)')
      .and('contain.text', 'Interested in Contributing? Get Started')
      .and('not.contain.text', 'Showing');
  });

  it('renders publications as a table of PMIDs, with no button left in the summary', () => {
    cy.get('#publications').should('contain.text', 'Publications (2)');
    cy.get('#publications thead').should('contain.text', 'Publication');
    cy.get('#publications tbody a')
      .should('have.length', 2)
      .first()
      .should('contain.text', 'PMID:12345678')
      .and('have.attr', 'target', '_blank');
    cy.get('#summary').should('not.contain.text', 'View Publication');
  });

  it('renders both right-rail actions', () => {
    cy.contains('app-export-associations-button', 'Download Associations').should('exist');
    cy.get('app-report-entry-issue-button a')
      .should('have.attr', 'target', '_blank')
      .and('have.attr', 'href')
      .and('include', 'Issue%20with%20HP%3A0001250');
  });

  it('has no console errors', () => {
    cy.get('@consoleError').should('not.have.been.called');
  });

  it('follows the scroll position in the panel menu, not just clicks', () => {
    // ScrollDispatcher registers its listener with runOutsideAngular, so setting
    // the active anchor in that subscription schedules no change detection on
    // its own - the highlight would only appear when some unrelated event
    // happened to trigger a tick. Clicking always worked because a click
    // handler is already in the zone. should(callback) retries, which .then()
    // does not - scrolled() is throttled, so it lands after the scroll settles.
    // Asserting the resolved colour rather than the class name also proves the
    // --p-teal-300 token the active pill uses actually emits from the preset.
    const ACTIVE_BG = 'rgb(148, 225, 220)';
    const expectActive = (matcher: (label: string) => void) =>
      cy.get('app-on-this-page-panel-menu button').should(($b) => {
        const active = [...$b].filter(
          (b) => b.ownerDocument.defaultView!.getComputedStyle(b).backgroundColor === ACTIVE_BG,
        );
        expect(active, 'exactly one highlighted item').to.have.length(1);
        matcher(active[0].textContent!.trim().replace(/\s+/g, ' '));
      });

    expectActive((l) => expect(l, 'summary active at rest').to.contain('Summary'));

    cy.scrollTo('bottom');
    // Scrolling names whichever section covers the activation offset. The page
    // clamps before Publications can reach the top, so scrolling alone never
    // names it - clicking is what reaches it, covered separately below.
    expectActive((l) => expect(l, 'highlight moved off Summary').to.not.contain('Summary'));

    cy.scrollTo('top');
    expectActive((l) => expect(l, 'highlight came back').to.contain('Summary'));
  });

  it('scrolls to a section when its panel-menu item is clicked', () => {
    cy.window().its('scrollY').should('eq', 0);
    cy.get('app-on-this-page-panel-menu').contains('button', 'Medical Actions').click({ scrollBehavior: false });
    cy.window().its('scrollY').should('be.greaterThan', 0);
    cy.get('#medical-actions').should('be.visible');
  });

  it('lands a clicked section at its own scroll-margin, not inside the previous one', () => {
    // Asserted against the section's computed scroll-margin-top rather than a
    // fixed number, so tuning the offset does not need a test edit. What must
    // hold at any value is the second assertion: an offset larger than the gap
    // above the section left the previous one's paginator on screen.
    cy.get('app-on-this-page-panel-menu').contains('button', 'Gene Associations').click({ scrollBehavior: false });
    cy.get('#gene-associations').should(($s) => {
      const el = $s[0];
      const offset = parseFloat(el.ownerDocument.defaultView!.getComputedStyle(el).scrollMarginTop);
      expect(el.getBoundingClientRect().top, 'heading lands at its scroll-margin').to.be.closeTo(offset, 2);
    });
    cy.get('#disease-associations').should(($prev) => {
      expect($prev[0].getBoundingClientRect().bottom, 'previous section ends off screen').to.be.at.most(1);
    });
  });

  it('keeps a short section highlighted after clicking it, rather than skipping to the next', () => {
    // Examples is 136px tall. An activation line further down the viewport sat
    // below it entirely, so the scroll that followed the click immediately
    // reassigned the highlight to Disease Associations.
    cy.get('app-on-this-page-panel-menu').contains('button', 'Examples').click({ scrollBehavior: false });
    cy.get('#examples').should('be.visible');
    // The spy is throttled at 100ms, so the click's own highlight would pass
    // this assertion before the spy could overrule it. Waiting first is the
    // point: it proves the highlight survives the spy, not that it was set.
    cy.wait(500);
    cy.get('app-on-this-page-panel-menu')
      .contains('button', 'Examples')
      .should('have.css', 'background-color', 'rgb(148, 225, 220)');
  });

  it('keeps a clicked section highlighted where the page clamps before reaching it', () => {
    // Publications needs more scroll than the document has, so it lands at the
    // page end with LOINC still covering the handover point. The click has to
    // outrank position until the reader scrolls away.
    cy.get('app-on-this-page-panel-menu').contains('button', 'Publications').click({ scrollBehavior: false });
    cy.wait(500); // long enough for the throttled scroll listener to have run
    cy.get('app-on-this-page-panel-menu')
      .contains('button', 'Publications')
      .should('have.css', 'background-color', 'rgb(148, 225, 220)');

    // and scrolling releases it
    cy.scrollTo(0, 900);
    cy.get('app-on-this-page-panel-menu')
      .contains('button', 'Publications')
      .should('not.have.css', 'background-color', 'rgb(148, 225, 220)');
  });
});

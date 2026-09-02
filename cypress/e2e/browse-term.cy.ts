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

  it('renders the on-this-page panel with a disabled item for the empty LOINC section', () => {
    cy.get('app-on-this-page-panel-menu').contains('button', 'Summary').should('exist');
    cy.get('app-on-this-page-panel-menu').contains('button', 'LOINC Associations').should('be.disabled');
    cy.get('app-on-this-page-panel-menu').contains('button', 'Disease Associations').should('not.be.disabled');
  });

  it('lists panel items with populated sections first and empty ones disabled', () => {
    cy.get('app-on-this-page-panel-menu button').then(($b) => {
      const labels = [...$b].map((b) => b.textContent!.trim().replace(/\s+/g, ' '));
      expect(labels).to.deep.equal([
        'Summary',
        // populated first...
        'Disease Associations (1)',
        'Gene Associations (1)',
        'Medical Actions (1)',
        'Publications (2)',
        // ...then the empty ones, in canonical order
        'Examples (0)',
        'LOINC Associations (0)',
      ]);
    });
    cy.get('app-on-this-page-panel-menu').contains('button', 'Examples').should('be.disabled');
    // Publications is populated from the term's PMIDs, so it is enabled
    cy.get('app-on-this-page-panel-menu').contains('button', 'Publications').should('not.be.disabled');
  });

  it('renders every empty section below every populated one', () => {
    const top = (sel: string) => cy.get(sel).then(($e) => $e[0].getBoundingClientRect().top);
    cy.get('#medical-actions').then(($populated) => {
      const populatedTop = $populated[0].getBoundingClientRect().top;
      for (const empty of ['#examples', '#loinc-associations']) {
        cy.get(empty).then(($e) => {
          expect($e[0].getBoundingClientRect().top, `${empty} below #medical-actions`).to.be.greaterThan(populatedTop);
        });
      }
    });
    // and the empty ones keep their canonical order relative to each other
    top('#examples').then((examplesTop) => {
      top('#loinc-associations').then((loincTop) => {
        expect(loincTop).to.be.greaterThan(examplesTop);
      });
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

  it('keeps the rail buttons on one line at the design width', () => {
    // The label needs 162.7px and the rail gives 164px, so the chrome around it
    // (padding, icon width) has to stay trimmed or the label wraps and the
    // button grows from 38px to 54px.
    cy.get('aside app-export-associations-button button').then(($b) => {
      const r = $b[0].getBoundingClientRect();
      expect(r.width, 'button width').to.be.closeTo(234, 1);
      expect(r.height, 'button height - 54 means the label wrapped').to.be.closeTo(38, 1);
    });
    cy.get('aside app-report-entry-issue-button a').then(($b) => {
      expect($b[0].getBoundingClientRect().height, 'report button height').to.be.closeTo(38, 1);
    });
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

  it('visual check - viewport only', () => {
    cy.screenshot('term-page-viewport', { capture: 'viewport' });
  });

  it('follows the scroll position in the panel menu, not just clicks', () => {
    // The IntersectionObserver callback runs outside Angular's zone, so setting
    // the active anchor there schedules no change detection on its own - the
    // highlight would only appear when some unrelated event happened to trigger
    // a tick. Clicking always worked because a click handler is already in the
    // zone. should(callback) retries, which .then() does not - the observer
    // fires a frame or two after the scroll settles.
    const ACTIVE = 'bg-[#94e1dc]';
    const expectActive = (matcher: (label: string) => void) =>
      cy.get('app-on-this-page-panel-menu button').should(($b) => {
        const active = [...$b].filter((b) => b.className.includes(ACTIVE));
        expect(active, 'exactly one highlighted item').to.have.length(1);
        matcher(active[0].textContent!.trim().replace(/\s+/g, ' '));
      });

    expectActive((l) => expect(l, 'summary active at rest').to.contain('Summary'));

    cy.scrollTo('bottom');
    // Empty sections (Examples, LOINC) are skipped, so the last navigable
    // section stays marked rather than the highlight disappearing.
    expectActive((l) => {
      expect(l, 'highlight moved off Summary').to.not.contain('Summary');
      expect(l, 'not an empty section').to.not.contain('(0)');
    });

    cy.scrollTo('top');
    expectActive((l) => expect(l, 'highlight came back').to.contain('Summary'));
  });

  it('scrolls to a section when its panel-menu item is clicked', () => {
    cy.window().its('scrollY').should('eq', 0);
    cy.get('app-on-this-page-panel-menu').contains('button', 'Medical Actions').click();
    cy.window().its('scrollY').should('be.greaterThan', 0);
    cy.get('#medical-actions').should('be.visible');
  });
});

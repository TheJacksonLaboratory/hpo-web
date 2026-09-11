/// <reference types="cypress" />

// Smoke-checks the shared EntityPageComponent (HPO-68) on the disease route.
// Backend calls are stubbed so this is deterministic and does not depend on
// ontology.jax.org being up.
describe('Browse disease page (shared entity page)', () => {
  const DISEASE = {
    id: 'OMIM:254940',
    name: 'Carey-Fineman-Ziter syndrome',
    mondoId: 'MONDO:0031415',
  };

  // Deliberately not in canonical order: Nervous System is last in the body
  // system list but first here, so the ordering has to come from the page.
  const ASSOCIATIONS = {
    disease: DISEASE,
    categories: {
      'Nervous System': [
        { id: 'HP:0001250', name: 'Seizure', metadata: { onset: null, frequency: 'Frequent', sources: ['PMID:12345678'] } },
      ],
      Growth: [
        { id: 'HP:0004322', name: 'Short stature', metadata: { onset: null, frequency: 'Frequent', sources: [] } },
        { id: 'HP:0001510', name: 'Growth delay', metadata: { onset: 'Childhood onset', frequency: 'Very frequent', sources: [] } },
      ],
      Inheritance: [
        { id: 'HP:0000007', name: 'Autosomal recessive inheritance', metadata: { onset: null, frequency: null, sources: [] } },
      ],
    },
    genes: [
      { id: 'NCBIGene:389827', name: 'MYMK' },
      { id: 'NCBIGene:101929726', name: 'MYMX' },
    ],
    medicalActions: [{ id: 'MAXO:0000001', name: 'Physical therapy', relations: ['treats'], sources: [] }],
  };

  beforeEach(() => {
    cy.intercept('GET', '**/network/annotation/OMIM:254940', ASSOCIATIONS).as('associations');

    cy.visit('/disease/OMIM:254940', {
      onBeforeLoad(win) {
        cy.spy(win.console, 'error').as('consoleError');
      },
    });
    cy.wait('@associations');
  });

  it('serves the same page from the legacy /browse/disease path', () => {
    cy.visit('/browse/disease/OMIM:254940');
    cy.wait('@associations');
    cy.location('pathname').should('match', /^\/disease\/OMIM(%3A|:)254940$/);
    cy.get('#summary h1').should('have.text', 'Carey-Fineman-Ziter syndrome');
  });

  it('renders the disease name and both id chips', () => {
    cy.get('#summary h1').should('have.text', 'Carey-Fineman-Ziter syndrome');
    cy.get('#summary').should('contain.text', 'OMIM:254940').and('contain.text', 'MONDO:0031415');
  });

  it('renders no hierarchy rail and no language selector', () => {
    cy.get('app-hierarchy-tree').should('not.exist');
    cy.get('#summary p-select').should('not.exist');
  });

  it('omits the sections the disease page does not carry', () => {
    cy.get('#medical-actions').should('not.exist');
    cy.get('#loinc-associations').should('not.exist');
    cy.get('#publications').should('not.exist');
    cy.get('#examples').should('not.exist');
  });

  it('lists exactly the three page sections in the panel menu', () => {
    cy.get('app-on-this-page-panel-menu button').then(($b) => {
      const labels = [...$b].map((b) => b.textContent!.trim().replace(/\s+/g, ' '));
      expect(labels).to.deep.equal([
        'Summary',
        'Phenotype Associations (4)',
        'Gene Associations (2)',
      ]);
    });
  });

  it('renders the phenotype table with all five columns', () => {
    cy.get('#phenotype-associations thead').within(() => {
      for (const header of ['Term ID', 'Term Name', 'Onset', 'Frequency', 'Source(s)']) {
        cy.root().should('contain.text', header);
      }
    });
  });

  it('groups phenotypes by body system, in the canonical order', () => {
    cy.get('#phenotype-associations tbody td[colspan]').then(($cells) => {
      const groups = [...$cells].map((cell) => cell.textContent!.trim().replace(/\s+/g, ' '));
      expect(groups).to.deep.equal(['Inheritance (1)', 'Growth (2)', 'Nervous System (1)']);
    });
  });

  it('keeps each group\'s rows together under its subheader', () => {
    cy.get('#phenotype-associations tbody tr').then(($rows) => {
      const text = [...$rows].map((row) => row.textContent!.trim().replace(/\s+/g, ' '));
      const growthHeader = text.findIndex((t) => t.startsWith('Growth ('));
      expect(text[growthHeader + 1], 'first row under Growth').to.contain('Short stature');
      expect(text[growthHeader + 2], 'second row under Growth').to.contain('Growth delay');
    });
  });

  it('shows a dash for an onset or frequency the annotation does not carry', () => {
    cy.get('#phenotype-associations').contains('tr', 'Autosomal recessive inheritance').within(() => {
      cy.get('td').eq(2).should('have.text', '-');
      cy.get('td').eq(3).should('have.text', '-');
    });
  });

  it('labels each source by the database it came from', () => {
    cy.get('#phenotype-associations').contains('tr', 'Seizure').should('contain.text', 'PubMed');
    // an annotation with no sources of its own falls back to the disease id
    cy.get('#phenotype-associations').contains('tr', 'Short stature').should('contain.text', 'OMIM');
  });

  it('links phenotype rows to their term page', () => {
    cy.get('#phenotype-associations').contains('a', 'HP:0001250').should('have.attr', 'href').and('include', '/term/HP:0001250');
  });

  it('renders the gene table and links each row to its gene page', () => {
    cy.get('#gene-associations').should('contain.text', 'Gene Associations (2)').and('contain.text', 'MYMK');
    cy.get('#gene-associations thead').should('contain.text', 'Gene ID').and('contain.text', 'Gene Symbol');
    cy.get('#gene-associations')
      .contains('a', 'NCBIGene:389827')
      .should('have.attr', 'href')
      .and('include', '/gene/NCBIGene:389827');
  });

  it('reports OMIM entries to the HPO tracker', () => {
    cy.get('app-report-entry-issue-button a')
      .should('have.attr', 'href')
      .and('include', 'obophenotype/human-phenotype-ontology');
  });

  it('has no console errors', () => {
    cy.get('@consoleError').should('not.have.been.called');
  });

  describe('an ORPHA disease', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/network/annotation/ORPHA:1358', {
        ...ASSOCIATIONS,
        disease: { id: 'ORPHA:1358', name: 'Carey-Fineman-Ziter syndrome' },
      }).as('orphaAssociations');
      cy.visit('/disease/ORPHA:1358');
      cy.wait('@orphaAssociations');
    });

    it('sends issue reports to Orphanet, which curates them', () => {
      cy.get('app-report-entry-issue-button a').should('have.attr', 'href').and('include', 'orpha.net');
    });
  });
});

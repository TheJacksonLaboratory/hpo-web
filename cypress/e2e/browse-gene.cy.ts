/// <reference types="cypress" />

// Smoke-checks the shared EntityPageComponent (HPO-68) on the gene route.
// Backend calls are stubbed so this is deterministic and does not depend on
// ontology.jax.org or NCBI being up.
describe('Browse gene page (shared entity page)', () => {
  const ENTREZ = {
    result: {
      '1497': {
        uid: '1497',
        name: 'CTNS',
        description: 'cystinosin',
        chromosome: '17',
        maplocation: '17p13.2',
        summary:
          'This gene encodes a seven-transmembrane domain protein that functions to transport cystine out of lysosomes. [provided by RefSeq, Jul 2009]',
        otheraliases: 'CTNS-LSB, PQLC4, SLC66A4',
      },
    },
  };

  const ASSOCIATIONS = {
    phenotypes: [
      { id: 'HP:0001250', name: 'Seizure' },
      { id: 'HP:0000252', name: 'Microcephaly' },
    ],
    diseases: [
      { id: 'OMIM:219800', name: 'Cystinosis, nephropathic', mondoId: 'MONDO:0009244', description: '' },
    ],
    genes: [],
    assays: [],
    medicalActions: [],
  };

  beforeEach(() => {
    cy.intercept('GET', '**/esummary.fcgi*', ENTREZ).as('entrez');
    cy.intercept('GET', '**/network/annotation/NCBIGene:1497', ASSOCIATIONS).as('associations');

    cy.visit('/browse/gene/NCBIGene:1497', {
      onBeforeLoad(win) {
        cy.spy(win.console, 'error').as('consoleError');
      },
    });
    cy.wait(['@entrez', '@associations']);
  });

  it('renders the gene summary from the Entrez record', () => {
    cy.get('#summary h1').should('have.text', 'CTNS');
    cy.get('#summary').should('contain.text', 'seven-transmembrane domain protein');
    cy.get('#summary').should('contain.text', 'Chromosomal Location').and('contain.text', '17p13.2');
    cy.get('#summary').should('contain.text', 'Synonyms');
    for (const alias of ['CTNS-LSB', 'PQLC4', 'SLC66A4']) {
      cy.get('#summary').should('contain.text', alias);
    }
  });

  it('makes the whole id chip a copy button', () => {
    cy.get('#summary app-id-badge button')
      .should('have.attr', 'aria-label', 'Copy NCBIGene:1497')
      .and('contain.text', 'NCBIGene:1497');
  });

  it('renders no hierarchy rail - a gene has none', () => {
    cy.get('app-hierarchy-tree').should('not.exist');
  });

  it('renders no language selector - a gene has no translations', () => {
    cy.get('#summary p-select').should('not.exist');
  });

  it('renders both association sections with their row content', () => {
    cy.get('#phenotype-associations')
      .should('contain.text', 'Phenotype Associations (2)')
      .and('contain.text', 'Seizure')
      .and('contain.text', 'Microcephaly');
    cy.get('#disease-associations')
      .should('contain.text', 'Disease Associations (1)')
      .and('contain.text', 'Cystinosis, nephropathic');
  });

  it('renders column headers in both association tables', () => {
    cy.get('#phenotype-associations thead').should('contain.text', 'Term ID').and('contain.text', 'Term Name');
    cy.get('#disease-associations thead').should('contain.text', 'Disease ID').and('contain.text', 'Disease Name');
  });

  it('links each row out to its own entity page', () => {
    cy.get('#phenotype-associations tbody a')
      .first()
      .should('have.attr', 'href')
      .and('include', '/browse/term/HP:');
    cy.get('#disease-associations tbody a')
      .first()
      .should('have.attr', 'href')
      .and('include', '/browse/disease/OMIM:219800');
  });

  it('omits the sections a gene has no field for', () => {
    cy.get('#medical-actions').should('not.exist');
    cy.get('#loinc-associations').should('not.exist');
    cy.get('#examples').should('not.exist');
    cy.get('#publications').should('not.exist');
  });

  it('lists exactly the three page sections in the panel menu', () => {
    cy.get('app-on-this-page-panel-menu button').then(($b) => {
      const labels = [...$b].map((b) => b.textContent!.trim().replace(/\s+/g, ' '));
      expect(labels).to.deep.equal(['Summary', 'Phenotype Associations (2)', 'Disease Associations (1)']);
    });
  });

  it('scrolls to a section when its panel-menu item is clicked', () => {
    cy.window().its('scrollY').should('eq', 0);
    cy.get('app-on-this-page-panel-menu')
      .contains('button', 'Disease Associations')
      .click({ scrollBehavior: false });
    cy.window().its('scrollY').should('be.greaterThan', 0);
    cy.get('#disease-associations').should('be.visible');
  });

  it('renders both right-rail actions', () => {
    cy.contains('app-export-associations-button', 'Download Associations').should('exist');
    cy.get('app-report-entry-issue-button a')
      .should('have.attr', 'href')
      .and('include', 'NCBIGene%3A1497');
  });

  it('has no console errors', () => {
    cy.get('@consoleError').should('not.have.been.called');
  });

  describe('when the Entrez lookup fails', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/esummary.fcgi*', { statusCode: 500, body: {} }).as('entrezError');
      cy.visit('/browse/gene/NCBIGene:1497');
      cy.wait(['@entrezError', '@associations']);
    });

    it('keeps the associations and says the Entrez record is unavailable', () => {
      cy.get('#summary').should('contain.text', 'Could not load the Entrez record');
      cy.get('#phenotype-associations').should('contain.text', 'Seizure');
      cy.get('#summary').should('not.contain.text', 'Chromosomal Location');
    });
  });

  describe('when the annotation call fails', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/network/annotation/NCBIGene:1497', { statusCode: 500, body: {} }).as('assocError');
      cy.visit('/browse/gene/NCBIGene:1497');
      cy.wait(['@entrez', '@assocError']);
    });

    it('keeps the summary and shows an error in place of each table', () => {
      cy.get('#summary').should('contain.text', '17p13.2');
      cy.get('#phenotype-associations').should('contain.text', 'Ontology Annotation Network Error');
      cy.get('#disease-associations').should('contain.text', 'Ontology Annotation Network Error');
    });
  });
});

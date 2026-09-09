describe('Data page tabs', () => {
  it('defaults to the Ontology tab and lists the ontology files', () => {
    cy.visit('/data');
    cy.get('h1').should('contain', 'Data');
    cy.get('[role="tab"]').contains('Ontology').should('have.attr', 'aria-selected', 'true');
    cy.contains('hp.obo').should('be.visible');
    cy.contains('hp.owl').should('be.visible');
    cy.contains('hp.json').should('be.visible');
  });

  it('switches to the Annotations tab and lists the annotation files', () => {
    cy.visit('/data');
    cy.get('[role="tab"]').contains('Annotations').click();
    cy.url().should('include', 'tab=annotations');
    cy.contains('phenotype.hpoa').should('be.visible');
    cy.contains('maxo-annotations.tsv').should('be.visible');
    cy.contains('genes_to_phenotype.txt').should('be.visible');
    cy.contains('phenotype_to_genes.txt').should('be.visible');
    cy.contains('genes_to_disease.txt').should('be.visible');
  });

  it('switches to the API tab and lists the API services', () => {
    cy.visit('/data');
    cy.get('[role="tab"]').contains('API').click();
    cy.url().should('include', 'tab=api');
    cy.contains('Ontology Service').should('be.visible');
    cy.contains('Ontology Annotation Network').should('be.visible');
  });

  it('redirects old deep links to the right tab', () => {
    cy.visit('/data/ontology');
    cy.url().should('match', /\/data$/);

    cy.visit('/data/annotations');
    cy.url().should('include', '/data').and('include', 'tab=annotations');
    cy.get('[role="tab"]').contains('Annotations').should('have.attr', 'aria-selected', 'true');

    cy.visit('/data/api');
    cy.url().should('include', '/data').and('include', 'tab=api');
    cy.get('[role="tab"]').contains('API').should('have.attr', 'aria-selected', 'true');
  });

  it('no longer serves the removed layperson/translations/indigenous-languages pages', () => {
    cy.visit('/data/layperson');
    cy.contains('Layperson Synonyms').should('not.exist');

    cy.visit('/data/translations');
    cy.contains('Translations and Mapping').should('not.exist');

    cy.visit('/data/indigenous-languages');
    cy.contains('Indigenous Language Translations').should('not.exist');
  });
});

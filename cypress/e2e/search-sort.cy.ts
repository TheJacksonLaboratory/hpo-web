/// <reference types="cypress" />

// Covers only what a component test cannot: that the PrimeNG overlay opens,
// an option is clickable, and picking one actually re-orders the rendered
// cards. The ordering rules themselves are covered in
// src/app/browser/pages/search-results/search-results.component.spec.ts.
//
// The search API is stubbed so this spec is deterministic and does not depend
// on ontology.jax.org being up or returning a stable result set.
describe('Search results sorting', () => {
  const TERMS = {
    terms: [
      { id: 'HP:0000010', name: 'Bravo phenotype', definition: 'b', synonyms: [] },
      { id: 'HP:0000002', name: 'zulu phenotype', definition: 'z', synonyms: [] },
      { id: 'HP:0000100', name: 'Alpha phenotype', definition: 'a', synonyms: [] },
    ],
  };

  const RELEVANCE_ORDER = ['Bravo phenotype', 'zulu phenotype', 'Alpha phenotype'];

  // One title anchor per result card - the component tag anchors the selector,
  // so Tailwind class churn on the card doesn't break this spec.
  const resultTitles = () =>
    cy.get('app-search-result-card a').then(($els) => Cypress._.map($els, (el) => el.innerText.trim()));

  // There are two p-selects on this page - the sort menu and the paginator's
  // rows-per-page menu - so the paginator's has to be excluded explicitly.
  const sortSelect = () => cy.get('p-select').not('p-paginator p-select');

  const chooseSort = (label: string) => {
    sortSelect().click();
    cy.contains('.p-select-option', label).click();
    // The overlay closes on select; wait for it so the next assertion isn't
    // reading the list through a still-open panel.
    cy.get('.p-select-overlay').should('not.exist');
  };

  beforeEach(() => {
    cy.intercept('GET', '**/hp/search?*', { statusCode: 200, body: TERMS }).as('searchTerms');
    cy.intercept('GET', '**/network/search/gene*', {
      statusCode: 200,
      body: { results: [], totalCount: 0 },
    }).as('searchGenes');
    cy.intercept('GET', '**/network/search/disease*', {
      statusCode: 200,
      body: { results: [], totalCount: 0 },
    }).as('searchDiseases');

    cy.visit('/search?q=phenotype&navFilter=term');
    cy.wait(['@searchTerms', '@searchGenes', '@searchDiseases']);
  });

  it('defaults to Most Relevant and renders results in API order', () => {
    sortSelect().should('contain.text', 'Most Relevant');
    resultTitles().should('deep.equal', RELEVANCE_ORDER);
  });

  it('re-orders the rendered cards when a sort option is picked', () => {
    chooseSort('Name (A-Z)');

    sortSelect().should('contain.text', 'Name (A-Z)');
    resultTitles().should('deep.equal', ['Alpha phenotype', 'Bravo phenotype', 'zulu phenotype']);
  });

  it('sorts by identifier and returns to API order via Most Relevant', () => {
    chooseSort('Identifier (A-Z)');
    resultTitles().should('deep.equal', ['zulu phenotype', 'Bravo phenotype', 'Alpha phenotype']);

    chooseSort('Most Relevant');
    resultTitles().should('deep.equal', RELEVANCE_ORDER);
  });

  it('exposes every sort option in the menu', () => {
    sortSelect().click();
    cy.get('.p-select-option').should('have.length', 5);
    cy.get('.p-select-option').last().should('contain.text', 'Name (Z-A)');
  });
});

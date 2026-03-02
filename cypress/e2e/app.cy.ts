describe('HPO App', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display welcome message', () => {
    cy.get('.info-section h2').should('contain', 'The Human Phenotype Ontology');
  });

  it('should load the homepage', () => {
    cy.url().should('include', 'localhost:4200');
  });
});

package hpo.api.functional.pages

import geb.Page


class HomePage extends Page {
  static final String TITLE = 'Human Phenotype Ontology'

  static url = "/app/"

  static at = {
    title == TITLE
  }

  static content = {
    findTermInput(wait: true) { $(".home-search .searchbar") }
    termResultsPanel(wait: true, required:false) { $(".search-output .term-result  .result-title") }
    pageTitle(wait: true, required: false) { $(".home-search .title") }
    footerLink(wait: true) { $( "footer-hpo .mat-button-wrapper").text() }
  }

}


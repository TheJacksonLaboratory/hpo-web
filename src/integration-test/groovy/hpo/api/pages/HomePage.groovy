package hpo.api.pages

import geb.Page


class HomePage extends Page {
  static final String TITLE = 'HPO'
  static final String PAGE_TITLE = 'Explore the ontology!'

  static url = "/app/"

  static at = {
    title == TITLE

    waitFor {
      pageTitle.text() == PAGE_TITLE
    }
  }

  static content = {
    findTermInput(wait: true) { $(".home-search .searchbar input") }
    termResultsPanel(wait: true, required:false) { $(".search-overlay .term-result  mat-card-title") }
    pageTitle(wait: true, required: false) { $(".home-search .title") }
    footerLink(wait: true) { $( "footer-hpo .mat-button-wrapper").text() }
  }

}


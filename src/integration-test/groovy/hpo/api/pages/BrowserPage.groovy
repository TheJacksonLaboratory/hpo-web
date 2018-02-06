package hpo.api.pages

import geb.Page


class BrowserPage extends Page {
  static final String TITLE = 'HPO'
  static final String PAGE_TITLE = 'Human Phenotype Browser'

  static url = "/app/browser"

  static at = {
    title == TITLE

    waitFor {
      //pageTitle.text() == PAGE_TITLE
      pageTitle.text() == PAGE_TITLE
    }
  }

  static content = {
    findTermInput(wait: true) { $("#mat-input-0") }
    termResultsPanel(wait: true, required:false) { $(".term-result  mat-card-title") }
    pageTitle(wait: true, required: false) { $("div.page-title") }
    footerLink(wait: true) { $("footer-hpo .mat-button-wrapper").text() }
  }

}


package hpo.api.functional.pages

import geb.Page

class DownloadOntologyPage extends Page {

  static url = "/app/download/ontology"
  static content = {
    pageTitle(wait: true) { $(".pageTitle")}
    navSearchBar(wait: true) { $(".navbar-search-wrapper .searchbar") }
    navSearchResults(wait: true, required: false) { $(".navbar-search-wrapper .search-output .term-result .result-list") }
  }

}

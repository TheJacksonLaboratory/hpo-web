package hpo.api.pages

import geb.Module
import geb.Page


class DownloadAnnotationsPage extends Page {

  static url = "/app/download/annotation"
  static content = {
    pageTitle(wait: true) { $(".pageTitle")}
    navSearchBar(wait: true) { $(".navbar-search-wrapper .searchbar") }
    navSearchResults(wait: true, required: false) { $(".navbar-search-wrapper .search-output .term-result .result-list") }
  }

}

package hpo.api.pages

import geb.Module
import geb.Page


class DownloadsPage extends Page {

  static url = "app/downloads"
  static content = {
    navSearchBar(wait: true) { $(".navbar-search-wrapper .searchbar") }
    navSearchResults(wait: true, required: false) { $(".navbar-search-wrapper .search-output .term-result .result-list") }
  }

}

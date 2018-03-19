package hpo.api.pages

import geb.Module
import geb.Page


class DownloadsPage extends Page {

  static url = "app/downloads"
  static content = {
    navSearchBar(wait: true) { $(".navbar-search-container .navbar-search") }
    navSearchResults(wait: true, required:true) { $(".navbar-search-container .navbar-output .term-result .result-list .result .name") }
  }

}

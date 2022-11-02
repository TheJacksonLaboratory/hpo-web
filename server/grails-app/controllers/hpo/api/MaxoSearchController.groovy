package hpo.api

class MaxoSearchController {

  SearchService searchService

  def searchMaxo(String q){
    if(q){
      render(view: 'getMaxoSearchResults', model: [maxoSearchResultList: searchService.searchMaxo(q)])
    } else {
      render("/notFound")
    }
  }
}

package hpo.api


class HpoSearchController {
  static responseFormats = ['json']

  SearchService searchService
  HpoTermRelationsService hpoTermRelationsService

  def searchAll(String q, Integer offset, Integer max, String category){
    if (!offset) offset = 0
    if (!max)  max = 10
    render(view: '/hpoSearch/searchAll', model: [resultMap: searchService.searchAll(q, offset, max, category)])
  }

  def descendantSearch(String s, String q){
      def list = hpoTermRelationsService.findAllDescendants(s, q)
      render(view: '/hpoSearch/descendants', model: [descendantList: list])
  }
}

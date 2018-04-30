package hpo.api

class HpoSearchController {
    static responseFormats = ['json']

    HpoSearchService hpoSearchService

    def searchAll(String q, boolean fetchAll){

      if (fetchAll){
        render(view: 'searchAll', model: [resultMap: hpoSearchService.searchAll(q, 0, -1)])
      }else{
        render(view: 'searchAll', model: [resultMap: hpoSearchService.searchAll(q)])
      }
    }

}

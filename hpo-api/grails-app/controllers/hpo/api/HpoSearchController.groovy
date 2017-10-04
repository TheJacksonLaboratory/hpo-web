package hpo.api

class HpoSearchController {
    static responseFormats = ['json']

    HpoSearchService hpoSearchService

    def searchAll(String q) {
        render(view: 'searchAll', model: [resultMap: hpoSearchService.search(q)])
    }
    def searchTerm(String q){
        render(view: 'searchTerm', model: [termResult: hpoSearchService.searchTerms(q)])
    }
}

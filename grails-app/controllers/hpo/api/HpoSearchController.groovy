package hpo.api

class HpoSearchController {
    static responseFormats = ['json']

    HpoSearchService hpoSearchService

    def searchAll(String q) {
        render(view: 'searchAll', model: [resultMap: hpoSearchService.searchAll(q)])
    }

}

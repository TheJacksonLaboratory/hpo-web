package hpo.api

class HpoTermController {
    HpoTermService hpoTermService
    HpoTermRelationsService hpoTermRelationsService
	static responseFormats = ['json']

  /**
   *
   * @param hpoid(q)
   * @return
   */
    def searchTerm(){

        render(view: '/hpoTermDetails/searchTerm', model: [result: hpoTermService.searchTerm(params.id.trim())])
    }

    def searchGenesByTerm(){
        render(view: '/hpoGeneDetails/searchGenesByTerm', model: [geneList: hpoTermService.searchGenesByTerm(params.id.trim())])
    }

    def searchDiseasesByTerm(String q){
        render(view: '/hpoDiseaseDetails/searchDiseasesByTerm', model: [diseaseList: hpoTermService.searchDiseasesByTerm(params.id.trim())])
    }
    /* Shouldn't need
    def findTermRelations(String q){
      render(view: '../hpoSearch/relations', model: [resultMap: hpoTermRelationsService.findTermRelations(q)])
    }*/
}

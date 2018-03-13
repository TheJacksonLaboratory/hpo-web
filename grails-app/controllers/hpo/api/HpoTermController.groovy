package hpo.api

class HpoTermController {
    HpoTermService hpoTermService
    HpoTermRelationsService hpoTermRelationsService
	static responseFormats = ['json']

  /**
   *
   * @param Trimmed Rest id From Url
   * @return
   */
    def searchTerm(){
        render(view: '/hpoTermDetails/searchTerm', model: [result: hpoTermService.searchTerm(params.id.trim())])
    }

    def searchGenesByTerm(Integer offset, Integer max){
        if (!offset) offset = 0
        if (!max)  max = 20
        render(view: '/hpoGeneDetails/searchGenesByTerm', model: [geneList: hpoTermService.searchGenesByTerm(params.id.trim(), offset, max), offset: offset, max: max])
    }

    def searchDiseasesByTerm(Integer offset, Integer max){
        if (!offset) offset = 0
        if (!max)  max = 20
        render(view: '/hpoDiseaseDetails/searchDiseasesByTerm', model: [diseaseList: hpoTermService.searchDiseasesByTerm(params.id.trim(), offset, max), offset: offset, max: max])
    }
}

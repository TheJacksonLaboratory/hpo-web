package hpo.api

class HpoTermController {
    HpoTermService hpoTermService
    HpoTermRelationsService hpoTermRelationsService
	static responseFormats = ['json']

  /**
   * @param Trimmed Rest id From Url
   * @return
   *
   */
    def searchTerm(){
        render(view: '/hpoTermDetails/searchTerm', model: [result: hpoTermService.searchTerm(params.id.trim())])
    }

    def searchGenesByTerm(Integer offset, Integer max){
        if (!offset) offset = 0
        if (!max)  max = 20
        render(view: '/hpoGeneDetails/searchGenesByTerm', model: [resultMap: hpoTermService.searchGenesByTerm(params.id.trim(), offset, max)])
    }

    def searchDiseasesByTerm(Integer offset, Integer max){
        if (!offset) offset = 0
        if (!max)  max = 20
        render(view: '/hpoDiseaseDetails/searchDiseasesByTerm', model: [resultMap: hpoTermService.searchDiseasesByTerm(params.id.trim(), offset, max)])
    }
}

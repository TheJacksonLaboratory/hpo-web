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
      def res = hpoTermService.searchTerm(params.id.trim())
      if(res){
        render(view: '/hpoTermDetails/searchTerm', model: [result: res])
      } else {
        render(view: '/notFound')
      }
    }

    def searchGenesByTerm(Integer offset, Integer max){
      if (!offset) offset = 0
      if (!max)  max = 20
      def res = hpoTermService.searchGenesByTerm(params.id.trim(), offset, max)
      if(res){
        render(view: '/hpoGeneDetails/searchGenesByTerm', model: [resultMap: res ])
      } else {
        render(view: '/notFound')

      }
    }

    def searchDiseasesByTerm(Integer offset, Integer max){
      if (!offset) offset = 0
      if (!max)  max = 20
      def res = hpoTermService.searchDiseasesByTerm(params.id.trim(), offset, max)
      if(res){
        render(view: '/hpoDiseaseDetails/searchDiseasesByTerm', model: [resultMap: hpoTermService.searchDiseasesByTerm(params.id.trim(), offset, max)])
      } else {
        render(view: '/notFound')
      }
    }
}

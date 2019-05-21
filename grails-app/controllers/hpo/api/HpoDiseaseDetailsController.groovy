package hpo.api

class HpoDiseaseDetailsController {
	static responseFormats = ['json']
    HpoDiseaseDetailsService hpoDiseaseDetailsService

    def searchDisease(String q){
      def res = hpoDiseaseDetailsService.searchDisease(q)
      if(res.disease != ''){
        render(view: 'searchDisease', model: [resultMap: hpoDiseaseDetailsService.searchDisease(q)])
      } else {
        render(view:'/notFound')
      }
    }
}

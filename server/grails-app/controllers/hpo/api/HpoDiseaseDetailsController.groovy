package hpo.api

class HpoDiseaseDetailsController {
	static responseFormats = ['json']
    HpoDiseaseDetailsService hpoDiseaseDetailsService

    def searchDisease(String id){
      def res = hpoDiseaseDetailsService.searchDisease(id)
      if(res.disease != ''){
        render(view: 'searchDisease', model: [resultMap: res])
      } else {
        render(view:'/notFound')
      }
    }
  }

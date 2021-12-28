package hpo.api

class HpoGeneDetailsController {
  HpoGeneDetailsService hpoGeneDetailsService
	static responseFormats = ['json', 'xml']

  def searchGene(Integer id){
    def res = hpoGeneDetailsService.searchGene(id)
    if(res.gene != ''){
      render(view: 'searchGene', model: [resultMap: res])
    }else {
      render(view: '/notFound')
    }
  }
}

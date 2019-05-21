package hpo.api

class HpoGeneDetailsController {
  HpoGeneDetailsService hpoGeneDetailsService
	static responseFormats = ['json', 'xml']

  def searchGene(Integer q){
    def res = hpoGeneDetailsService.searchGene(q)
    if(res.gene != ''){
      render(view: 'searchGene', model: [resultMap: res])
    }else {
      render(view: '/notFound')
    }
  }
}

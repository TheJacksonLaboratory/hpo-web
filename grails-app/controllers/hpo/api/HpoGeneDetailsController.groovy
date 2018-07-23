package hpo.api

class HpoGeneDetailsController {
  HpoGeneDetailsService hpoGeneDetailsService
	static responseFormats = ['json', 'xml']

  def searchGene(Integer q){
    render(view: 'searchGene', model: [resultMap: hpoGeneDetailsService.searchGene(q)])
  }
}

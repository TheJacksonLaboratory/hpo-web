package hpo.api
import grails.rest.*
import grails.converters.*

class HpoGeneDetailsController {
  HpoGeneDetailsService hpoGeneDetailsService
	static responseFormats = ['json', 'xml']

  def searchGene(Integer q){
    render(view: 'searchGene', model: [resultMap: hpoGeneDetailsService.searchGene(q)])
  }
}

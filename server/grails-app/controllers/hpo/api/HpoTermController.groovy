package hpo.api

import org.monarchinitiative.phenol.ontology.data.TermId

class HpoTermController {
  HpoTermService hpoTermService
  HpoTermRelationsService hpoTermRelationsService
  HpoLoincService hpoLoincService
	static responseFormats = ['json']

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

  def searchLoincByTerm(String id){
    render(view: '/hpoLoinc/loinc', model: [entryList: hpoLoincService.searchByHpo(TermId.of(id)).toList()])
  }

  def searchIntersectingAssociations(String q){
    def terms = q.split(",").collect()
    terms.each {
      // Confirm that these are actually all hpo terms?
      it ->
      def term = it.split(":")
      if(!term[0].equals("HP") && !Integer.parseInt(term[1])){
        // Good enough
        render(400)
      }
        render(view:'/hpoDiseaseDetails/intersect', model: [associations: hpoTermService.findIntersectingTermDiseaseAssociations(terms)])
    }
  }
}
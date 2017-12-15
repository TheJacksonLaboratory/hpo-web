package hpo.api

class HpoTermDetailsController {
    HpoTermDetailsService hpoTermDetailsService
    HpoTermRelationsService hpoTermRelationsService
	static responseFormats = ['json']

    def searchTerm(String q){
        render(view: 'searchTerm', model: [resultMap: hpoTermDetailsService.searchTerm(q)])
    }

  /**
   * Given an ontology id for a term, find related parents and children terms
   * @param hpoId
   * @return
   */
    def findTermRelations(String hpoId){
      render(view: '../hpoSearch/relations', model: [resultMap: hpoTermRelationsService.findTermRelations(hpoId)])
    }
}

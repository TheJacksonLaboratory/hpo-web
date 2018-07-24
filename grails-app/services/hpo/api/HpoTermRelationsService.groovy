package hpo.api

import grails.gorm.transactions.Transactional
import hpo.api.term.DbTerm
import org.apache.commons.lang.StringUtils

@Transactional
class HpoTermRelationsService {

  /**
   * Given an hpo ontology id, find the term object and its associated parents and children
   * @param ontologyId
   * @return Map [term, children list, parent list]. Term will be null if not found
   */
  Map<String, Map> findTermRelations(String ontologyId) {

    final Map<String, Map> resultMap = ['term': null, 'children': [data:[]] as Map, 'parents': [data:[]] as Map]
    final String hpoId = StringUtils.trimToNull(ontologyId)

    if (hpoId) {
      DbTerm term = DbTerm.findByOntologyId(hpoId)

      if(term){
        resultMap.term = term
        resultMap.parents.data = term.getParents().asList()
        resultMap.children.data = term.getChildren().asList()
      }
    }
    return resultMap
  }
}

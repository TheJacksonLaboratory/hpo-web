package hpo.api

import grails.gorm.transactions.Transactional
import hpo.api.term.DbTerm
import org.apache.commons.lang.StringUtils
import org.monarchinitiative.phenol.ontology.algo.OntologyTerms
import org.monarchinitiative.phenol.ontology.data.Ontology
import org.monarchinitiative.phenol.ontology.data.TermId


@Transactional
class HpoTermRelationsService {

  Ontology hpoOntology

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

  /**
   * Given an hpo ontology id, get all descendants with given term
   * @param ontologyId
   * @return list of term suggestions
   */
  List<DbTerm> findAllDescendants(String ontologyId, String query){
    ontologyId = StringUtils.trimToNull(ontologyId);
    TermId hpoId = TermId.of(ontologyId);
    if(hpoId){
      Set<TermId> children = OntologyTerms.childrenOf(hpoId, hpoOntology)
      return children.collect {
        DbTerm.findByOntologyId(it)
      }.collect().sort { x,y ->
        x.getName() <=> y.getName()
      }.findAll { term ->
        if(query.isEmpty()){
          return term
        } else {
          return term.getName().toLowerCase().contains(query.toLowerCase())
        }
      } as List<DbTerm>
    }
    return []
  }
}

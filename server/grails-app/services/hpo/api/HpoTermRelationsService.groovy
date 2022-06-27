package hpo.api

import grails.gorm.transactions.Transactional
import hpo.api.term.DbTerm
import org.apache.commons.lang3.StringUtils
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
   * Given an hpo ontology id, get all descendants starting with that term
   * then filter the resulting set by the query passed. If none, return all.
   * @param ontologyId
   * @return list of term suggestions
   */
  List<DbTerm> findAllDescendants(String ontologyId, String query) {
    ontologyId = StringUtils.trimToNull(ontologyId);
    if (ontologyId) {
      TermId hpoId = TermId.of(ontologyId);
      if (hpoId) {
        Set<TermId> children = OntologyTerms.childrenOf(hpoId, hpoOntology)
        final List<DbTerm> descendants = children.collect { DbTerm.findByOntologyId(it.toString()) }
        final List<DbTerm> sortedDescendants = descendants.sort { x, y -> x.getName().toLowerCase() <=> y.getName().toLowerCase() }
        return sortedDescendants.findAll { term ->
          if (query == null) {
            return term
          } else {
            return term.getName().toLowerCase().contains(query.toLowerCase()) && term.getOntologyId() != ontologyId
          }
        } as List<DbTerm>
      }
    }
    return [];
  }
}

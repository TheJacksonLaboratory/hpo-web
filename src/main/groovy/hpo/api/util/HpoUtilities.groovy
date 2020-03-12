package hpo.api.util

import org.monarchinitiative.phenol.ontology.data.Ontology
import org.monarchinitiative.phenol.ontology.data.TermId

class HpoUtilities {

  Ontology hpoOntology

  /***
   * Method to check if a given hpo id string is a primary id,
   * if not it returns the primary id for that hpo id.
   * @return primaryId: string
   */

   HpoUtilities(Ontology hpoOntology){
     this.hpoOntology = hpoOntology
   }
   String checkReturnPrimaryId(String hpoTermQuery){
    if(hpoTermQuery.size() == 10){
      // A search with the complete HPO id. Must see if it is
      // a primary id or an obsolete one.
      TermId compareTerm = TermId.of(hpoTermQuery)
      TermId term = hpoOntology.getPrimaryTermId(compareTerm)
      // ontology function always returns the primary, will return self if primary
      // null if not an id in the ontology
      if(term != null){
        return term.toString()
      }
    }
    return hpoTermQuery
  }
}

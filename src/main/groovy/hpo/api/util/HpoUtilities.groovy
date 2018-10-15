package hpo.api.util

import org.monarchinitiative.phenol.formats.hpo.HpoOntology
import org.monarchinitiative.phenol.ontology.data.TermId

class HpoUtilities {

  HpoOntology hpoOntology

  /***
   * Method to check if a given hpo id string is a primary id,
   * if not it returns the primary id for that hpo id.
   * @return primaryId: string
   */

   HpoUtilities(HpoOntology hpoOntology){
     this.hpoOntology = hpoOntology
   }
   String checkReturnPrimaryId(String hpoTermQuery){
    if(hpoTermQuery.size() == 10){
      // A search with the complete HPO id. Must see if it is
      // a primary id or an obsolete one.
      TermId compareTerm = TermId.constructWithPrefix(hpoTermQuery)
      TermId term = hpoOntology.getPrimaryTermId(compareTerm)
      // ontology function always returns the primary, will return self if primary
      // null if not an id in the ontology
      if(term != null){
        return term.getIdWithPrefix()
      }
    }
    return hpoTermQuery
  }
}

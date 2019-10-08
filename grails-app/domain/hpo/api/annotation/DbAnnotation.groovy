package hpo.api.annotation

import hpo.api.disease.DbDisease
import hpo.api.term.DbTerm

class DbAnnotation {

    DbTerm dbTerm
    DbDisease dbDisease
    String frequency
    String onset

    static constraints = {
      dbTerm()
      dbDisease()
      onset(nullable: true)
      frequency(nullable: true)
    }

    static mapping = {
      version false
    }

    DbAnnotation(term, disease, freq, onst){
      dbTerm = term
      dbDisease = disease
      frequency = freq
      onset = onst
    }
}

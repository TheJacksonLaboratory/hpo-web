package hpo.api.annotation

import hpo.api.disease.DbDisease
import hpo.api.term.DbTerm

class DbAnnotation {

    DbTerm dbTerm
    DbDisease dbDisease
    String frequency
    String onset
    String citations

    static constraints = {
      dbTerm()
      dbDisease()
      onset()
      frequency()
      citations()
    }

    static mapping = {
      version false
    }

    DbAnnotation(term, disease, frequency, onset, citations){
      this.dbTerm = term
      this.dbDisease = disease
      this.frequency = frequency
      this.onset = onset
      this.citations = citations
    }
}

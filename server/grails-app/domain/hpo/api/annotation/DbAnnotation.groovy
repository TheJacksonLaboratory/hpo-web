package hpo.api.annotation

import hpo.api.disease.DbDisease
import hpo.api.term.DbTerm

class DbAnnotation {

    DbTerm dbTerm
    DbDisease dbDisease
    String frequency
    String onset
    String sources

    static constraints = {
      dbTerm()
      dbDisease()
      onset(nullable:true)
      frequency()
      sources()
    }

    static mapping = {
      version false
    }

    static hasMany = [dbTerm: DbTerm, dbDisease: DbDisease]

    DbAnnotation(term, disease, frequency, onset, sources){
      this.dbTerm = term
      this.dbDisease = disease
      this.frequency = frequency
      this.onset = onset
      this.sources = sources
    }
}

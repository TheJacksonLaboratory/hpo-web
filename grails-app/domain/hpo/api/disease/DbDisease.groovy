package hpo.api.disease

import com.github.phenomics.ontolib.formats.hpo.HpoDiseaseAnnotation
import hpo.api.term.DbTerm

class DbDisease {

  String db
  String dbId
  String dbName
  String diseaseId

  static constraints = {
    db()
    dbId(nullable:true)
    dbName()
    diseaseId()
  }
  static mapping = {

  }
  static hasMany = [dbTerm: DbTerm]
  static belongsTo = DbTerm
  DbDisease() {}

  DbDisease(HpoDiseaseAnnotation hpoDiseaseAnnotation){
    db = hpoDiseaseAnnotation.db
    dbId = hpoDiseaseAnnotation.dbObjectId
    dbName = hpoDiseaseAnnotation.dbName
    diseaseId = hpoDiseaseAnnotation.dbReference
  }
}


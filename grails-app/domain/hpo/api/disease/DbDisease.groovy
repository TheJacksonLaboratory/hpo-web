package hpo.api.disease

import com.github.phenomics.ontolib.formats.hpo.HpoDiseaseAnnotation
import hpo.api.term.DbTerm

class DbDisease {

  String db
  String dbId
  String diseaseName
  String diseaseId

  static constraints = {
    db()
    dbId(nullable: true)
    diseaseName()
    diseaseId(unique:true)
  }
  static mapping = {
    diseaseName(type:'text')
  }
  static hasMany = [dbTerm: DbTerm]
  static belongsTo = DbTerm

  DbDisease() {}

  DbDisease(HpoDiseaseAnnotation hpoDiseaseAnnotation) {
    db = hpoDiseaseAnnotation.db
    dbId = hpoDiseaseAnnotation.dbObjectId
    diseaseName = hpoDiseaseAnnotation.dbName
    diseaseId = hpoDiseaseAnnotation.dbReference
  }
}


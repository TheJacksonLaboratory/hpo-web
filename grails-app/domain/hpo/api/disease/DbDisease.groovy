package hpo.api.disease

import com.github.phenomics.ontolib.formats.hpo.HpoDiseaseAnnotation
import hpo.api.term.DbTerm

class DbDisease {

  String db
  String dbId
  String dbName
  String qualifier
  String diseaseId
  String evidenceDescription
  String onsetModifier
  String frequencyModifier
  String withA
  String aspect
  String synonym
  Date date;
  String assignedBy

  static constraints = {
    db()
    dbId(nullable:true)
    dbName()
    qualifier(nullable: true)
    diseaseId()
    evidenceDescription()
    onsetModifier(nullable: true)
    frequencyModifier(nullable: true)
    withA(nullable: true)
    aspect()
    synonym(nullable: true)
    date()
    assignedBy()
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
    qualifier = hpoDiseaseAnnotation.qualifier
    diseaseId = hpoDiseaseAnnotation.dbReference
    evidenceDescription = hpoDiseaseAnnotation.evidenceDescription
    onsetModifier = hpoDiseaseAnnotation.onsetModifier
    frequencyModifier = hpoDiseaseAnnotation.frequencyModifier
    withA = hpoDiseaseAnnotation.with
    aspect = hpoDiseaseAnnotation.aspect
    synonym = hpoDiseaseAnnotation.synonym
    date = hpoDiseaseAnnotation.date
    assignedBy = hpoDiseaseAnnotation.assignedBy
  }
}


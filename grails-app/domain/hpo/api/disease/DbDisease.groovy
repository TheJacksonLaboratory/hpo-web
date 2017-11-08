package hpo.api.disease

import com.github.phenomics.ontolib.formats.hpo.HpoDiseaseAnnotation

class DbDisease {

  String db
  String dbId
  String dbName
  String qualifier
  String hpoId
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
    hpoId()
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
    db()
    dbId()
    dbName()
    qualifier()
    hpoId()
    diseaseId()
    evidenceDescription()
    onsetModifier()
    frequencyModifier()
    withA()
    aspect()
    synonym(type: 'text')
    date()
    assignedBy()

  }
  DbDisease() {}

    DbDisease(HpoDiseaseAnnotation hpoDiseaseAnnotation){
    db = hpoDiseaseAnnotation.db
    dbId = hpoDiseaseAnnotation.dbObjectId
    dbName = hpoDiseaseAnnotation.dbName
    qualifier = hpoDiseaseAnnotation.qualifier
    hpoId = hpoDiseaseAnnotation.hpoId.idWithPrefix
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


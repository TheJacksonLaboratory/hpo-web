package hpo.api.disease

import com.github.phenomics.ontolib.formats.hpo.HpoDiseaseAnnotation
import hpo.api.gene.DbGene
import hpo.api.term.DbTerm

class DbDisease {

  String db
  String dbId
  String diseaseName
  String diseaseId

  static constraints = {
    db()
    dbId()
    diseaseName()
    diseaseId(unique: true)
  }
  static mapping = {
    diseaseName(type: 'text')
  }
  Set<DbTerm> dbTerms = [] as Set<DbTerm>
  Set<DbGene> dbGenes = [] as Set<DbGene>
  static hasMany = [dbTerms: DbTerm, dbGenes: DbGene]
  static belongsTo = [DbTerm, DbGene]

  DbDisease() {}

  DbDisease(HpoDiseaseAnnotation hpoDiseaseAnnotation) {
    db = hpoDiseaseAnnotation.db
    dbId = hpoDiseaseAnnotation.dbObjectId
    diseaseName = hpoDiseaseAnnotation.dbName
    diseaseId = hpoDiseaseAnnotation.dbReference
  }
}


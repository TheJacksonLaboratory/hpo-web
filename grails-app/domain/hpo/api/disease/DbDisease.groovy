package hpo.api.disease

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

  DbDisease(Map disease) {
    db = disease.db
    dbId = disease.dbObjectId
    diseaseName = disease.dbName
    diseaseId = disease.dbReference
  }
}


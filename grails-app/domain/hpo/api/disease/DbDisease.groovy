package hpo.api.disease

import hpo.api.gene.DbGene
import hpo.api.term.DbTerm
import org.monarchinitiative.phenol.formats.hpo.HpoDisease

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

  DbDisease(HpoDisease disease) {
    db = disease.getDiseaseDatabaseId().getPrefix().toString()
    dbId = disease.getDiseaseDatabaseId().getId()
    diseaseName = disease.getName()
    diseaseId = disease.getDiseaseDatabaseId().toString()
  }
}


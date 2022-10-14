package hpo.api.disease

import groovy.transform.CompileDynamic
import hpo.api.gene.DbGene

@CompileDynamic
class DbDisease {

  String db
  String dbId
  String diseaseId
  String diseaseName


  static constraints = {
    diseaseId unique: true
  }
  static mapping = {
    diseaseName type: 'text'
    version false
  }

  static hasMany = [dbGenes: DbGene]
  static belongsTo = [DbGene]

  DbDisease() {}

  DbDisease(db, dbId, String diseaseName, String diseaseId) {
    this.db = db
    this.dbId = dbId
    this.diseaseName = diseaseName
    this.diseaseId = diseaseId
  }

}


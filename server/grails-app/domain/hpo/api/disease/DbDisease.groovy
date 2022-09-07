package hpo.api.disease

import grails.compiler.GrailsCompileStatic
import groovy.transform.TypeCheckingMode
import hpo.api.gene.DbGene
import org.monarchinitiative.phenol.annotations.formats.hpo.HpoDisease
import org.monarchinitiative.phenol.ontology.data.TermId

@GrailsCompileStatic(TypeCheckingMode.SKIP)
class DbDisease {

  String db
  String dbId
  String diseaseId
  String diseaseName


  static constraints = {
    db()
    dbId()
    diseaseName()
    diseaseId(unique: true)
  }
  static mapping = {
    diseaseName(type: 'text')
    version false
  }

  Set<DbGene> dbGenes = [] as Set<DbGene>
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


package hpo.api.disease

import grails.compiler.GrailsCompileStatic
import groovy.transform.TypeCheckingMode
import hpo.api.gene.DbGene
import org.monarchinitiative.phenol.annotations.formats.hpo.HpoDisease

@GrailsCompileStatic(TypeCheckingMode.SKIP)
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
    version false
  }

  Set<DbGene> dbGenes = [] as Set<DbGene>
  static hasMany = [dbGenes: DbGene]
  static belongsTo = [DbGene]

  DbDisease() {}

  DbDisease(HpoDisease disease) {
    db = disease.id().getPrefix()
    dbId = disease.id().getId()
    diseaseName = disease.diseaseName()
    diseaseId = disease.id().toString()
  }

}


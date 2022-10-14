package hpo.api.gene

import groovy.transform.CompileDynamic
import hpo.api.disease.DbDisease
import hpo.api.term.DbTerm
import org.monarchinitiative.phenol.annotations.formats.hpo.HpoGeneAnnotation

@CompileDynamic
class DbGene {

  Integer geneId
  String geneSymbol

  static constraints = {
    geneId unique: true
    geneSymbol unique:true
  }

  static mapping = {
    version false
  }

  static hasMany = [dbTerms: DbTerm, dbDiseases: DbDisease]
  static belongsTo = [dbTerms: DbTerm]


  DbGene() {}

  DbGene(HpoGeneAnnotation hpoGeneAnnotation) {
    geneId = hpoGeneAnnotation.entrezGeneId
    geneSymbol = hpoGeneAnnotation.entrezGeneSymbol
  }
}

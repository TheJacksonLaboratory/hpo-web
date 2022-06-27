package hpo.api.gene

import grails.compiler.GrailsCompileStatic
import groovy.transform.TypeCheckingMode
import hpo.api.disease.DbDisease
import hpo.api.term.DbTerm
import org.monarchinitiative.phenol.annotations.formats.hpo.HpoGeneAnnotation

@GrailsCompileStatic(TypeCheckingMode.SKIP)
class DbGene {

  Integer geneId
  String geneSymbol

  static constraints = {
    geneId(unique: true)
    geneSymbol(unique:true)
  }

  static mapping = {
    geneId()
    geneSymbol()
    version false
  }

  Set<DbTerm> dbTerms = [] as Set<DbTerm>
  Set<DbDisease> dbDiseases = [] as Set<DbDisease>

  static belongsTo = [dbTerms: DbTerm]
  static  hasMany = [dbTerms: DbTerm, dbDiseases: DbDisease]

  DbGene() {}

  DbGene(HpoGeneAnnotation hpoGeneAnnotation) {
    geneId = hpoGeneAnnotation.entrezGeneId
    geneSymbol = hpoGeneAnnotation.entrezGeneSymbol
  }
}

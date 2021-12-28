package hpo.api.gene

import grails.compiler.GrailsCompileStatic
import groovy.transform.TypeCheckingMode
import hpo.api.disease.DbDisease
import hpo.api.term.DbTerm
import org.monarchinitiative.phenol.annotations.formats.hpo.HpoGeneAnnotation

@GrailsCompileStatic(TypeCheckingMode.SKIP)
class DbGene {

  Integer entrezGeneId
  String  entrezGeneSymbol

  static constraints = {
    entrezGeneId(unique: true)
    entrezGeneSymbol(unique:true)
  }

  static mapping = {
    entrezGeneId()
    entrezGeneSymbol()
    version false
  }

  Set<DbTerm> dbTerms = [] as Set<DbTerm>
  Set<DbDisease> dbDiseases = [] as Set<DbDisease>

  static belongsTo = [dbTerms: DbTerm]
  static  hasMany = [dbTerms: DbTerm, dbDiseases: DbDisease]

  DbGene() {}

  DbGene(HpoGeneAnnotation hpoGeneAnnotation) {
    entrezGeneId = hpoGeneAnnotation.entrezGeneId
    entrezGeneSymbol = hpoGeneAnnotation.entrezGeneSymbol
  }
}

package hpo.api.gene

import com.github.phenomics.ontolib.formats.hpo.HpoGeneAnnotation
import hpo.api.term.DbTerm

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
    }

  Set<DbTerm> dbTerms = [] as Set<DbTerm>

  static belongsTo = [dbTerms:  DbTerm]
  static  hasMany = [dbTerms: DbTerm]

  DbGene() {}

  DbGene(HpoGeneAnnotation hpoGeneAnnotation) {
    entrezGeneId = hpoGeneAnnotation.entrezGeneId
    entrezGeneSymbol = hpoGeneAnnotation.entrezGeneSymbol
  }
}

package hpo.api.gene

import com.github.phenomics.ontolib.formats.hpo.HpoGeneAnnotation
import hpo.api.disease.DbDisease
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
  Set<DbDisease> dbDiseases = [] as Set<DbDisease>

  static belongsTo = [dbTerms: DbTerm]
  static  hasMany = [dbTerms: DbTerm, dbDiseases: DbDisease]

  DbGene() {}

  DbGene(HpoGeneAnnotation hpoGeneAnnotation) {
    entrezGeneId = hpoGeneAnnotation.entrezGeneId
    entrezGeneSymbol = hpoGeneAnnotation.entrezGeneSymbol
  }
}

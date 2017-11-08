package hpo.api.gene

import com.github.phenomics.ontolib.formats.hpo.HpoGeneAnnotation
import hpo.api.term.DbTerm

class DbGene {


  Integer entrezId
  String  geneSymbol

    static constraints = {

      entrezId(unique: true)
      geneSymbol(unique:true)
    }

    static mapping = {
      entrezId()
      geneSymbol()
    }




  Collection<DbTerm> dbTerms = [] as Set<DbTerm>

  static belongsTo = [dbTerms:  DbTerm]
  static  hasMany = [dbTerms: DbTerm]

  DbGene() {}

  DbGene(HpoGeneAnnotation hpoGeneAnnotation) {

    entrezId = hpoGeneAnnotation.entrezGeneId
    geneSymbol = hpoGeneAnnotation.entrezGeneSymbol
  }
}

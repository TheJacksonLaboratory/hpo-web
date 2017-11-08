package hpo.api.gene
import hpo.api.term.DbTerm

class DbGene {


  Integer entrezGeneId
  String  entrezGeneSymbol

  static constraints = {
    entrezGeneId(unique: true)
    entrezGeneSymbol(unique: true)
  }

  static mapping = {
    entrezGeneId()
    entrezGeneSymbol()
  }

  static belongsTo = DbTerm
  static hasMany = [dbTerm: DbTerm]
  DbGene() {}
  DbGene(Integer entrezGeneId, String entrezGeneSymbol) {
    this.entrezGeneId = entrezGeneId
    this.entrezGeneSymbol = entrezGeneSymbol
  }
}

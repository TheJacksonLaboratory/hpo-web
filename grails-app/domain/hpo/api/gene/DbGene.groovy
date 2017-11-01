package hpo.api.gene

import com.github.phenomics.ontolib.formats.hpo.HpoGeneAnnotation

class DbGene {

  String ontologyId
  String name
  Integer geneId
  String  geneSymbol

    static constraints = {
      ontologyId()
      name()
      geneId()
      geneSymbol()
    }

    static mapping = {
      ontologyId()
      name()
      geneId()
      geneSymbol()
    }


  DbGene() {}

  DbGene(HpoGeneAnnotation hpoGeneAnnotation) {
    ontologyId = hpoGeneAnnotation.termId.idWithPrefix
    name = hpoGeneAnnotation.termName
    geneId = hpoGeneAnnotation.entrezGeneId
    geneSymbol = hpoGeneAnnotation.entrezGeneSymbol
  }
}

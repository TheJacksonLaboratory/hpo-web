package hpo.api

import hpo.api.gene.DbGene
import grails.compiler.GrailsCompileStatic


@GrailsCompileStatic
class HpoGeneDetailsService {

  Map searchGene(Integer query) {
    Map resultMap = ["gene": '', "termAssoc": [], "diseaseAssoc": []]
    if (query) {
      DbGene gene = getGene(query)
      resultMap.put("gene", gene)
      resultMap.put("termAssoc", gene.dbTerms)
      resultMap.put("diseaseAssoc", gene.dbDiseases)
    }
    return resultMap
  }
  DbGene getGene(Integer query) {
    DbGene.findByEntrezGeneId(query)
  }
}

package hpo.api

import grails.gorm.transactions.Transactional
import hpo.api.disease.DbDisease
import hpo.api.gene.DbGene
import grails.compiler.GrailsCompileStatic
import groovy.transform.TypeCheckingMode
import hpo.api.term.DbTerm

@Transactional(readOnly = true)
@GrailsCompileStatic
class HpoGeneDetailsService {

  Map searchGene(Integer query){
     Map resultMap = ["gene":'', "termAssoc":[], "diseaseAssoc":[]]
    if (query) {
      DbGene gene = getGene(query)
      resultMap.put("gene",gene)
      resultMap.put("termAssoc", gene.dbTerms)
      resultMap.put("diseaseAssoc", gene.dbDiseases)
    }
    return resultMap
  }



  @GrailsCompileStatic(TypeCheckingMode.SKIP)
  DbGene getGene(Integer query) {
    def c = DbGene.createCriteria()
    List<DbGene> gene = c.list() {
      like('entrezGeneId', query)
    }
    return gene[0]
  }
}

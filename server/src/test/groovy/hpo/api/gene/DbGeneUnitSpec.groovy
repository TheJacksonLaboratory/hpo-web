package hpo.api.gene

import grails.testing.gorm.DomainUnitTest
import org.monarchinitiative.phenol.annotations.formats.hpo.HpoGeneAnnotation
import spock.lang.Specification
import spock.lang.Unroll

@Unroll
class DbGeneUnitSpec extends Specification implements DomainUnitTest<DbGene> {

  void "test using criteria query for gene #desc"(){
    given: 'we save gene data'
    dbGeneIds.each { key, value ->
      buildDbGene(key,value)
    }

    when: 'we search for a gene'
    def c = DbGene.createCriteria()
    List<DbGene> geneList = c.list(){
      like('geneId', query)
    }
    then: "we find the term"
    geneList*.geneSymbol == expected

    where:
    dbGeneIds       | query | expected  | desc
    [:]             | 7157  | []        | 'no terms in db ok'
    ["TP53": 7157]  | 7157  | ["TP53"]  | 'find a gene by id'

  }

  void "test gene constructor"() {
    given:
    HpoGeneAnnotation geneAnnotation = new HpoGeneAnnotation(7175,"TP53",null,null)

    when:
    DbGene dbGene = new DbGene(geneAnnotation)

    then:
    verifyAll {
      dbGene.geneId  == geneAnnotation.entrezGeneId
      dbGene.geneSymbol == geneAnnotation.entrezGeneSymbol
    }
  }
  private static DbGene buildDbGene(String entrezGeneSymbol, Integer entrezGeneId) {
    new DbGene(geneSymbol: entrezGeneSymbol, geneId: entrezGeneId).save(failOnError: true)
  }
}

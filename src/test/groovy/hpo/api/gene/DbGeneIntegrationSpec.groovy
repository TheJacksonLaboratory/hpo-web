package hpo.api.gene

import grails.testing.mixin.integration.Integration
import spock.lang.*
@Integration
class DbGeneIntegrationSpec extends Specification {

  void setup(){

  }
  void "test find genes given id"(){
    def c = DbGene.createCriteria()
    List<DbGene> gene = c.list(){
      like('entrezGeneId', query)
    }
    expect: "fix me"
    gene*.entrezGeneSymbol == expected

    where:
    query         | expected
    7157          | ["TP53"]
    2879          | ["GPX4"]
  }
  void "test find genes given symbol"(){
    def c = DbGene.createCriteria()
    List<DbGene> geneList = c.list(){
      like('entrezGeneSymbol', "%$query%")
    }
    expect: "fix me"
    geneList*.entrezGeneId == expected

    where:
    query         | expected
    "LBR"         | [3930]
    "RPS19"       | [6223]
  }
}

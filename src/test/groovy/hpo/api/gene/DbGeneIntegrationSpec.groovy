package hpo.api.gene

import grails.testing.mixin.integration.Integration
import spock.lang.*
@Integration
class DbGeneIntegrationSpec extends Specification {

  void setup(){

  }
  void "test find transitive genes by hpo id"(){
    def c = DbGene.createCriteria()
    List<DbGene> geneList = c.list(){
      like('ontologyId', "%$query%")
    }
    expect: "fix me"
    geneList*.geneId == expected

    where:
    query         | expected
    'HP:0025201'  | [529, 23545, 523]
    'HP:0100027'  | [11330,6690, 64788, 1080, 5644, 1357, 338328, 5645, 846]
  }
}

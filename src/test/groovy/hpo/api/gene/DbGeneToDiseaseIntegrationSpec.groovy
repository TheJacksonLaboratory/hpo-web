package hpo.api.gene

import grails.testing.mixin.integration.Integration
import spock.lang.*
@Integration
class DbGeneToDiseaseIntegrationSpec extends Specification {
  void "test find associated diseases by hpo id"(){
    def c = DbGeneToDisease.createCriteria()
    List<DbGeneToDisease> geneToDiseaseList = c.list(){
      like('geneSymbol', "%$query%")
    }
    expect: "fix me"
    geneToDiseaseList*.diseaseId == expected

    where:
    query         | expected
    'AAGAB'       | ['OMIM:148600', 'ORPHA:79501']
  }
}

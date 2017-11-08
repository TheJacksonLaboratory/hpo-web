package hpo.api.disease

import grails.testing.mixin.integration.Integration
import spock.lang.*
@Integration
class DbDiseaseIntegrationSpec extends Specification {

  void "test find associated diseases by hpo id"(){
    def c = DbDisease.createCriteria()
    List<DbDisease> diseaseList = c.list(){
      like('diseaseId', "%$query%")
    }
    expect: "fix me"
    diseaseList*.dbName == expected

    where:
    query         | expected
    'OMIM:105650' | ["DIAMOND-BLACKFAN ANEMIA"]
  }
}

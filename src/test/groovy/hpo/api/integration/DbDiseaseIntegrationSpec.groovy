package hpo.api.integration
/*package hpo.api.unit.disease

import grails.testing.mixin.integration.Integration
import spock.lang.*
@Integration
class hpo.api.integration.DbDiseaseIntegrationSpec extends Specification {

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
}*/

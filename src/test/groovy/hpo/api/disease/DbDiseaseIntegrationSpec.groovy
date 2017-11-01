package hpo.api.disease

import grails.testing.mixin.integration.Integration
import spock.lang.*
@Integration
class DbDiseaseIntegrationSpec extends Specification {

  void "test find associated diseases by hpo id"(){
    def c = DbDisease.createCriteria()
    List<DbDisease> diseaseList = c.list(){
      like('hpoId', "%$query%")
    }
    expect: "fix me"
    diseaseList*.diseaseId == expected

    where:
    query         | expected
    'HP:0100027'  | ['OMIM:118830', 'OMIM:145001', 'ORPHA:444490', 'ORPHA:676']
  }
}

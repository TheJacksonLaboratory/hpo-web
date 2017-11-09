package hpo.api.integration

import grails.testing.mixin.integration.Integration
import hpo.api.term.DbTerm
import spock.lang.Specification

@Integration
class DbTermIntegrationSpec extends Specification {
  void "test find term given id"(){
    def c = DbTerm.createCriteria()
    List<DbTerm> termList = c.list(){
      like('ontologyId', query)
    }
    expect: "fix me"
    termList*.ontologyId == expected

    where:
    query         | expected
    'HP:0000002'  | ["HP:0000002"]
    'HP:0000011'  | ["HP:0000011"]
  }
}

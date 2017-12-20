package hpo.api

import grails.testing.web.controllers.ControllerUnitTest
import spock.lang.Ignore
import spock.lang.Specification

@Ignore(value = 'need to implement')
class HpoTermControllerSpec extends Specification implements ControllerUnitTest<HpoTermController> {

    def setup() {
    }

    def cleanup() {
    }

    void "test something"() {
      setup:
      String term = "HP:0002862"
      when: "we query for a term"
      controller.searchTerm(term)

      then:
      if(termResponse.Term){
        termResponse.Term.getId().getIdWithPrefix() == expected
      }
      else{
        termResponse == expected
      }
        expect:"fix me"
        true == false
    }
}

package hpo.api.model

import groovy.sql.GroovyRowResult
import spock.lang.Specification

class HpoSearchTermResultModelSpec extends Specification {

  def setup(){}

  def cleanup(){}

  void "test model constructs correctly"(){
    when:
    GroovyRowResult result = [ontology_id: "HP:000", name:"Abnormality of the eye", number_of_children: 1, synonym: "Eye Weirdness"]
    def newResult = new SearchTermResult(result)

    then:
    newResult.name == "Abnormality of the eye"

  }

}

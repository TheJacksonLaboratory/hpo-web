package hpo.api.util

import org.monarchinitiative.phenol.formats.hpo.HpoOntology
import spock.lang.Shared
import spock.lang.Specification
import spock.lang.Unroll

@Unroll
class HpoUtilitiesSpec extends Specification {

  @Shared
  HpoOntology hpoOntology

  def setupSpec(){
    hpoOntology = new HpoOntologyFactory().getInstance()
  }

  def setup(){

  }

  void "test checkReturnPrimaryId #desc"(){
    when:
    def utility = new HpoUtilities(hpoOntology)
    def result = utility.checkReturnPrimaryId(query)

    then:
    result == expectedId

    where:
    query         | expectedId        | desc
    "HP:"         | "HP:"             | "should return just query"
    "HP:003"      | "HP:003"          | "should return just query"
    "HP:0000001"  | "HP:0000001"      | "should return primaryid just the query"
    "HP:0000004"  | "HP:0012823"      | "should return primaryid the query obsolete"

  }

}

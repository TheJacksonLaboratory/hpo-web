package hpo.api.util

import org.grails.io.support.ClassPathResource
import org.monarchinitiative.loinc2hpo.loinc.LoincEntry
import org.monarchinitiative.loinc2hpo.loinc.LoincId
import org.monarchinitiative.phenol.ontology.data.TermId
import spock.lang.Shared
import spock.lang.Specification
import spock.lang.Unroll

@Unroll
class Loinc2HpoFactorySpec extends Specification {

  @Shared
  Loinc2HpoFactory factory

  void setupSpec() {
    factory = new Loinc2HpoFactory()
    factory.setAnnotationPath(new ClassPathResource("annotations_test.tsv").file.absolutePath)
    factory.setLoincEntryPath(new ClassPathResource("LoincTableCore_test.csv").file.absolutePath)
  }

  def "Annotation map has correct size and keys"() {

    when:
      def resultMap = factory.annotationMap()

    then:
      resultMap.size() == expectedSize
      resultMap.keySet().toString() == expectedKeys

    where:
    expectedSize | expectedKeys
    3            | '[38230-9, 738-5, 5778-6]'

  }

  def "ReverseAnnotationMap returns #desc"() {
    given:
      def annotationMap = factory.annotationMap()

    when:
      Set<LoincId> result = factory.reverseAnnotationMap(annotationMap).get(TermId.of(inputTerm))

    then:
      result.size() == expectedSize
      result*.toString() == expectedTarget;

    where:
    inputTerm     | expectedSize | expectedTarget   | desc
    "HP:0004363"  |   1          | ["38230-9"]        | "correct result"
    "HP:0040318"  |   1          | ["5778-6"]         | "correct result1"

  }

  def "LoincEntryMap returns #desc"() {

    given:
    def loincMap = factory.loincEntryMap()

    when:
    LoincEntry result = loincMap.get(new LoincId(inputTerm))

    then:
    result*.getScale() == expectedScale
    result*.getLongName() == expectedName;

    where:
    inputTerm     | expectedScale | expectedName                                | desc
    "10040-4"     |   ["Qn"]      | ["S wave amplitude in lead V1"]             | "correct result"
    "38230-9"     |   ["Qn"]      | ["Calcium.ionized [Mass/volume] in Blood"]  | "correct result1"

  }
}

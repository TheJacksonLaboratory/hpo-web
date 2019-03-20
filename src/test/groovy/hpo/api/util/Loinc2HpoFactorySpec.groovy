package hpo.api.util

import org.grails.io.support.ClassPathResource
import org.monarchinitiative.loinc2hpo.loinc.LoincEntry
import org.monarchinitiative.loinc2hpo.loinc.LoincId
import org.monarchinitiative.phenol.ontology.data.TermId
import spock.lang.Shared
import spock.lang.Specification

class Loinc2HpoFactorySpec extends Specification {

  @Shared
  Loinc2HpoFactory factory

  void setupSpec() {
    factory = new Loinc2HpoFactory()
    factory.setAnnotationPath(new ClassPathResource("annotations_test.tsv").file.absolutePath)
    factory.setLoincEntryPath(new ClassPathResource("LoincTableCore_test.csv").file.absolutePath)
  }

  def "AnnotationMap"() {
    given:
      int SIZE = 3

    when:
      int size = factory.annotationMap().size()

    then:
      size == SIZE
  }

  def "ReverseAnnotationMap"() {
    given:
      String target1 = "38230-9"
      String target2 = "5778-6"
      def annotationMap = factory.annotationMap()

    when:
      Set<LoincId> result1 = factory.reverseAnnotationMap(annotationMap).get(TermId.of("HP:0004363"))
      Set<LoincId> result2 = factory.reverseAnnotationMap(annotationMap).get(TermId.of("HP:0040318"))

    then:
      result1.size() == 1
    (++result1.iterator()).toString() == target1
      result2.size() == 1
    (++result2.iterator()).toString() == target2


  }

  def "LoincEntryMap"() {
    given:
      int SIZE = 3
      LoincId query = new LoincId("10040-4")

    when:
      int size = factory.loincEntryMap().size()
      LoincEntry entry = factory.loincEntryMap().get(query)

    then:
      size == SIZE
      entry != null
      entry.getLOINC_Number() == query
      entry.getLongName() == "S wave amplitude in lead V1"
      entry.getScale() == "Qn"
  }
}

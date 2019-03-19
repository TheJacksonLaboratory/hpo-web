package hpo.api

import hpo.api.util.Loinc2HpoFactory
import org.grails.io.support.ClassPathResource
import org.monarchinitiative.loinc2hpo.loinc.LoincEntry
import org.monarchinitiative.phenol.ontology.data.TermId
import spock.lang.Shared
import spock.lang.Specification

class HpoLoincServiceTest extends Specification {

  @Shared
  Loinc2HpoFactory factory

  @Shared
  HpoLoincService hpoLoincService

  void setupSpec() {
    factory = new Loinc2HpoFactory()
    factory.setAnnotationPath(new ClassPathResource("annotations_test.tsv").file.absolutePath)
    factory.setLoincEntryPath(new ClassPathResource("LoincTableCore_test.csv").file.absolutePath)

//    factory = Mock()
    hpoLoincService = new HpoLoincService()
    hpoLoincService.setLoinc2HpoFactory(factory)
  }

  void setup(){
//    Map<LoincId, LoincEntry> mockLoincEntryMap = new HashMap<>()
//    mockLoincEntryMap.put(new LoincId("38230-9"), new LoincEntry("\"38230-9\",\"Calcium.ionized\",\"MCnc\",\"Pt\",\"Bld\",\"Qn\",,\"CHEM\",1,\"Calcium.ionized [Mass/volume] in Blood\",\"Ca-I Bld-mCnc\",,\"ACTIVE\",\"2.13\",\"2.34\""))
//
//    Map<TermId, Set<LoincId>> mockReverseMap = new HashMap<>()
//    mockReverseMap.put(TermId.of("HP:0004363"),
//      new HashSet<LoincId>(Arrays.asList(new LoincId("38230-9"))))

//    factory.loincEntryMap() >> mockLoincEntryMap
//    factory.reverseAnnotationMap() >> mockReverseMap

//    when:
//    def reverseMap = factory.getReverseAnnotationMap()
//    def loincmap = factory.getLoincEntryMap()
//
//    then:
//      reverseMap = mockReverseMap
//      loincmap = mockLoincEntryMap
  }

  def "SearchByHpo"() {

    given:
      TermId query = TermId.of("HP:0004363")

    when:
      Set<LoincEntry> result = hpoLoincService.searchByHpo(query)

    then:
      result.size() == 1
      result.iterator().next().getLongName() == "Calcium.ionized [Mass/volume] in Blood"

  }
}

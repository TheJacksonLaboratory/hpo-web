package hpo.api.disease


import grails.testing.gorm.DomainUnitTest
import hpo.api.disease.DbDisease
import org.apache.commons.lang.NullArgumentException
import org.monarchinitiative.phenol.formats.hpo.HpoAnnotation
import org.monarchinitiative.phenol.formats.hpo.HpoDisease
import org.monarchinitiative.phenol.formats.hpo.HpoOnset
import org.monarchinitiative.phenol.ontology.data.TermId
import spock.lang.Specification
import spock.lang.Unroll

@Unroll
class DbDiseaseUnitSpec extends Specification implements DomainUnitTest<DbDisease> {

  void "test using criteria query for disease #desc"() {

    given: 'we save some term data'
    dbDiseaseIds.each { key, value ->
      buildDbDisease(key, value)
    }

    when: 'we search for a term'
    def c = DbDisease.createCriteria()
    List<DbDisease> diseaseList = c.list() {
      like('diseaseId', query)
    }

    then: "we find the disease"
    diseaseList*.diseaseId == expected

    where:
    dbDiseaseIds                        | query        | expected       | desc
    []                                  | 'OMIM:30020' | []             | 'no terms in db ok'
    ['OMIM:30020': '30020']             | 'OMIM:30020' | ["OMIM:30020"] | 'find a term'

  }

  private static DbDisease buildDbDisease(String diseaseId, String dbId) {
    new DbDisease(db: 'fake', dbId: dbId, diseaseId: diseaseId, diseaseName: 'fake').save(failOnError: true)
  }
  void "test disease constructor"() {
    given:
    HpoAnnotation annotation = new HpoAnnotation.Builder(TermId.of("HP:0000010"))
      .onset(HpoOnset.ONSET)
      .frequency(0.00, "some freq")
      .citations([])
      .modifiers([]).build()

    HpoDisease disease = new HpoDisease(
      "Small Cell Carcinoma Of The Bladder",
      TermId.of("ORPHA:284400"),
      [annotation],
      [],
      []
    )

    when:
    DbDisease dbDisease = new DbDisease(disease).save()

    then:
    verifyAll {
      dbDisease.db  == disease.getDiseaseDatabaseId().getPrefix()
      dbDisease.dbId == disease.getDiseaseDatabaseId().getId()
      dbDisease.diseaseName == disease.getName()
      dbDisease.diseaseId == disease.getDiseaseDatabaseId().toString()
    }
  }


  void "test fix disease name #desc"(){
    expect: "the given name to match the expected"
    DbDisease.fixDiseaseName(testId, testName) == expectedName

    where: "we test possible conditions"
    testId             | testName                             |   expectedName    | desc
    'OMIM:000test'     | 'Disease Name; Synonym Name'         |   'Disease Name'  | 'typical line with synonm'
    'OMIM:000test'     | '%123456 Disease name'               |   'Disease Name'  | 'typical line with garbage %6num'
    'OMIM:000test'     | '+123456 Disease name'               |   'Disease Name'  | 'typical line with garbage +6num'
    'OMIM:000test'     | '+123456 Disease name; Synonym Name' |   'Disease Name'  | 'typical line with garbage +6num with synonym'
    'OMIM:000test'     | '#123456 Disease name; Synonym Name' |   'Disease Name'  | 'typical line with garbage #6num with synonym'
    'OMIM:000test'     | ' Disease Name '                     |   'Disease Name'  | 'typical line with extra spaces'
    'OMIM:000test'     | 'Disease Name'                       |   'Disease Name'  | 'typical line'

  }

  void "test fix disease name bad"(){
    when: "the given name to match the expected"
    DbDisease.fixDiseaseName(testId, testName) == expectedName

    then:
    final NullArgumentException ex = thrown()
    ex.message == expectedException

    where: "we test possible conditions"
    testId             | testName   |   expectedException
    'OMIM:000test'     | ''         |   'Disease Name for disease OMIM:000test must not be null.'
    'OMIM:000test'     | null       |   'Disease Name for disease OMIM:000test must not be null.'

  }
}

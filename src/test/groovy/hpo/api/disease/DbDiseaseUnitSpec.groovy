package hpo.api.disease


import grails.testing.gorm.DomainUnitTest
import hpo.api.disease.DbDisease
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
    HpoAnnotation annotation = new HpoAnnotation(TermId.constructWithPrefix("HP:0000010"),
    0.00, HpoOnset.ONSET, [])
    HpoDisease disease = new HpoDisease(
      "Small Cell Carcinoma Of The Bladder",
      TermId.constructWithPrefix("ORPHA:284400"),
      [annotation],
      [],
      []
    )

    when:
    DbDisease dbDisease = new DbDisease(disease).save()

    then:
    verifyAll {
      dbDisease.db  == disease.getDiseaseDatabaseId().getPrefix().getValue()
      dbDisease.dbId == disease.getDiseaseDatabaseId().getId()
      dbDisease.diseaseName == disease.getName()
      dbDisease.diseaseId == disease.getDiseaseDatabaseId().getIdWithPrefix()
    }
  }
}

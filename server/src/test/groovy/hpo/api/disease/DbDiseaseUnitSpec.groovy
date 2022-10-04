package hpo.api.disease


import grails.testing.gorm.DomainUnitTest
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
}

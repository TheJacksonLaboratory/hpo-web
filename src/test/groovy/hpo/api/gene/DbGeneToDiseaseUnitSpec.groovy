package hpo.api.gene

import grails.testing.gorm.DomainUnitTest
import hpo.api.models.HpoGeneDiseaseAnnotation
import spock.lang.Specification

class DbGeneToDiseaseUnitSpec extends Specification implements DomainUnitTest<DbGeneToDisease> {

  void "test gene to disease constructor"() {
    given:
    HpoGeneDiseaseAnnotation geneMapping = new HpoGeneDiseaseAnnotation(
      7157,
      "TP53",
      "OMIM:260350"
    )

    when:
    DbGeneToDisease dbGeneToDisease = new DbGeneToDisease(geneMapping)

    then:
    verifyAll {
      dbGeneToDisease.geneId  == geneMapping.getGeneId()
      dbGeneToDisease.geneSymbol == geneMapping.getGeneSymbol()
      dbGeneToDisease.diseaseId == geneMapping.getDiseaseId()
    }
  }
}

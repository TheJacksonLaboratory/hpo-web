package hpo.api.annotation

import grails.testing.gorm.DomainUnitTest
import hpo.api.disease.DbDisease
import hpo.api.term.DbTerm
import org.monarchinitiative.phenol.annotations.formats.hpo.HpoDisease
import org.monarchinitiative.phenol.ontology.data.Term
import org.monarchinitiative.phenol.ontology.data.TermId
import spock.lang.Specification

class DbAnnotationSpec extends Specification implements DomainUnitTest<DbAnnotation> {

    def setup() {
    }

    def cleanup() {
    }

    void "test annotation constructor"() {
      when:
      DbTerm term = buildMockTerm()
      DbDisease dbDisease = buildMockDisease()
      String frequency = "1/3000"
      String onset = "early late stage"
      String citation = "PMID:0000"
      DbAnnotation dbAnnotation = new DbAnnotation(term, dbDisease, frequency, onset, citation)

      then:
      dbAnnotation.getFrequency() == frequency
      dbAnnotation.getDbTerm().getName() == term.name
      dbAnnotation.getDbDisease().getDiseaseName() == dbDisease.diseaseName
      dbAnnotation.getOnset() == onset

    }


    def buildMockTerm(){
      return new DbTerm(
        new Term.Builder()
        .id(TermId.of("HP:0000006"))
        .name('A term name')
        .altTermIds([])
        .definition('Descriptive definition')
        .databaseXrefs([])
        .comment('informative comment')
        .createdBy('someUser').build()
        )
    }

    def buildMockDisease(){
      return new DbDisease(
          new HpoDisease(
          "Small Cell Carcinoma Of The Bladder",
          TermId.of("ORPHA:284400"),
          [],
          [],
          [],
          [],
          []
        )
      )
    }
}

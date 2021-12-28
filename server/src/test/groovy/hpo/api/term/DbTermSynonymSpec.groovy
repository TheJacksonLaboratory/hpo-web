package hpo.api.term

import grails.testing.gorm.DomainUnitTest
import org.monarchinitiative.phenol.ontology.data.Term
import org.monarchinitiative.phenol.ontology.data.TermId
import org.monarchinitiative.phenol.ontology.data.TermSynonym
import spock.lang.Specification

class DbTermSynonymSpec extends Specification implements DomainUnitTest<DbTermSynonym> {

    def setup() {
    }

    def cleanup() {
    }

    void "test term synonym constructor and term constructor"() {
      given:
      TermSynonym syn = new TermSynonym("test synonym1",null, '', [], '')
      Term term = new Term.Builder()
        .id(TermId.of("HP:0000006"))
        .name('A term name')
        .altTermIds([])
        .definition('Descriptive definition')
        .databaseXrefs([])
        .comment('informative comment')
        .synonyms([syn])
        .createdBy('someUser').build()

      when:
      DbTerm dbTerm = new DbTerm(term)
      DbTermSynonym dbTermSynonym = new DbTermSynonym(dbTerm, syn.getValue())

      then:"synonym should exist"
        dbTermSynonym.synonym == "test synonym1"
        dbTermSynonym.dbTerm.name == "A term name"
    }
}

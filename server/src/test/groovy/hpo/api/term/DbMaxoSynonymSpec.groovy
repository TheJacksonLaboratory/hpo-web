package hpo.api.term

import grails.testing.gorm.DomainUnitTest
import org.monarchinitiative.phenol.ontology.data.Term
import org.monarchinitiative.phenol.ontology.data.TermId
import org.monarchinitiative.phenol.ontology.data.TermSynonym
import spock.lang.Specification

class DbMaxoSynonymSpec extends Specification implements DomainUnitTest<DbMaxoSynonym> {

  def setup() {
  }

  def cleanup() {
  }

  void "test term synonym constructor and term constructor"() {
    given:
    TermSynonym syn = new TermSynonym("test synonym1",null, '', [], '')
    Term term = new Term.Builder()
      .id(TermId.of("MAXO:0000324"))
      .name('A term name')
      .altTermIds([])
      .definition('Descriptive definition')
      .databaseXrefs([])
      .comment('informative comment')
      .synonyms([syn])
      .createdBy('someUser').build()

    when:
    DbMaxo dbMaxo = new DbMaxo(term)
    DbMaxoSynonym dbMaxoSynonym = new DbMaxoSynonym(dbMaxo, syn.getValue())

    then:"synonym should exist"
    dbMaxoSynonym.synonym == "test synonym1"
    dbMaxoSynonym.dbMaxo.name == "A term name"
  }
}

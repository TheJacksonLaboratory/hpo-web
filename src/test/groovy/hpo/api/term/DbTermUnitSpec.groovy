package hpo.api.term

import org.monarchinitiative.phenol.ontology.data.Term
import org.monarchinitiative.phenol.ontology.data.TermId
import grails.testing.gorm.DomainUnitTest
import hpo.api.term.DbTerm
import spock.lang.Specification
import spock.lang.Unroll

/**
 * Created by djd on 10/23/17.
 */
@Unroll
class DbTermUnitSpec extends Specification implements DomainUnitTest<DbTerm> {

  void "test using criteria query for term #desc"() {

    given: 'we save some term data'
    dbTermIds.each { buildDbTerm(it) }

    when: 'we search for a term'
    def c = DbTerm.createCriteria()
    List<DbTerm> termList = c.list() {
      like('ontologyId', query)
    }

    then: "we find the term"
    termList*.ontologyId == expected

    where:
    dbTermIds      | query        | expected       | desc
    []             | 'HP:0000002' | []             | 'no terms in db ok'
    ['HP:0000002'] | 'HP:0000002' | ["HP:0000002"] | 'find a term'

  }

  void "test term constructor"() {
    given:
    Term term = new Term(
      TermId.constructWithPrefix("HP:0000006"),
      [],
      'A term name',
      'Descriptive definition',
      [],
      'Informative commment',
      [],
      [],
      false,
      'someUser',
      new Date(),
      []
    )

    when:
    DbTerm dbTerm = new DbTerm(term)

    then:
    verifyAll {
      dbTerm.ontologyId == term.id.idWithPrefix
      dbTerm.name == term.name
      dbTerm.isObsolete == term.isObsolete()
      dbTerm.definition == term.definition
      dbTerm.comment == term.comment
    }

  }

  private DbTerm buildDbTerm(String ontologyId) {
    new DbTerm(ontologyId: ontologyId, name: "name-${ontologyId}").save(failOnError: true)
  }
}

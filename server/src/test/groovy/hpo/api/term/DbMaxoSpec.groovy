package hpo.api.term

import grails.testing.gorm.DomainUnitTest
import org.monarchinitiative.phenol.ontology.data.Term
import org.monarchinitiative.phenol.ontology.data.TermId
import spock.lang.Specification

class DbMaxoSpec extends Specification implements DomainUnitTest<DbMaxo> {

  void "test using criteria query for term #desc"() {

    given: 'we save some term data'
    dbTermIds.each { buildDbMaxo(it) }

    when: 'we search for a term'
    def c = DbMaxo.createCriteria()
    List<DbMaxo> termList = c.list() {
      ilike('ontologyId', query + "%")
    }

    then: "we find the term"
    termList*.ontologyId == expected

    where:
    dbTermIds      | query        | expected       | desc
    []             | 'MAXO:00'    | []             | 'no terms in db ok'
    ['MAXO:00001'] | 'MAXO:00'    | ["MAXO:00001"] | 'find a term'

  }

  void "test term constructor"() {
    given:
    Term term = new Term.Builder()
      .id(TermId.of("MAXO:00001"))
      .name('A maxo name')
      .altTermIds([])
      .definition('Descriptive definition')
      .databaseXrefs([])
      .comment('informative comment')
      .createdBy('someUser').build()

    when:
    DbMaxo dbMaxo = new DbMaxo(term)

    then:
    verifyAll {
      dbMaxo.ontologyId == term.id.toString()
      dbMaxo.name == term.name
      dbMaxo.isObsolete == term.isObsolete()
      dbMaxo.definition == term.definition
      dbMaxo.comment == term.comment
    }

  }

  private DbMaxo buildDbMaxo(String ontologyId) {
    new DbMaxo(ontologyId: ontologyId, name: "name-${ontologyId}").save(failOnError: true)
  }
}

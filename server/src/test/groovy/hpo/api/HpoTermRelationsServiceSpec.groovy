package hpo.api

import grails.testing.gorm.DataTest
import grails.testing.services.ServiceUnitTest
import hpo.api.term.DbTerm
import hpo.api.term.DbTermRelationship
import org.monarchinitiative.phenol.ontology.algo.OntologyTerms
import org.monarchinitiative.phenol.ontology.data.TermId
import spock.lang.Specification
import spock.lang.Unroll

@Unroll
class HpoTermRelationsServiceSpec extends Specification implements ServiceUnitTest<HpoTermRelationsService>, DataTest{

  def setupSpec() {
    mockDomain DbTerm
    mockDomain DbTermRelationship
  }

  void "test term relation service #desc"() {

    setup:
      DbTerm termParent1 = buildDbTerm('HP:0000001').save()
      DbTerm termParent2 = buildDbTerm('HP:0000002').save()
      DbTerm termCurrent = buildDbTerm('HP:0000003').save()
      DbTerm termChild1 = buildDbTerm('HP:0000004').save()
      DbTerm termChild2 = buildDbTerm('HP:0000005').save()

      new DbTermRelationship(termParent: termParent1, termChild: termCurrent).save()
      new DbTermRelationship(termParent: termParent2, termChild: termCurrent).save()
      new DbTermRelationship(termParent: termCurrent, termChild: termChild1).save()
      new DbTermRelationship(termParent: termCurrent, termChild: termChild2).save()

    when:
      final Map resultMap = service.findTermRelations(ontologyId)

    then:
      resultMap.term?.ontologyId == expectedTerm
      resultMap.children.data*.ontologyId == expectedChildren
      resultMap.parents.data*.ontologyId == expectedParents

    where:
      ontologyId    | expectedTerm    | expectedChildren              | expectedParents              | desc
      null          | null            | []                            | []                           | 'null'
      ' '           | null            | []                            | []                           | 'blank'
      'junk'        | null            | []                            | []                           | 'junk'
      'HP:0000001'  | 'HP:0000001'    | ['HP:0000003']                | []                           | 'parent term'
      'HP:0000003'  | 'HP:0000003'    | ['HP:0000004', 'HP:0000005']  | ['HP:0000001', 'HP:0000002'] | 'current term'
      'HP:0000005'  | 'HP:0000005'    | []                            | ['HP:0000003']               | 'child term'

  }

  void "test find all descendants #desc"(){
    setup:
    GroovySpy(OntologyTerms, global: true)

    when:
      List termResponse = [
        buildDbTerm('HP:0000001').save(),
        buildDbTerm('HP:0000002').save(),
        buildDbTerm('HP:0000003').save(),
        buildDbTerm('HP:0000004').save()
      ]
      OntologyTerms.childrenOf(_,_) >> getOntologyTermIdList(termResponse)
      final List resultList = service.findAllDescendants(inputOntology, inputQuery)


    then:
      resultList*.ontologyId == expectedDescendants

    where:
      inputOntology | inputQuery | expectedDescendants  |  desc
      "HP:000001"   | ""         | ['HP:0000001', 'HP:0000002', 'HP:0000003', 'HP:0000004'] | "no query with a root"
      "HP:000001"   | "4"        | ['HP:0000004'] | "query for term with a root"
      ""            | ""         | [] | "nothing for both"

  }

  private List<TermId> getOntologyTermIdList(dbTermList){
    return dbTermList.collect { it ->
      TermId.of(it.ontologyId)
    } as List<TermId>
  }

  private DbTerm buildDbTerm(String ontologyId) {
    new DbTerm(ontologyId: ontologyId, name: "name-${ontologyId}").save(failOnError: true)
  }

}

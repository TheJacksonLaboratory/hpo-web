package hpo.api

import grails.testing.gorm.DataTest
import grails.testing.services.ServiceUnitTest
import hpo.api.term.DbTerm
import hpo.api.term.DbTermRelationship
import spock.lang.Specification

class HpoTermRelationsServiceSpec extends Specification implements ServiceUnitTest<HpoTermRelationsService>, DataTest{

  def setupSpec() {
    mockDomain DbTerm
    mockDomain DbTermRelationship
  }

  void "test term relation service #desc"() {

    setup:
      DbTerm termParent1 = buildDbTerm('HP:0000001')
      DbTerm termParent2 = buildDbTerm('HP:0000002')
      DbTerm termCurrent = buildDbTerm('HP:0000003')
      DbTerm termChild1 = buildDbTerm('HP:0000004')
      DbTerm termChild2 = buildDbTerm('HP:0000005')

      termCurrent.addToDbTermRelation(new DbTermRelationship(termParent: termParent1, termChild: termCurrent))
      termCurrent.addToDbTermRelation(new DbTermRelationship(termParent: termParent2, termChild: termCurrent))
      termCurrent.addToDbTermRelation(new DbTermRelationship(termParent: termCurrent, termChild: termChild1))
      termCurrent.addToDbTermRelation(new DbTermRelationship(termParent: termCurrent, termChild: termChild2))
      termCurrent.save()

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

  private DbTerm buildDbTerm(String ontologyId) {
    new DbTerm(ontologyId: ontologyId, name: "name-${ontologyId}").save(failOnError: true)
  }

}

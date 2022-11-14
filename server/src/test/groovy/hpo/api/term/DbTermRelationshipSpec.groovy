package hpo.api.term

import grails.testing.gorm.DomainUnitTest
import spock.lang.Specification
import spock.lang.Unroll

@Unroll
class DbTermRelationshipSpec extends Specification implements DomainUnitTest<DbTermRelationship> {

  void "test children and parent queries #desc"() {

    setup: 'save some term data and add children to parent'
      List<DbTerm> parents = []
      dbParentIds.each { parentId ->
        DbTerm  parent = buildDbTerm(parentId)
        parents.add(parent)
        parent.save()

        dbChildTermIds.each { childId ->
          DbTerm child = DbTerm.findByOntologyId(childId)
          if (child == null)  child = buildDbTerm(childId)
          DbTermRelationship tr = new DbTermRelationship(termParent: parent, termChild: child)
          tr.save()
        }
      }

    when: 'we search for a term'
      Set<DbTerm> childrenList = parents[0].getChildren()
      Set<DbTerm> parentList = childrenList.size() > 0 ? childrenList[0]?.getParents() : []

    then: "we find the children and parents"
      childrenList*.ontologyId == expectedChildren
      parentList*.ontologyId == expectedParents


    where:
      dbParentIds                 | dbChildTermIds               | expectedChildren               | expectedParents             | desc
      ['HP:0000001']              | []                           | []                             |[]                           | 'no child terms in db'
      ['HP:0000001']              | ['HP:0000002']               | ['HP:0000002']                 |['HP:0000001']               | 'one  child term, one parent term'
      ['HP:0000001']              | ['HP:0000002', 'HP:0000003'] | ['HP:0000002', 'HP:0000003']   |['HP:0000001']               | 'one parent, multiple children'
      ['HP:0000001','HP:0000002'] | ['HP:0000003']               | ['HP:0000003']                 |['HP:0000001','HP:0000002']  | 'multiple parents'

  }

  private DbTerm buildDbTerm(String ontologyId) {
    new DbTerm(ontologyId: ontologyId, name: "name-${ontologyId}").save(failOnError: true)
  }
}

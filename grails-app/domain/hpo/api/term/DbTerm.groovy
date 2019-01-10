package hpo.api.term

import groovy.sql.GroovyRowResult
import org.monarchinitiative.phenol.ontology.data.Term
import hpo.api.disease.DbDisease
import hpo.api.gene.DbGene

/**
 * Minimal term representation in a table, doesn't have all info on a term currenlty but info useful
 * for search
 */
class DbTerm {

  String ontologyId
  String name
  boolean isObsolete
  String definition
  String comment
  /**
   * the number of child terms including self
   */
  Integer numberOfChildren


  static constraints = {
    ontologyId()
    name()
    isObsolete()
    definition(nullable: true)
    comment(nullable: true)
    numberOfChildren(nullable: true)
  }
  static mapping = {
    ontologyId()
    name(index: 'name_index')
    isObsolete()
    definition(type: 'text')
    comment(type: 'text')
    numberOfChildren()
  }

  static hasMany = [dbTermPaths: DbTermPath,
                    dbGenes: DbGene,
                    dbDiseases: DbDisease,
                    dbTermParents: DbTermRelationship,
                    dbTermChildren: DbTermRelationship,
                    dbTermSynonyms: DbTermSynonym]

  static mappedBy = [dbTermParents: 'termParent', dbTermChildren: 'termChild']

  Set<DbTermPath> dbTermPaths = [] as Set<DbTermPath>
  Set<DbGene> dbGenes = [] as Set<DbGene>
  Set<DbGene> dbDiseases = [] as Set<DbGene>
  Set<DbTermRelationship> dbTermParents = [] as Set<DbTermRelationship>
  Set<DbTermRelationship> dbTermChildren = [] as Set<DbTermRelationship>

  DbTerm() {}

  DbTerm(Term term) {
    name = term.name
    definition = term.definition
    comment = term.comment
    ontologyId = term.id.toString()
    isObsolete = term.isObsolete()
  }

  DbTerm(GroovyRowResult result){
    name = result.name
    numberOfChildren = result.number_of_children
    ontologyId = result.ontology_id
  }

  static transients = ['children', 'parents']

  /**
   * gets the term (DbTerm) children objects of this term object
   * @return
   */
  Set<DbTerm> getChildren()
  {
    dbTermParents*.termChild
  }

  /**
   * gets the term (DbTerm) parents objects of this term object
   * @return
   */
  Set<DbTerm> getParents()
  {
    dbTermChildren*.termParent
  }

}

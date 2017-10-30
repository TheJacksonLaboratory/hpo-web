package hpo.api.term

import com.github.phenomics.ontolib.ontology.data.Term

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

  static hasMany = [dbTermPaths: DbTermPath]

  DbTerm() {}

  DbTerm(Term term) {
    name = term.name
    definition = term.definition
    comment = term.comment
    ontologyId = term.id.idWithPrefix
    isObsolete = term.isObsolete()
  }

}

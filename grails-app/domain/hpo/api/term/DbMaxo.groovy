package hpo.api.term

import org.monarchinitiative.phenol.ontology.data.Term

class DbMaxo {

    String ontologyId
    String name
    String definition
    String comment
    boolean isObsolete

    static constraints = {
      definition(nullable:  true)
      comment(nullable: true)
    }

    static mapping = {
      definition(type: 'text')
      comment(type: 'text')
    }

    DbMaxo(Term term) {
      name = term.name
      definition = term.definition
      comment = term.comment
      ontologyId = term.id.toString()
      isObsolete = term.isObsolete()
    }
}

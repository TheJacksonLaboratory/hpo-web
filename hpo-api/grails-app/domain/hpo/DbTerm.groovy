package hpo

class DbTerm {

    String ontologyId
    String name
    boolean isObsolete
    String definition
    String comment


    static constraints = {
        ontologyId()
        name()
        isObsolete()
        definition(nullable: true)
        comment(nullable: true)
    }
    static mapping = {
        definition(type: 'text')
        comment(type: 'text')
    }


}

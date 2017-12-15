package hpo.api.term

/**
 * Holds DbTerm parent-child relationships
 */
class DbTermRelationship implements Serializable{

    DbTerm termParent
    DbTerm termChild

    static hasMany = [termParent : DbTerm, termChild: DbTerm]
    static belongsTo = [termParent: DbTerm, termChild: DbTerm]

    static mapping = {
      id composite: ['termParent', 'termChild']
    }
    static constraints = {
      termParent()
      termChild()
    }

}

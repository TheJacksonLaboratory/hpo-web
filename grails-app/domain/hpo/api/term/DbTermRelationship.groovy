package hpo.api.term

/**
 * Holds DbTerm parent-child relationships
 */
class DbTermRelationship implements Serializable{

    DbTerm termParent
    DbTerm termChild

    static belongsTo = DbTerm

    static constraints = {
      termParent()
      termChild()
    }

}

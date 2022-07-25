package hpo.api.term

import hpo.api.term.DbTerm

/**
 * Created by djd on 10/20/17.
 */
class DbTermPath {

  DbTerm dbTerm

  String pathNames
  String pathIds
  Integer pathLength

  static constraints = {
    pathNames()
    pathIds()
    pathLength()
  }
  static mapping = {
    pathNames(type: 'text')
    pathIds(type: 'text')
    version false
  }
  static belongsTo = [dbTerm: DbTerm]
}

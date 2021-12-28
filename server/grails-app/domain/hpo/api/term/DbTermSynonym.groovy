package hpo.api.term

class DbTermSynonym {

  DbTerm dbTerm
  String synonym

  static constraints = {
    synonym()
  }
  static mapping = {
    synonym(type: 'text')
    version false
  }

  static belongsTo = [dbTerm: DbTerm]

  DbTermSynonym(DbTerm term, String syn){
    dbTerm = term
    synonym = syn
  }

}

package hpo.api.term

class DbMaxoSynonym {

  DbMaxo dbMaxo
  String synonym
  static constraints = {
    synonym()
  }
  static mapping = {
    synonym(type: 'text')
    dbMaxo fetch: 'join'
    version false
  }

  static belongsTo = [dbMaxo: DbMaxo]
  DbMaxoSynonym(DbMaxo maxo, String syn){
    dbMaxo = maxo
    synonym = syn
  }

}

package hpo.api.model

import hpo.api.term.DbMaxo

class MaxoSearchResult {

  DbMaxo maxoTerm
  boolean synonymMatch
  String matchedSynonym

  MaxoSearchResult(DbMaxo maxoTerm, boolean synonymMatch, String matchedSynonym){
    this.maxoTerm = maxoTerm
    this.synonymMatch = synonymMatch
    this.matchedSynonym = matchedSynonym
  }
}

package hpo.api.model

import hpo.api.term.DbTerm

class AnnotationResult {

  String ontologyId
  String termName
  String definition
  String frequency
  String onset
  String sources


  AnnotationResult(DbTerm term, onset, frequency, sources){
    this.ontologyId = term.getOntologyId()
    this.termName = term.getName()
    this.definition = term.getDefinition()
    this.onset = onset
    this.frequency = frequency
    this.sources = sources
  }

}

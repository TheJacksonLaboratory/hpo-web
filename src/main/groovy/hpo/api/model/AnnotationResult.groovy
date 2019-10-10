package hpo.api.model

import hpo.api.term.DbTerm

class AnnotationResult {

  String ontologyId
  String termName
  String definition
  String frequency
  String onset
  String citations


  AnnotationResult(DbTerm term, onset, frequency, citations){
    this.ontologyId = term.getOntologyId()
    this.termName = term.getName()
    this.definition = term.getDefinition()
    this.onset = onset
    this.frequency = frequency
    this.citations = citations
  }

}

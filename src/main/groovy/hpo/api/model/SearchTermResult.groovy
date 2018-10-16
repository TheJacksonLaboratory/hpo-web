package hpo.api.model

import groovy.sql.GroovyRowResult
import hpo.api.term.DbTerm

class SearchTermResult {

  String ontologyId
  String name
  Integer numberOfChildren
  String synonym

  SearchTermResult(GroovyRowResult result){
    ontologyId = result.ontology_id
    name = result.name
    numberOfChildren = result.number_of_children
    synonym = result.synonym
  }

  SearchTermResult(DbTerm term){
    ontologyId = term.ontologyId
    name = term.name
    numberOfChildren = term.numberOfChildren
    synonym = ""
  }

}

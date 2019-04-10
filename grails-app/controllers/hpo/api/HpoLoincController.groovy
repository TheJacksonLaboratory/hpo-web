package hpo.api

import org.monarchinitiative.phenol.ontology.data.TermId

class HpoLoincController {

  HpoLoincService hpoLoincService
  /**
   * Search by LoincId, show a list of HPO terms
   * @param loincId
   */
  def searchByLoincId(String loincId){

    //@TODO: show at front end
  }

  /**
   * Search by an hpo termId, show a list of LOINC codes
   * @param hpoId
   */
  def searchByHpoId(String id){
    render(view: 'loinc', model: [entryList: hpoLoincService.searchByHpo(TermId.of(id)).toList()])
  }
}

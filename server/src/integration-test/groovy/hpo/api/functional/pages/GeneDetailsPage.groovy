package hpo.api.functional.pages

import geb.Page

class GeneDetailsPage extends Page{

  static final String TITLE = 'Human Phenotype Ontology'

  static url = "/app/browse/gene/5925"

  static at = {
    title == TITLE
  }

  static content = {

    termTabElement(wait:true) {$"#mat-tab-label-0-1"}
    termFilterElement(wait:true, required:false) {$"#termFilterInput"}
    termPagingRangeLabelElement(wait:true, required: false) {$(".mat-paginator-range-label")}

    diseaseTabElement(wait:true) {$"#mat-tab-label-0-2"}
    diseaseFilterElement(wait:true, required:false) { $("#diseaseFilterInput")}
    diseasePagingRangeLabelElement(wait:true, required: false) {$(".mat-paginator-range-label")}

    downloadAssociationButton(wait:true, required: false) { $(".download-associations")}
    downloadAssociationDialog(wait:true, required: false) { $(".mat-dialog-container")}
    downloadDiseaseAssociationButton(wait: true, required: false) { $(".dialog-selection").first()}
    downloadTermsAssociationButton(wait: true, required: false) { $(".dialog-selection")[1]}

  }

}

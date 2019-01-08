package hpo.api.functional.pages

import geb.Page

class DiseaseDetailsPage extends Page{

  static final String TITLE = 'Human Phenotype Ontology'

  static url = "/app/browse/disease/OMIM:109800"

  static at = {
    title == TITLE
  }

  static content = {

    geneTabElement(wait:true) {$"#mat-tab-label-0-1"}
    geneFilterElement(wait:true, required:false) { $("#geneFilterInput")}
    genePagingRangeLabelElement(wait:true, required: false) {$(".gene-association .mat-paginator-range-label")}

    downloadAssociationButton(wait:true, required: false) { $(".download-associations")}
    downloadAssociationDialog(wait:true, required: false) { $(".mat-dialog-container")}
    downloadTermsAssociationButton(wait: true, required: false) { $(".dialog-selection").first()}
    downloadGenesAssociationButton(wait: true, required: false) { $(".dialog-selection")[1]}

  }

}

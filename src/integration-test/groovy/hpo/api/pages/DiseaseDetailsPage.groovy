package hpo.api.pages

import geb.Page

class DiseaseDetailsPage extends Page{

  static final String TITLE = 'HPO'

  static url = "/app/browse/disease/ORPHA:1606"

  static at = {
    title == TITLE
  }

  static content = {

    geneTabElement(wait:true) {$"#mat-tab-label-0-1"}
    geneFilterElement(wait:true, required:false) { $("#geneFilterInput")}
    genePagingRangeLabelElement(wait:true, required: false) {$(".gene-association .mat-paginator-range-label")}

  }

}

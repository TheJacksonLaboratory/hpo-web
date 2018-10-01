package hpo.api.pages

import geb.Page

class TermDetailsPage extends Page{

  static final String TITLE = 'Human Phenotype Ontology'

  static url = "/app/browse/term/HP:0002231"

  static at = {
    title == TITLE
  }

  static content = {
    diseasePagingElement(wait:true, required:false)  { $("div#assocDiseasePagingSubset")}
    diseaseViewAllLink(wait:true, required:false)  { $("div#assocDiseasePagingSubset a")}
    geneTabElement(wait:true) {$"#mat-tab-label-0-1"}
    diseaseTabElement(wait:true) {$"#mat-tab-label-0-0"}
    genePagingElement(wait:true, required:false)  { $("div#assocGenePagingSubset")}
    geneViewAllLink(wait:true, required:false){$("a",text:"View all")}
    diseaseViewAllLink(wait:true, required:false){$("a",text:"View all")}
    genePagingElementAll(wait:true, required:false)  { $("div#assocGenePagingAll")}
    diseasePagingElementAll(wait:true, required:false)  { $("div#assocDiseasePagingAll")}
    diseaseFilterElement(wait:true, required:false) { $("#diseaseFilterInput")}

    geneFilterElement(wait:true, required:false) { $("div#geneFilterInput")}
    diseasePagingRangeLabelElement(wait:true, required: false) {$(".disease-association .mat-paginator-range-label")}

  }

  def loadGeneAssociations(){
    geneTabElement.click()
    waitFor(10){geneViewAllLink}
  }

  def loadAllGenes(){
    geneViewAllLink.click()
    waitFor(10, 2) {genePagingElementAll}
  }

  def loadDiseaseAssociations(){
    diseaseTabElement.click()
    waitFor(10){diseaseViewAllLink}
  }

  def loadAllDiseases(){
    diseaseViewAllLink.click()
  }
}

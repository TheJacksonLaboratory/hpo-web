package hpo.api.pages

import geb.Page

class TermDetailsPage extends Page{

  static final String TITLE = 'HPO'

  static url = "/app/browse/term/HP:0002231"

  static at = {
    title == TITLE
  }

  static content = {
    diseasePagingElement(wait:true, required:false)  { $("div#assocDiseasePagingSubset")}
    diseasePagingElementAll(wait:true, required:false)  { $("div#assocDiseasePagingAll")}
    diseaseViewAllLink(wait:true, required:false)  { $("div#assocDiseasePagingSubset a")}
    geneTabElement(wait:true) {$"#mat-tab-label-0-1"}
    genePagingElement(wait:true, required:false)  { $("div#assocGenePagingSubset")}
    geneViewAllLink(wait:true, required:false){$("a",text:"View all")}
    genePagingElementAll(wait:true, required:false)  { $("div#assocGenePagingAll")}

  }

  def loadGeneAssociations(){
    geneTabElement.click()
    waitFor(10){geneViewAllLink}
  }

  def loadAllGenes(){
    geneViewAllLink.click()
    waitFor(10, 2) {genePagingElementAll}
  }
}

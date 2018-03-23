package hpo.api.pages

import geb.Page

class TermDetailsPage extends Page{

  static final String TITLE = 'HPO'

  static url = "/app/browse/term/HP:0002231"

  static at = {
    title == TITLE
  }

  static content = {
    diseasePagingElement(wait:true, required:false)  { $("#assocDiseasePagingSubset")}
    diseasePagingElementAll(wait:true, required:false)  { $("#assocDiseasePagingAll")}
    diseasePagingElementViewAllLink(wait:true, required:false)  { $("#assocDiseasePagingSubset a")}
    geneTabElement(wait:true) {$"#mat-tab-label-0-1"}
    genePagingElement(wait:true, required:false)  { $("#assocGenePagingSubset")}
    genePagingElementViewAllLink(wait:true, required:false)  { $("#mat-tab-content-0-1 .mat-tab-body-content #assocGenePagingSubset a")}
    genePagingElementAll(wait:true, required:false)  { $("#mat-tab-content-0-1 .mat-tab-body-content #assocGenePagingAll")}

  }

  def loadGeneAssociations(){
    geneTabElement.click()
    waitFor{genePagingElement.present}
    //waitFor{genePagingElementViewAllLink.present}
  }

  def loadAllGenes(){
   
    //genePagingElement.children('p').children('a').click()
    genePagingElementViewAllLink.click()
    waitFor{genePagingElementAll.present}
  }
}

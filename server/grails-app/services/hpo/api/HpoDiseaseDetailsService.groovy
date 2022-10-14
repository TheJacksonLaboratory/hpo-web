package hpo.api

import groovy.transform.CompileDynamic
import hpo.api.annotation.DbAnnotation
import hpo.api.disease.DbDisease
import hpo.api.model.AnnotationResult
import hpo.api.term.DbTerm
import org.monarchinitiative.phenol.annotations.formats.hpo.category.HpoCategory
import org.monarchinitiative.phenol.annotations.formats.hpo.category.HpoCategoryMap
import org.monarchinitiative.phenol.ontology.data.Ontology
import org.monarchinitiative.phenol.ontology.data.TermId

@CompileDynamic
class HpoDiseaseDetailsService {

  Ontology hpoOntology

  Map searchDisease(String query) {
    Map resultMap = ["disease": '', "termAssoc": [], "geneAssoc": [], "catTerms":[]]
    if (query) {
      DbDisease disease = getDisease(query)
      if (!disease) {
        return resultMap
      }
      resultMap.put("disease", disease)
      resultMap.put("termAssoc", getTermsAssociatedByDisease(disease))
      resultMap.put("geneAssoc", disease.dbGenes)
      resultMap.put("catTerms", getDiseaseCategoriesWithTerms(disease))
    }
    return resultMap
  }

  DbDisease getDisease(String query) {
    DbDisease.findByDiseaseId(query)
  }

  List<DbTerm> getTermsAssociatedByDisease(DbDisease disease){
    return DbAnnotation.findAllByDbDisease(disease).dbTerm
  }

  /**
   * Given a disease find HPO categories and related HPO terms. Return as a list
   * of maps [category : [ Terms ]]
   * @param disease
   * @return
   *
   * TODO: Rework, simplify into using just a map
   */

  private List<Map> getDiseaseCategoriesWithTerms(DbDisease disease){

    HpoCategoryMap hpoCatMap = new HpoCategoryMap()

    def dbTermList  = getTermsAssociatedByDisease(disease)
    dbTermList.each {dbTerm ->
      final TermId termId = TermId.of(dbTerm.getOntologyId())
      hpoCatMap.addAnnotatedTerm(termId, hpoOntology)
    }

    final List<HpoCategory> hpoCatList = hpoCatMap.getActiveCategoryList()
    final List<Map> catList = hpoCatList.collect { cat ->
      Map categoryTermMap = [:]
      List<AnnotationResult> catAnnotationResult = []
      List<TermId> termIdList = cat.getAnnotatingTermIds()


      termIdList.unique().each { termId ->
        dbTermList.find(it -> it.ontologyId == termId.toString()).each { dbTerm ->
          catAnnotationResult.addAll(buildAnnotationResult(disease, dbTerm))
        }
      }

      categoryTermMap.put("catLabel", cat.getLabel())
      categoryTermMap.put("terms", catAnnotationResult)
      return categoryTermMap
    }

    return catList
  }

  List<AnnotationResult> buildAnnotationResult(DbDisease disease, DbTerm dbTerm){
    List<DbAnnotation> annotation = DbAnnotation.findAllWhere(dbTerm: dbTerm, dbDisease: disease)
    return annotation.collect {
      new AnnotationResult(it.getDbTerm(), getOnsetLabel(it.getOnset()), it.getFrequency(), it.getSources())
    }
  }

  def getOnsetLabel(String onset){
    if(onset == null || onset == ""){
      return ""
    }

    return hpoOntology.getTermLabel(TermId.of(onset)).get()
  }

}

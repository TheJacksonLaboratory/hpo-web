package hpo.api

import grails.compiler.GrailsCompileStatic
import groovy.transform.TypeCheckingMode
import hpo.api.disease.DbDisease
import hpo.api.term.DbTerm
import org.monarchinitiative.phenol.formats.hpo.HpoOntology
import org.monarchinitiative.phenol.formats.hpo.category.HpoCategory
import org.monarchinitiative.phenol.formats.hpo.category.HpoCategoryMap
import org.monarchinitiative.phenol.ontology.data.TermId
import org.monarchinitiative.phenol.ontology.data.Term

@GrailsCompileStatic
class HpoDiseaseDetailsService {

  HpoOntology hpoOntology

  Map searchDisease(String query) {
    Map resultMap = ["disease": '', "termAssoc": [], "geneAssoc": [], "catTerms":[[:]]]
    if (query) {
      DbDisease disease = getDisease(query)
      if (!disease) {
        return resultMap
      }
      resultMap.put("disease", disease)
      resultMap.put("termAssoc", disease.dbTerms)
      resultMap.put("geneAssoc", disease.dbGenes)
      resultMap.put("catTerms", getDiseaseCategoriesWithTerms(disease))
    }
    return resultMap
  }

  DbDisease getDisease(String query) {
    DbDisease.findByDiseaseId(query)
  }

  /**
   * Given a disease find HPO categories and related HPO terms. Return as a list
   * of maps [category : [ Terms ]]
   * @param disease
   * @return
   */
  @GrailsCompileStatic(TypeCheckingMode.SKIP)
  private List<Map> getDiseaseCategoriesWithTerms(DbDisease disease){

    HpoCategoryMap hpoCatMap = new HpoCategoryMap()
    List<Map> catList = []

    Set<DbTerm> dbTermList  = disease.dbTerms
    dbTermList.each {dbTerm ->
      TermId termId = TermId.of(dbTerm.getOntologyId())
      hpoCatMap.addAnnotatedTerm(termId, hpoOntology)
    }

    List<HpoCategory> hpoCatList = hpoCatMap.getActiveCategoryList()

    hpoCatList.each { cat ->
        Map categoryTermMap = [:]
        cat.getNumberOfAnnotations()
        List<DbTerm> catDbTermList = []

        //get category terms
        List<TermId> termIdList = cat.getAnnotatingTermIds()
        termIdList.each { tId ->
          Term term = hpoOntology.getTermMap().get(tId)
          String termIdWithPrefix = term.getId().toString()

          //add the DbTerm to the list of terms
          catDbTermList << DbTerm.findByOntologyId(termIdWithPrefix)
        }

        //populate the map
        categoryTermMap.put("catLabel", cat.getLabel())
        categoryTermMap.put("terms", catDbTermList)
        catList.add(categoryTermMap)
    }

    catList //return
  }

}

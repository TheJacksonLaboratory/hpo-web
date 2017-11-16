package hpo.api

import com.github.phenomics.ontolib.formats.hpo.HpoDiseaseAnnotation
import grails.compiler.GrailsCompileStatic
import groovy.transform.TypeCheckingMode
import hpo.api.disease.DbDisease
import org.apache.commons.lang.StringUtils

@GrailsCompileStatic
class HpoDiseaseDetailsService {

  Map searchDisease(String query) {
    Map resultMap = ["disease": '', "termAssoc": [], "geneAssoc": []]
    if (query) {
      DbDisease disease = getDisease(query)
      resultMap.put("disease", disease)
      resultMap.put("termAssoc", disease.dbTerms)
      resultMap.put("geneAssoc", disease.dbGenes)
    }
    return resultMap
  }

  DbDisease getDisease(String query) {
    DbDisease.findByDiseaseId(query)
  }
}

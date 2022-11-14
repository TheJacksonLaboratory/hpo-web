package hpo.api.db.utils

import grails.gorm.transactions.Transactional
import groovy.transform.CompileStatic
import hpo.api.disease.DbDisease
import hpo.api.gene.DbGene
import hpo.api.term.DbTerm
import org.apache.commons.lang3.time.StopWatch

/**
 * Created by gargam on 11/13/17.
 */
@CompileStatic
@Transactional
class DomainUtilService {

  /**
   * @return a map with the keys the hpoIds (HP:0000001) and the value being the corresponding DbTerm that represents that hpoId
   */
  static Map<String, DbTerm> loadHpoIdToDbTermMap() {
    final Map<String, DbTerm> mapToReturn = [:]
    DbTerm.list().each { DbTerm dbTerm ->
      mapToReturn.put(dbTerm.ontologyId, dbTerm)
    }
    mapToReturn
  }
  static Map<String, DbDisease> loadDbDiseases() {
    Map<String, DbDisease> mapToReturn = [:]
    StopWatch stopWatch = new StopWatch()
    stopWatch.start()
    DbDisease.list().each { DbDisease dbDisease ->
      mapToReturn.put(dbDisease.diseaseId, dbDisease)
    }
    mapToReturn
  }
  static Map<Integer, DbGene> loadDbGenes() {
    Map<Integer, DbGene> mapToReturn = [:]
    StopWatch stopWatch = new StopWatch()
    stopWatch.start()
    DbGene.list().each { DbGene dbGene ->
      mapToReturn.put(dbGene.geneId, dbGene)
    }
    mapToReturn
  }
}

package hpo.api.db

import groovy.sql.BatchingPreparedStatementWrapper
import groovy.sql.Sql
import hpo.api.db.utils.SqlUtilsService
import hpo.api.io.HpoDiseaseParser
import grails.gorm.transactions.Transactional
import hpo.api.disease.DbDisease
import hpo.api.term.DbTerm
import org.apache.commons.lang.time.StopWatch
import org.grails.io.support.ClassPathResource
import org.hibernate.Session

@Transactional
class DbDiseaseAdminService {

  SqlUtilsService sqlUtilsService

  void truncateDbDiseases() {
    sqlUtilsService.executeDetete("delete from db_disease")
  }

  void truncateDiseaseTermJoinTable() {
    sqlUtilsService.executeDetete("delete from db_term_db_disease")
  }

  Map<Integer, String> loadDiseases() {
    StopWatch stopWatch = new StopWatch()
    stopWatch.start()
    Map<String, String> diseaseIdToNameMap = [:]
    final File file = new ClassPathResource("phenotype_annotation.tab").file
    file.eachLine { String line ->
      String[] tokens = line.split('\t')
      if (tokens.size() == 14) {
        String db = tokens[0]
        String dbObjectId = tokens[1]
        String diseaseName = tokens[2]
        String diseaseId = db + ":" + dbObjectId
        if (!diseaseIdToNameMap.get(diseaseId)) {
          diseaseIdToNameMap.put(diseaseId, dbObjectId)
          DbDisease dbDisease = new DbDisease(db: db, dbId: dbObjectId, diseaseName: diseaseName, diseaseId: diseaseId)
          dbDisease.save()
        }
      } else {
        log.info("skipping line : ${line}")
      }
    }
    log.info("Loading Diseases -  file ${file.name} duration: ${stopWatch} time: ${new Date()} ]")
  }

  Map<String, DbDisease> loadDbDiseases() {
    Map<String, DbDisease> mapToReturn = [:]
    StopWatch stopWatch = new StopWatch()
    stopWatch.start()
    DbDisease.list().each { DbDisease dbDisease ->
      mapToReturn.put(dbDisease.diseaseId, dbDisease)
    }
    mapToReturn
  }

  /**
   * @return a map with the keys the hpoIds (HP:0000001) and the value being the corresponding DbTerm that represents that hpoId
   */
  Map<String, DbTerm> loadHpoIdToDbTermMap() {
    final Map<String, DbTerm> mapToReturn = [:]
    DbTerm.list().each { DbTerm dbTerm ->
      mapToReturn.put(dbTerm.ontologyId, dbTerm)
    }
    mapToReturn
  }

  /**
   * loop over each line of the ALL_SOURCES_ALL_FREQUENCIES_genes_to_phenotype.txt file
   * and fill in the join table with local primary keys and not any genes or hpo terms that don't match
   *
   * <pre>
   *     #Format: entrez-gene-id<tab>entrez-gene-symbol<tab>HPO-Term-Name<tab>HPO-Term-ID
   *     8192    CLPP    Primary amenorrhea      HP:0000786
   * </pre>
   */
  void joinDiseaseAndTermsWithSql() {
    StopWatch stopWatch = new StopWatch()
    stopWatch.start()
    Set<String> hpoIdWithPrefixNotFoundSet = [] as Set
    Set<String> diseaseIdNotFoundSet = [] as Set
    final Map<String, DbDisease> diseaseIdGeneMap = loadDbDiseases()
    final Map<String, DbTerm> hpoIdToDbTermMap = loadHpoIdToDbTermMap()
    final File file = new ClassPathResource("phenotype_annotation.tab").file
    Integer lastTermId = null
    Integer lastDiseaseId = null
      sqlUtilsService.sql.withBatch(500, "INSERT INTO db_term_db_disease( db_disease_id, db_term_id) VALUES(?,?)") { BatchingPreparedStatementWrapper ps ->
        int index = 0;
        file.eachLine { String line ->
          index++
          String[] tokens = line.split('\t')
          if (tokens.size() == 14) {
            final DbTerm dbTerm = hpoIdToDbTermMap.get(tokens[4]) //term token
            String diseaseId = tokens[0] + ":" + tokens[1]
            diseaseId = diseaseId.trim()
            final DbDisease dbDisease = diseaseIdGeneMap.get(diseaseId) //diseaseid
            if (dbTerm == null) {
              hpoIdWithPrefixNotFoundSet.add(tokens[4])
            } else if (dbDisease == null) {
              diseaseIdNotFoundSet.add(diseaseId) // add diseaseid
            } else {
              if (dbTerm.id == lastTermId && dbDisease.id == lastDiseaseId) {
                log.info("DUPLICATE LINE: ${line}")
              } else {
                ps.addBatch([
                  dbDisease.id as Object,
                  dbTerm.id as Object,
                ])
                lastDiseaseId = dbDisease.id
                lastTermId = dbTerm.id
              }

            }
          } else {
            log.info("skipping line : ${line}")
          }
      }
    }
    log.info("hpoIdWithPrefixNotFoundSet.size() : ${hpoIdWithPrefixNotFoundSet.size()} ${new Date()}")
    log.info("${hpoIdWithPrefixNotFoundSet}")
    log.info("entrezIdNotFoundSet.size() : ${diseaseIdNotFoundSet.size()} ${new Date()}")
    log.info("${diseaseIdNotFoundSet}")
    log.info("Joined Disease And Terms - file ${file.name} duration: ${stopWatch} time: ${new Date()}")
  }
}



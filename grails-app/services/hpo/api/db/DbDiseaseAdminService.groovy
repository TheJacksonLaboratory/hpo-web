package hpo.api.db

import groovy.sql.BatchingPreparedStatementWrapper
import hpo.api.db.utils.SqlUtilsService
import grails.gorm.transactions.Transactional
import hpo.api.disease.DbDisease
import hpo.api.gene.DbGene
import hpo.api.term.DbTerm
import org.apache.commons.lang.time.StopWatch
import org.grails.io.support.ClassPathResource
import hpo.api.db.utils.DomainUtilService

@Transactional
class DbDiseaseAdminService {

  SqlUtilsService sqlUtilsService
  DomainUtilService domainUtilService
  final String INSERT_INTO_DB_TERM_DB_DISEASES = "INSERT INTO db_term_db_diseases( db_disease_id, db_term_id) VALUES(?,?)"
  final String INSERT_INTO_DB_GENE_DB_DISEASES = "INSERT INTO db_gene_db_diseases( db_gene_id, db_disease_id) VALUES(?,?)"

  void truncateDbDiseases() {
    sqlUtilsService.executeDetete("delete from db_disease")
  }

  void truncateDiseaseTermJoinTable() {
    sqlUtilsService.executeDetete("delete from db_term_db_diseases")
  }
  void truncateDiseaseGeneJoinTable(){
    sqlUtilsService.executeDetete("delete from db_gene_db_diseases")
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
  /**
   * loop over each line of the phenotype.tab file
   * and fill in the join table with local primary keys and not any genes or hpo terms that don't match
   *
   * <pre>
   *     #Format: dbId<tab>dbName<tab>diseaseName<tab>diseaseId
   *        *     2020      OMIM      Congenial Cataract    OMIM:2020
   * </pre>
   */
  void joinDiseaseAndTermsWithSql() {
    StopWatch stopWatch = new StopWatch()
    stopWatch.start()
    Set<String> hpoIdWithPrefixNotFoundSet = [] as Set
    Set<String> diseaseIdNotFoundSet = [] as Set
    final Map<String, DbDisease> diseaseIdMap = domainUtilService.loadDbDiseases()
    final Map<String, DbTerm> hpoIdToDbTermMap = domainUtilService.loadHpoIdToDbTermMap()
    final File file = new ClassPathResource("phenotype_annotation.tab").file
    Integer lastTermId = null
    Integer lastDiseaseId = null
      sqlUtilsService.sql.withBatch(500,INSERT_INTO_DB_TERM_DB_DISEASES ) { BatchingPreparedStatementWrapper ps ->
        int index = 0;
        file.eachLine { String line ->
          index++
          String[] tokens = line.split('\t')
          if (tokens.size() == 14) {
            final DbTerm dbTerm = hpoIdToDbTermMap.get(tokens[4]) //term token
            String diseaseId = tokens[0] + ":" + tokens[1]
            diseaseId = diseaseId.trim()
            final DbDisease dbDisease = diseaseIdMap.get(diseaseId) //diseaseid
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

  /** Joining Disease and Gene with genes_to_diseases.txt
   *
   * #Format: entrez-gene-id<tab>entrez-gene-symbol<tab>DiseaseId
   *          7157                TP53                  HP:0002862
   */
  void joinDiseasesToGenesWithSql(){
    StopWatch stopWatch = new StopWatch()
    stopWatch.start()
    Set<String> geneIdNotFoundSet = [] as Set
    Set<String> diseaseIdNotFoundSet = [] as Set
    final Map<String, DbDisease> diseaseIdMap = domainUtilService.loadDbDiseases()
    final Map<Integer, DbGene> geneIdMap = domainUtilService.loadDbGenes()
    final File file = new ClassPathResource("genes_to_diseases.txt").file
    sqlUtilsService.sql.withBatch(500, INSERT_INTO_DB_GENE_DB_DISEASES) { BatchingPreparedStatementWrapper ps ->
      int index = 0;
      file.eachLine { String line ->
        index++
        String[] tokens = line.split('\t')
        if (tokens.size() == 3) {
          final DbGene dbGene = geneIdMap.get(tokens[0] as Integer) //term token
          final DbDisease dbDisease = diseaseIdMap.get(tokens[2]) //diseaseid
          if (dbGene == null) {
            geneIdNotFoundSet.add(tokens[0])
          } else if (dbDisease == null) {
            diseaseIdNotFoundSet.add(tokens[2]) // add diseaseid
          } else {
              ps.addBatch([
                dbGene.id as Object,
                dbDisease.id as Object,
              ])
            }
          } else {
            log.info("skipping line : ${line}")
        }
      }
    }

  }
}



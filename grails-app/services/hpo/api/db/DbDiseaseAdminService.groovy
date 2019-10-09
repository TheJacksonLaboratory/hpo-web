package hpo.api.db

import com.google.common.collect.Multimap
import groovy.sql.BatchingPreparedStatementWrapper
import hpo.api.db.utils.SqlUtilsService
import grails.gorm.transactions.Transactional
import hpo.api.disease.DbDisease
import hpo.api.gene.DbGene
import hpo.api.term.DbTerm
import hpo.api.util.HpoAssociationFactory
import org.apache.commons.lang.time.StopWatch
import hpo.api.db.utils.DomainUtilService
import org.monarchinitiative.phenol.formats.hpo.HpoAnnotation
import org.monarchinitiative.phenol.formats.hpo.HpoDisease
import org.monarchinitiative.phenol.io.assoc.HpoAssociationParser
import org.monarchinitiative.phenol.ontology.data.TermId

import java.sql.SQLException

@Transactional
class DbDiseaseAdminService {

  HpoAssociationParser hpoAssociation
  HpoAssociationFactory hpoAssociationFactory
  SqlUtilsService sqlUtilsService
  DomainUtilService domainUtilService
  // USE SQL TO INSERT
  final static String INSERT_INTO_DB_ANNOTATION = "INSERT INTO db_annotation(db_disease_id, db_term_id, onset, frequency) VALUES(?,?, ?, ?)"
  final static String INSERT_INTO_DB_GENE_DB_DISEASES = "INSERT INTO db_gene_db_diseases( db_gene_id, db_disease_id) VALUES(?,?)"

  void truncateDbDiseases() {
    sqlUtilsService.executeDelete("truncate table db_disease")
  }

  void truncateAnnotationTable() {
    sqlUtilsService.executeDelete("truncate table db_annotation")
  }
  void truncateDiseaseGeneJoinTable(){
    sqlUtilsService.executeDelete("truncate table db_gene_db_diseases")
  }

  void executeDiseaseSchemaLoad(){
    try{
      loadDiseases();
      createTermDiseaseAnnotationSql()
      joinDiseasesToGenesWithSql()
    }catch (Exception e){
      log.error(e.toString())
    }
  }

  void loadDiseases() throws SQLException {
    StopWatch stopWatch = new StopWatch()
    stopWatch.start()
    Map<TermId, HpoDisease> hpoDiseases = hpoAssociationFactory.getDiseaseMap()
      hpoDiseases.each{ diseaseId, disease ->
        try{
          new DbDisease(disease).save()
        }catch (SQLException e){
          throw e;
        }
      }

    log.info(" *** Loading Diseases ${hpoDiseases.size()} -  duration: ${stopWatch} time: ${new Date()} ] ***")
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
  void createTermDiseaseAnnotationSql() {
    log.info("** Joining Diseases and Terms via Annotations ***")
    StopWatch stopWatch = new StopWatch()
    stopWatch.start()
    Set<String> hpoIdWithPrefixNotFoundSet = [] as Set
    Set<String> diseaseIdNotFoundSet = [] as Set

    final Map<String, DbDisease> diseaseIdMap = domainUtilService.loadDbDiseases()
    final Map<String, DbTerm> hpoIdToDbTermMap = domainUtilService.loadHpoIdToDbTermMap()
    Map<TermId, HpoDisease> hpoDiseases = hpoAssociationFactory.getDiseaseMap()
    Multimap<TermId, TermId> termToDisease = hpoAssociationFactory.getTermToDisease()

    Integer count = 0;
    Integer lastTermId = null
    Integer lastDiseaseId = null
      sqlUtilsService.sql.withBatch(500, INSERT_INTO_DB_ANNOTATION ) { BatchingPreparedStatementWrapper ps ->
        int index = 0;
        for (Map.Entry<TermId, TermId> e : termToDisease.entries()) {
          index++;
          final DbTerm dbTerm = hpoIdToDbTermMap.get(e.getKey().toString())
          final DbDisease dbDisease = diseaseIdMap.get(e.getValue().toString())
          if (dbTerm == null) {
            hpoIdWithPrefixNotFoundSet.add(e.getKey().toString())
          } else if (dbDisease == null) {
            diseaseIdNotFoundSet.add(e.getValue().toString()) // add diseaseid
          } else {
            if (dbTerm.id == lastTermId && dbDisease.id == lastDiseaseId) {
              log.info("DUPLICATE LINE: ${lastTermId} - ${lastDiseaseId}")
            } else {
              count ++
              HpoDisease hpoDisease = hpoDiseases.get(e.getValue())
              HpoAnnotation annotation = findAnnotation(hpoDisease, e.getKey())
              if(annotation != null){
                ps.addBatch([
                  dbDisease.id as Object,
                  dbTerm.id as Object,
                  formatOnsetString(annotation.onset.toString()),
                  formatFrequencyString(annotation.frequencyString, hpoIdToDbTermMap)
                ])
              } else {
                ps.addBatch([
                  dbDisease.id as Object,
                  dbTerm.id as Object,
                  "UNKNOWN",
                  "UNKNOWN"
                ])
              }

              lastDiseaseId = dbDisease.id
              lastTermId = dbTerm.id
            }
          }
        }
      }
    log.info("hpoIdWithPrefixNotFoundSet.size() : ${hpoIdWithPrefixNotFoundSet.size()} ${new Date()}")
    log.info("entrezIdNotFoundSet.size() : ${diseaseIdNotFoundSet.size()} ${new Date()}")
    log.info("**** Joined Disease And Terms - ${count} - duration: ${stopWatch} time: ${new Date()} ****")
  }

  String formatOnsetString(String onset){
    if(onset == ""){
      return "-"
    }
    return onset
  }

  String formatFrequencyString(String frequency, Map<String, DbTerm> termMap){
    if(frequency.startsWith("HP:")){
      return termMap.get(frequency).getName()
    } else if(frequency == "n/a" || frequency == "") {
      return "UNKNOWN"
    }
    return frequency
  }

  HpoAnnotation findAnnotation(HpoDisease hpoDisease, TermId termId){
    return  hpoDisease.getPhenotypicAbnormalities().find { it.getTermId().toString() == termId.toString()}
  }

  /** Joining Disease and Gene with genes_to_diseases.txt
   *
   * #Format: entrez-gene-id<tab>entrez-gene-symbol<tab>DiseaseId
   *          7157                TP53                  HP:0002862
   */
  void joinDiseasesToGenesWithSql(){
    log.info("*** Joining Diseases with Genes ***")
    StopWatch stopWatch = new StopWatch()
    stopWatch.start()
    Set<String> geneIdNotFoundSet = [] as Set
    Set<String> diseaseIdNotFoundSet = [] as Set
    final Map<String, DbDisease> diseaseIdMap = domainUtilService.loadDbDiseases()
    final Map<Integer, DbGene> geneIdMap = domainUtilService.loadDbGenes()
    Multimap<TermId, TermId> diseaseToGeneMap = hpoAssociation.getDiseaseToGeneIdMap();
    Integer count = 0;
    sqlUtilsService.sql.withBatch(500, INSERT_INTO_DB_GENE_DB_DISEASES) { BatchingPreparedStatementWrapper ps ->
      for (Map.Entry<TermId, TermId> e : diseaseToGeneMap.entries()) {
        if(e.getValue().getId() != "-") {
          Integer gene = Integer.parseInt(e.getValue().getId());
          String disease = e.getKey().toString()

          final DbDisease dbDisease = diseaseIdMap.get(disease)
          final DbGene dbGene = geneIdMap.get(gene)
          if (dbGene == null) {
            geneIdNotFoundSet.add(gene.toString())
          } else if (dbDisease == null) {
            diseaseIdNotFoundSet.add(disease)
          } else {
            count++;
            ps.addBatch([
              dbGene.id as Object,
              dbDisease.id as Object

            ])
          }
        }
      }
      log.info("Disease Gene Map Size: ${diseaseToGeneMap.size().toString()} ");
      log.info("*** Disease Gene Map inserted: ${count} ****");
    }
  }
}



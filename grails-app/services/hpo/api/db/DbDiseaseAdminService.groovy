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
  final static String INSERT_INTO_DB_TERM_DB_DISEASES = "INSERT INTO db_term_db_diseases( db_disease_id, db_term_id) VALUES(?,?)"
  final static String INSERT_INTO_DB_GENE_DB_DISEASES = "INSERT INTO db_gene_db_diseases( db_gene_id, db_disease_id) VALUES(?,?)"

  void truncateDbDiseases() {
    sqlUtilsService.executeDelete("truncate table db_disease")
  }

  void truncateDiseaseTermJoinTable() {
    sqlUtilsService.executeDelete("truncate table db_term_db_diseases")
  }
  void truncateDiseaseGeneJoinTable(){
    sqlUtilsService.executeDelete("truncate table db_gene_db_diseases")
  }

  void loadDiseases() throws SQLException {
    StopWatch stopWatch = new StopWatch()
    stopWatch.start()
    Map<TermId, HpoDisease> hpoDiseases = hpoAssociationFactory.getDiseaseMap();
      hpoDiseases.each{ diseaseId, disease ->
        try{
          new DbDisease(disease).save()
        }catch (SQLException e){
          throw e;
        }
      }

    log.info("Loading Diseases -  duration: ${stopWatch} time: ${new Date()} ]")
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
    Multimap<TermId, TermId> termToDisease = hpoAssociationFactory.getTermToDisease()

    Integer lastTermId = null
    Integer lastDiseaseId = null
      sqlUtilsService.sql.withBatch(500,INSERT_INTO_DB_TERM_DB_DISEASES ) { BatchingPreparedStatementWrapper ps ->
        int index = 0;
        for (Map.Entry<TermId, TermId> e : termToDisease.entries()) {
          index++;
          final DbTerm dbTerm = hpoIdToDbTermMap.get(e.getKey().getIdWithPrefix())
          final DbDisease dbDisease = diseaseIdMap.get(e.getValue().getIdWithPrefix())
          if (dbTerm == null) {
            hpoIdWithPrefixNotFoundSet.add(e.getKey().getIdWithPrefix())
          } else if (dbDisease == null) {
            diseaseIdNotFoundSet.add(e.getValue().getIdWithPrefix()) // add diseaseid
          } else {
            if (dbTerm.id == lastTermId && dbDisease.id == lastDiseaseId) {
              log.info("DUPLICATE LINE: ${lastTermId} - ${lastDiseaseId}")
            } else {
              ps.addBatch([
                dbDisease.id as Object,
                dbTerm.id as Object,
              ])
              lastDiseaseId = dbDisease.id
              lastTermId = dbTerm.id
            }
          }
        }
      }
    log.info("hpoIdWithPrefixNotFoundSet.size() : ${hpoIdWithPrefixNotFoundSet.size()} ${new Date()}")
    log.info("${hpoIdWithPrefixNotFoundSet}")
    log.info("entrezIdNotFoundSet.size() : ${diseaseIdNotFoundSet.size()} ${new Date()}")
    log.info("${diseaseIdNotFoundSet}")
    log.info("Joined Disease And Terms - duration: ${stopWatch} time: ${new Date()}")
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
    Multimap<TermId, TermId> diseaseToGeneMap = hpoAssociation.getDiseaseToGeneIdMap();

    sqlUtilsService.sql.withBatch(500, INSERT_INTO_DB_GENE_DB_DISEASES) { BatchingPreparedStatementWrapper ps ->
      for (Map.Entry<TermId, TermId> e : diseaseToGeneMap.entries()) {
        if(e.getValue().getId() != "-") {
          Integer gene = Integer.parseInt(e.getValue().getId());
          String disease = e.getKey().getIdWithPrefix()

          final DbDisease dbDisease = diseaseIdMap.get(disease)
          final DbGene dbGene = geneIdMap.get(gene)
          if (dbGene == null) {
            geneIdNotFoundSet.add(gene.toString())
          } else if (dbDisease == null) {
            diseaseIdNotFoundSet.add(disease)
          } else {
            ps.addBatch([
              dbGene.id as Object,
              dbDisease.id as Object

            ])
          }
        }
      }
    }
  }
}



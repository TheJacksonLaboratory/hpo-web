package hpo.api.db

import groovy.sql.BatchingPreparedStatementWrapper
import hpo.api.db.utils.SqlUtilsService
import grails.gorm.transactions.Transactional
import hpo.api.disease.DbDisease
import hpo.api.gene.DbGene
import hpo.api.term.DbTerm
import hpo.api.util.HpoAssociationFactory
import hpo.api.db.utils.DomainUtilService
import org.apache.commons.lang3.time.StopWatch
import org.monarchinitiative.phenol.annotations.formats.AnnotationReference
import org.monarchinitiative.phenol.annotations.formats.hpo.GeneToAssociation
import org.monarchinitiative.phenol.annotations.formats.hpo.HpoOnset
import org.monarchinitiative.phenol.annotations.io.hpo.HpoAnnotationLine
import org.monarchinitiative.phenol.annotations.io.hpo.HpoaDiseaseData
import org.monarchinitiative.phenol.ontology.data.TermId

import java.sql.SQLException
import java.util.stream.Collectors

@Transactional
class DbDiseaseAdminService {

  HpoAssociationFactory hpoAssociationFactory
  SqlUtilsService sqlUtilsService
  DomainUtilService domainUtilService

  final static String INSERT_INTO_DB_ANNOTATION = "INSERT INTO db_annotation(db_disease_id, db_term_id, onset, frequency, sources) VALUES(?,?, ?, ?, ?)"
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
      loadDiseases()
      joinTermToDisease()
      joinDiseasesToGenesWithSql()
    }catch (Exception e){
      log.error(e.getCause().toString())
      System.exit(2)
    }
  }

  void loadDiseases() throws SQLException {
    StopWatch stopWatch = new StopWatch()
    stopWatch.start()
    int diseaseCount = 0
    hpoAssociationFactory.hpoDiseases().each { disease ->
        try{
          String[] idPieces = disease.id().toString().split(":")
          new DbDisease(idPieces[0], idPieces[1], disease.name(), disease.id().toString()).save(flush: true)
          diseaseCount++
        }catch (SQLException e){
          throw e
        }
      }
    log.info(" *** Loading Diseases ${diseaseCount} -  duration: ${stopWatch} time: ${new Date()} ] ***")
  }

  void joinTermToDisease() {
    log.info("** Joining Terms to Diseases ***")

    StopWatch stopWatch = new StopWatch()
    stopWatch.start()

    final Map<String, DbDisease> diseaseIdMap = domainUtilService.loadDbDiseases()
    final Map<String, DbTerm> hpoIdToDbTermMap = domainUtilService.loadHpoIdToDbTermMap()
    Integer count = 0;
    for (HpoaDiseaseData disease: hpoAssociationFactory.hpoDiseases()) {
        final DbDisease dbDisease = diseaseIdMap.get(disease.id().toString())
        sqlUtilsService.sql.withBatch(disease.annotations().size(), INSERT_INTO_DB_ANNOTATION ) { BatchingPreparedStatementWrapper ps ->
        for (HpoAnnotationLine hpoAnnotationLine: (disease.annotations() as List<HpoAnnotationLine>)) {
          final TermId hpoId = hpoAnnotationLine.id()
          final DbTerm dbTerm = hpoIdToDbTermMap.get(hpoId.toString())
          count++

          ps.addBatch(
            dbDisease.id as Object,
            dbTerm.id as Object,
            hpoAnnotationLine.onset().map(HpoOnset::id).map(TermId::toString).orElse(null),
            formatFrequencyString(hpoAnnotationLine.frequency(), hpoIdToDbTermMap),
            formatSources(hpoAnnotationLine.annotationReferences())
          )
        }
        ps.executeBatch()
      }
    }
    log.info("**** Finished joining Disease And Terms - ${count} - duration: ${stopWatch} time: ${new Date()} ****")
  }

  static String formatSources(List<AnnotationReference> sources){
    final String joinedSources = sources.stream().map(AnnotationReference::id).map(TermId::toString).collect(Collectors.joining(','))
    return  joinedSources.length() > 1 ? joinedSources : "UNKNOWN"
  }

  static String formatFrequencyString(String frequency, Map<String, DbTerm> termMap){
    if(frequency.startsWith("HP:")){
      return termMap.get(frequency).getName()
    } else if(frequency == "n/a" || frequency == "") {
      return ""
    }
    return frequency
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
    Integer count = 0;
    sqlUtilsService.sql.withBatch(500, INSERT_INTO_DB_GENE_DB_DISEASES) { BatchingPreparedStatementWrapper ps ->
      for (Map.Entry<TermId, Collection<GeneToAssociation>> e : hpoAssociationFactory.hpoAssociationData().associations().diseaseIdToGeneAssociations().entrySet()) {
        def geneList = []
        for (GeneToAssociation x : e.getValue()){
            int gene = Integer.parseInt(x.geneIdentifier().id().id)
            final DbDisease dbDisease = diseaseIdMap.get(e.getKey().toString())
            final DbGene dbGene = geneIdMap.get(gene)
            if (dbGene == null) {
              geneIdNotFoundSet.add(gene.toString())
            } else if (dbDisease == null) {
              diseaseIdNotFoundSet.add(e.getKey().toString())
            } else {
              count++
              if(!geneList.contains(gene)){
                geneList.add(gene)
                ps.addBatch([
                  dbGene.id as Object,
                  dbDisease.id as Object
                ])
              }
            }
        }
      }
      log.info("*** Finish joining Disease To Gene inserted: ${count} ****");
    }
  }
}



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
import org.monarchinitiative.phenol.annotations.base.temporal.Age
import org.monarchinitiative.phenol.annotations.formats.AnnotationReference
import org.monarchinitiative.phenol.annotations.formats.hpo.GeneToAssociation
import org.monarchinitiative.phenol.annotations.formats.hpo.HpoDisease
import org.monarchinitiative.phenol.annotations.formats.hpo.HpoDiseaseAnnotation
import org.monarchinitiative.phenol.annotations.formats.hpo.HpoOnset
import org.monarchinitiative.phenol.ontology.data.TermId

import java.sql.SQLException
import java.util.stream.Collectors

@Transactional
class DbDiseaseAdminService {

  HpoAssociationFactory hpoAssociationFactory
  SqlUtilsService sqlUtilsService
  DomainUtilService domainUtilService

  final static String INSERT_INTO_DB_ANNOTATION = "INSERT INTO db_annotation(db_disease_id, db_term_id, onset, frequency, sample_size, sources) VALUES(?,?, ?, ?, ?, ?)"
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
      log.error(e.toString())
      System.exit(2)
    }
  }

  void loadDiseases() throws SQLException {
    StopWatch stopWatch = new StopWatch()
    stopWatch.start()
    int diseaseCount = 0
    hpoAssociationFactory.hpoDiseases().hpoDiseases().each { disease ->
        try{
          new DbDisease(disease).save()
          diseaseCount++
        }catch (SQLException e){
          throw e;
        }
      }
    log.info(" *** Loading Diseases ${diseaseCount} -  duration: ${stopWatch} time: ${new Date()} ] ***")
  }

  void joinTermToDisease() {
    log.info("** Joining Terms to Diseases ***")

    StopWatch stopWatch = new StopWatch()
    stopWatch.start()
    Set<String> hpoIdWithPrefixNotFoundSet = [] as Set
    Set<String> diseaseIdNotFoundSet = [] as Set

    final Map<String, DbDisease> diseaseIdMap = domainUtilService.loadDbDiseases()
    final Map<String, DbTerm> hpoIdToDbTermMap = domainUtilService.loadHpoIdToDbTermMap()
    Map<TermId, HpoDisease> hpoDiseases = hpoAssociationFactory.hpoDiseases().diseaseById()
    Map<TermId, HashSet<TermId>> termToDisease = new HashMap<TermId, HashSet<TermId>>()

    for (HpoDisease disease: hpoDiseases.values()) {
      for (HpoDiseaseAnnotation hpoDiseaseAnnotation: disease.annotations()) {
        TermId hpoId = hpoDiseaseAnnotation.id()
        termToDisease.computeIfAbsent(hpoId, k -> new HashSet<>()).add(disease.id())
      }
    }

    Integer count = 0;
    sqlUtilsService.sql.withBatch(500, INSERT_INTO_DB_ANNOTATION ) { BatchingPreparedStatementWrapper ps ->
         termToDisease.each((k,vSet) -> {
           vSet.each((v) -> {
             final DbTerm dbTerm = hpoIdToDbTermMap.get(k.toString())
             final DbDisease dbDisease = diseaseIdMap.get(v.toString())
             if (dbTerm == null) {
               hpoIdWithPrefixNotFoundSet.add(k.toString())
             } else if (dbDisease == null) {
               diseaseIdNotFoundSet.add(v.toString())
             } else {
                 count++
                 HpoDisease hpoDisease = hpoDiseases.get(v)
                 Optional<HpoDiseaseAnnotation> annotation = hpoDisease.getAnnotation(k)
                 if(annotation.isPresent()) {
                   Age ageOfOnset = annotation.get().latestOnset().orElse(null)
                   HpoOnset onset = null
                   if (ageOfOnset != null) {
                     onset = HpoOnset.fromAge(ageOfOnset).orElse(null)
                   }
                   ps.addBatch([
                     dbDisease.id as Object,
                     dbTerm.id as Object,
                     onset.toString(),
                     annotation.get().ratio().frequency(),
                     annotation.get().ratio().denominator(),
                     formatSources(annotation.get().references())
                   ])
                 }
               }
           })
         })
          ps.executeBatch()
        }
        log.info("hpoIdWithPrefixNotFoundSet.size() : ${hpoIdWithPrefixNotFoundSet.size()} ${new Date()}")
        log.info("entrezIdNotFoundSet.size() : ${diseaseIdNotFoundSet.size()} ${new Date()}")
        log.info("**** Joined Disease And Terms - ${count} - duration: ${stopWatch} time: ${new Date()} ****")
  }

  static String formatSources(List<AnnotationReference> sources){
    final String joinedSources = sources.stream().map(AnnotationReference::id).map(TermId::toString).collect(Collectors.joining(','))
    return  joinedSources.length() > 1 ? joinedSources : "UNKNOWN"
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
      log.info("*** Disease To Gene inserted: ${count} ****");
    }
  }
}



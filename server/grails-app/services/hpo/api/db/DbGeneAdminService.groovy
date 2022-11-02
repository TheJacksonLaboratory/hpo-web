package hpo.api.db

import grails.gorm.transactions.Transactional
import groovy.sql.BatchingPreparedStatementWrapper
import groovy.sql.Sql
import hpo.api.db.utils.SqlUtilsService
import hpo.api.gene.DbGene
import hpo.api.term.DbTerm
import hpo.api.util.HpoAssociationFactory
import org.apache.commons.lang3.time.StopWatch
import org.hibernate.Session
import hpo.api.db.utils.DomainUtilService
import org.monarchinitiative.phenol.annotations.formats.GeneIdentifiers

@Transactional
class DbGeneAdminService {

  final static String INSERT_INTO_DB_TERM_DB_GENES = "INSERT INTO db_term_db_genes (db_gene_id, db_term_id) VALUES(?,?)"

  HpoAssociationFactory hpoAssociationFactory
  SqlUtilsService sqlUtilsService
  DomainUtilService domainUtilService

  void truncateDbGenes() {
    sqlUtilsService.executeDelete("truncate table db_gene")
  }

  void truncateGeneTermJoinTable() {
    sqlUtilsService.executeDelete("truncate table db_term_db_genes")
  }

  void executeGeneSchemaLoad() throws Exception {
    try{
      loadGenes();
      joinGenesAndTermsWithSql()
    }catch (Exception e){
      log.error(e.toString())
    }
  }

  void loadGenes() {
    log.info("*** Loading Genes ***")
    StopWatch stopWatch = new StopWatch()
    stopWatch.start()
    int geneCount = 0
    GeneIdentifiers geneIdentifiers = hpoAssociationFactory.hpoAssociationData().getGeneIdentifiers()
    try{
      DbGene.withSession { Session session ->
        hpoAssociationFactory.hpoAssociationData().associations().geneIdToDiseaseIds().keySet().each { it ->
              def gene = geneIdentifiers.geneIdById(it)
              if(gene.isPresent()){
                gene = gene.get()
                DbGene dbGene = new DbGene(geneId: gene.id().id.toInteger(), geneSymbol: gene.symbol())
                dbGene.save()
                geneCount++
              }
            }
        session.flush()
        session.clear()
      }
    }catch (Exception ex){
      log.error(ex.toString())
    }
    log.info("*** Loading Genes Finished (${geneCount}) - duration: ${stopWatch} time: ${new Date()} ***")
  }

  void joinGenesAndTermsWithSql() {
    log.info("*** Joining Genes with Terms ***")
    StopWatch stopWatch = new StopWatch()
    stopWatch.start()
    Set<String> hpoIdWithPrefixNotFoundSet = [] as Set<String>
    Set<Integer> entrezIdNotFoundSet = [] as Set<Integer>

    final Map<Integer, DbGene> entrezIdToDbGeneMap = domainUtilService.loadDbGenes()
    final Map<String, DbTerm> hpoIdToDbTermMap = domainUtilService.loadHpoIdToDbTermMap()

    try{
      DbGene.withSession { Session session ->
        final Sql sql = sqlUtilsService.getSql()
        sql.withBatch(500, INSERT_INTO_DB_TERM_DB_GENES) { BatchingPreparedStatementWrapper ps ->
          hpoAssociationFactory.hpoAssociationData().hpoToGeneAnnotations().asList().each {  hpoGeneAnnotation ->
            final DbTerm dbTerm = hpoIdToDbTermMap.get(hpoGeneAnnotation.id().toString())
            final DbGene dbGene = entrezIdToDbGeneMap.get(hpoGeneAnnotation.getEntrezGeneId())
            if (dbTerm == null) {
              hpoIdWithPrefixNotFoundSet.add(hpoGeneAnnotation.id().toString())
            } else if (dbGene == null) {
              entrezIdNotFoundSet.add(hpoGeneAnnotation.getEntrezGeneId())
            } else {
              ps.addBatch([
                dbGene.id as Object,
                dbTerm.id as Object,
              ])
            }
          }
        }
      }
    }catch (Exception ex){
      log.error(ex.toString())
    }

    log.info("hpoIdWithPrefixNotFoundSet.size() : ${hpoIdWithPrefixNotFoundSet.size()} Date: ${new Date()}")
    log.info("entrezIdNotFoundSet.size() : ${entrezIdNotFoundSet.size()} ${new Date()}")
    log.info("*** Joined Genes And Terms - duration: ${stopWatch} time: ${new Date()} ***")
  }
}



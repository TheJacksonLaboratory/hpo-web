package hpo.api.db

import grails.compiler.GrailsCompileStatic
import grails.gorm.transactions.Transactional
import groovy.sql.BatchingPreparedStatementWrapper
import groovy.sql.Sql
import hpo.api.db.utils.SqlUtilsService
import hpo.api.gene.DbGene
import hpo.api.term.DbTerm
import org.apache.commons.lang.time.StopWatch
import org.hibernate.Session
import hpo.api.db.utils.DomainUtilService
import org.monarchinitiative.phenol.annotations.assoc.HpoAssociationParser
import org.monarchinitiative.phenol.annotations.formats.hpo.HpoGeneAnnotation
import org.monarchinitiative.phenol.ontology.data.TermId

@Transactional
@GrailsCompileStatic
class DbGeneAdminService {

  final static String INSERT_INTO_DB_TERM_DB_GENES = "INSERT INTO db_term_db_genes (db_gene_id, db_term_id) VALUES(?,?)"

  HpoAssociationParser hpoAssociation
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
      loadEntrezGenes();
      joinGenesAndTermsWithSql()
    }catch (Exception e){
      log.error(e.toString())
    }
  }

  void loadEntrezGenes() {
    log.info("*** Loading Genes ***")
    StopWatch stopWatch = new StopWatch()
    stopWatch.start()
    Map<TermId, String> geneMap = hpoAssociation.getGeneIdToSymbolMap();
    try{
      DbGene.withSession { Session session ->
        geneMap.each { gene ->
              DbGene dbGene = new DbGene(entrezGeneId: gene.getKey().getId().toInteger(), entrezGeneSymbol: gene.getValue())
              dbGene.save()
            }
        session.flush()
        session.clear()
      }
    }catch (Exception ex){
      log.error(ex.toString())
    }
    log.info("*** Loading Genes Finished (${geneMap.size()}) - duration: ${stopWatch} time: ${new Date()} ***")
  }

  void joinGenesAndTermsWithSql() {
    log.info("*** Joining Genes with Terms ***")
    StopWatch stopWatch = new StopWatch()
    stopWatch.start()
    Set<String> hpoIdWithPrefixNotFoundSet = [] as Set<String>
    Set<Integer> entrezIdNotFoundSet = [] as Set<Integer>

    final Map<Integer, DbGene> entrezIdToDbGeneMap = domainUtilService.loadDbGenes()
    final Map<String, DbTerm> hpoIdToDbTermMap = domainUtilService.loadHpoIdToDbTermMap()
    List<HpoGeneAnnotation> phenotypeToGene =  hpoAssociation.getPhenotypeToGene()

    try{
      DbGene.withSession { Session session ->
        final Sql sql = sqlUtilsService.getSql()
        sql.withBatch(500, INSERT_INTO_DB_TERM_DB_GENES) { BatchingPreparedStatementWrapper ps ->
          phenotypeToGene.each { HpoGeneAnnotation gene ->
            final DbTerm dbTerm = hpoIdToDbTermMap.get(gene.getTermId().toString())
            final DbGene dbGene = entrezIdToDbGeneMap.get(gene.getEntrezGeneId())
            if (dbTerm == null) {
              hpoIdWithPrefixNotFoundSet.add(gene.getTermId().toString())
            } else if (dbGene == null) {
              entrezIdNotFoundSet.add(gene.getEntrezGeneId())
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



package hpo.api.db

import grails.gorm.transactions.Transactional
import groovy.sql.BatchingPreparedStatementWrapper
import groovy.sql.Sql
import hpo.api.gene.DbGene
import hpo.api.term.DbTerm
import org.apache.commons.lang.time.StopWatch
import org.grails.io.support.ClassPathResource
import org.hibernate.Session

@Transactional
class DbGeneAdminService {

  Sql groovySql

  void truncateDbGenes() {
    StopWatch stopWatch = new StopWatch()
    stopWatch.start()
    DbGene.executeUpdate("delete from DbGene")
    println("duration: ${stopWatch} time: ${new Date()}")
  }

  void truncateGeneTermJoinTable(){
    int rowCount = groovySql.executeUpdate("delete from db_term_db_genes")
    print("${rowCount} deleted from db_term_db_genes")
  }

  void loadEntrezGenes() {
    StopWatch stopWatch = new StopWatch()
    stopWatch.start()
    Map<Integer, String> entrezIdToSymbolMap = [:]
    final File file = new ClassPathResource("ALL_SOURCES_ALL_FREQUENCIES_genes_to_phenotype.txt").file
    DbGene.withSession { Session session ->
      file.eachLine{String line ->
        String[] tokens = line.split('\t')
        if (tokens.size() == 4) {
          int entrezGeneId = Integer.valueOf(tokens[0])
          String entrezGeneSymbol = tokens[1]
          if(!entrezIdToSymbolMap.get(entrezGeneId)){
            entrezIdToSymbolMap.put(entrezGeneId, entrezGeneSymbol)
            DbGene dbGene = new DbGene(entrezGeneId: entrezGeneId, entrezGeneSymbol: entrezGeneSymbol)
            dbGene.save(flush:true)
          }
        }
        else{
          log.info("skipping line : ${line}")
        }
      }
      session.flush()
      session.clear()
    }

    println("[ \n Loading Genes - file ${file.name} \n duration: ${stopWatch} time: ${new Date()}")
  }

  private static Map<Integer, DbGene> loadGeneMap() {
    Map<Integer, DbGene> mapToReturn = [:]
    StopWatch stopWatch = new StopWatch()
    stopWatch.start()
    DbGene.list().each { DbGene dbGene ->
      mapToReturn.put(dbGene.entrezGeneId, dbGene)
    }
    mapToReturn
  }

  /**
   * @return a map with the keys the hpoIds (HP:0000001) and the value being the corresponding DbTerm that represents that hpoId
   */
  private static Map<String, DbTerm> loadHpoIdToDbTermMap() {
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
  void joinGenesAndTermsWithSql() {
    StopWatch stopWatch = new StopWatch()
    stopWatch.start()
    Set<String> hpoIdWithPrefixNotFoundSet = [] as Set
    Set<Integer> entrezIdNotFoundSet = [] as Set
    final Map<Integer, DbGene> entrezIdToDbGeneMap = loadGeneMap()
    final Map<String, DbTerm> hpoIdToDbTermMap = loadHpoIdToDbTermMap()
    final File file = new ClassPathResource("ALL_SOURCES_ALL_FREQUENCIES_genes_to_phenotype.txt").file
    groovySql.withTransaction {
      groovySql.withBatch(500, "INSERT db_term_db_genes VALUES(?,?)") { BatchingPreparedStatementWrapper ps ->
        int index = 0;
        file.eachLine { String line ->
          index++
          String[] tokens = line.split('\t')
          if (tokens.size() == 4) {
            final DbTerm dbTerm = hpoIdToDbTermMap.get(tokens[3])
            final DbGene dbGene = entrezIdToDbGeneMap.get(Integer.valueOf(tokens[0]))
            if (dbTerm == null) {
              hpoIdWithPrefixNotFoundSet.add(tokens[3])
            } else if (dbGene == null) {
              entrezIdNotFoundSet.add(Integer.valueOf(tokens[0]))
            } else {
              ps.addBatch([
                dbGene.id as Object,
                dbTerm.id as Object,
              ])
            }
          } else {
            log.info("skipping line : ${line}")
          }
        }
      }
    }
    log.info("hpoIdWithPrefixNotFoundSet.size() : ${hpoIdWithPrefixNotFoundSet.size()} ${new Date()}")
    log.info("${hpoIdWithPrefixNotFoundSet}")
    log.info("entrezIdNotFoundSet.size() : ${entrezIdNotFoundSet.size()} ${new Date()}")
    log.info("${entrezIdNotFoundSet}")
    println("[ \n Joined Genes And Terms - file ${file.name} \n  duration: ${stopWatch} \n time: ${new Date()} \n ]")
  }
}



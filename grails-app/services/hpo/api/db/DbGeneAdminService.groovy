package hpo.api.db

import grails.compiler.GrailsCompileStatic
import grails.gorm.transactions.Transactional
import groovy.sql.BatchingPreparedStatementWrapper
import groovy.sql.Sql
import hpo.api.gene.DbGene
import hpo.api.term.DbTerm
import org.apache.commons.lang.time.StopWatch
import org.grails.io.support.ClassPathResource

@Transactional
@GrailsCompileStatic
class DbGeneAdminService {

  Sql groovySql

  void deleteDbGenes() {
    DbGene.executeUpdate("delete from DbGene")
    println("duration: ${stopWatch} time: ${new Date()}")
  }

  void deleteDbGeneDbTermJoinTable(){
    int rowCount = groovySql.executeUpdate("delete from db_term_db_genes")
    print("${rowCount} deleted from db_term_db_genes")
  }

  Map<Integer, String> getEntrezIdToSymbolMap() {
    StopWatch stopWatch = new StopWatch()
    stopWatch.start()
    Map<Integer, String> entrezIdToSymbolMap = [:]
    final File file = new ClassPathResource("ALL_SOURCES_ALL_FREQUENCIES_genes_to_phenotype.txt").file
    file.eachLine{String line ->
      String[] tokens = line.split('\t')
      if (tokens.size() == 4) {
        int entrezGeneId = Integer.valueOf(tokens[0])
        String geneSymbol = tokens[1]
        entrezIdToSymbolMap.put(entrezGeneId, geneSymbol)
      }
      else{
        log.info("skipping line : ${line}")
      }
    }
    println("read file ${file.name} duration: ${stopWatch} time: ${new Date()}")
    entrezIdToSymbolMap
  }

  Map<Integer, DbGene> saveGenes(Map<Integer, String> entrezIdToSymbolMap) {
    Map<Integer, DbGene> mapToReturn = [:]
    StopWatch stopWatch = new StopWatch()
    stopWatch.start()
    entrezIdToSymbolMap.each { Integer entrezId, String geneSymbol ->
      DbGene dbGene = new DbGene(entrezId: entrezId, geneSymbol: geneSymbol)
      dbGene.save()
      mapToReturn.put(entrezId, dbGene)
    }
    println("saveGenes duration: ${stopWatch} time: ${new Date()}")
    mapToReturn
  }

  Map<Integer, DbGene> loadGeneMap() {
    Map<Integer, DbGene> mapToReturn = [:]
    StopWatch stopWatch = new StopWatch()
    stopWatch.start()
    DbGene.list().each { DbGene dbGene ->
      mapToReturn.put(dbGene.entrezId, dbGene)
    }
    println("loadGeneMap duration: ${stopWatch} time: ${new Date()}")
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
    println("joinGenesAndTermsWithSql file ${file.name} duration: ${stopWatch} time: ${new Date()}")
  }
}



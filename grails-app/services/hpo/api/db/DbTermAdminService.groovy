package hpo.api.db

import com.github.phenomics.ontolib.formats.hpo.HpoOntology
import com.github.phenomics.ontolib.ontology.algo.OntologyTerms
import com.github.phenomics.ontolib.ontology.data.Term
import com.github.phenomics.ontolib.ontology.data.TermId
import grails.gorm.transactions.Transactional
import groovy.sql.BatchingPreparedStatementWrapper
import hpo.api.db.utils.SqlUtilsService
import hpo.api.term.DbTerm
import hpo.api.term.DbTermPath
import hpo.api.util.AncestorPathsBuilder
import org.apache.commons.lang.time.StopWatch
import org.hibernate.Session

/**
 * Created by djd on 10/22/17.
 */
@Transactional
class DbTermAdminService {


  HpoOntology hpoOntology
  SqlUtilsService sqlUtilsService

  void deleteDbTerms() {
    StopWatch stopWatch = new StopWatch()
    stopWatch.start()
    int dbTermPathsDeleted = DbTermPath.executeUpdate("delete from DbTermPath")
    log.info("${dbTermPathsDeleted} rows deleted from ${DbTermPath.name} duration: ${stopWatch} time: ${new Date()}")
    int dbTermsleted = DbTerm.executeUpdate("delete from DbTerm")
    log.info("${dbTermsleted} rows deleted from ${DbTerm.name} duration: ${stopWatch} time: ${new Date()}")
  }


  void refreshDbTerms(List<Term> terms = hpoOntology.termMap.values()) {
    deleteDbTerms()
    StopWatch stopWatch = new StopWatch()
    stopWatch.start()
    Set<String> ontologyIdSet = [] as Set<String>
    Map<Term, DbTerm> termToDbTermMap = [:]
    for (Term term in terms) {
      if (ontologyIdSet.contains(term.id.idWithPrefix)) {
        // do nothinbg
      } else {
        ontologyIdSet.add(term.id.idWithPrefix)
        DbTerm dbTerm = new DbTerm(term as Term)
        dbTerm.numberOfChildren = OntologyTerms.childrenOf(term.id, hpoOntology).size()
        dbTerm.save()
        termToDbTermMap.put(term, dbTerm)
      }
    }
    DbTerm.withSession { Session session -> session.flush()}
    log.info("flushed DbTerms duration: ${stopWatch} time: ${new Date()}")
    saveAncestorPaths(termToDbTermMap)
  }

  private void saveAncestorPaths(Map<Term, DbTerm> termToDbTermMap) {
    StopWatch stopWatch = new StopWatch()
    stopWatch.start()
    AncestorPathsBuilder ancestorPathsBuilder = new AncestorPathsBuilder(hpoOntology)
    sqlUtilsService.sql.withBatch(500, "INSERT INTO db_term_path (db_term_id, path_names, path_ids ,path_length, version) VALUES(?,?,?,?,0)") { BatchingPreparedStatementWrapper ps ->
      termToDbTermMap.each { Term term, DbTerm dbTerm ->
        List<List<Term>> ancestorPaths = ancestorPathsBuilder.getAncestorPaths(term)
        for (List<Term> ancestorPath in ancestorPaths) {
          ps.addBatch([
            dbTerm.id,
            ancestorPath.collect { Term ancestorTerm -> ancestorTerm.name.toLowerCase() }.join(' > '),
            ancestorPath.collect { Term ancestorTerm -> ancestorTerm.id.idWithPrefix }.toString(),
            ancestorPath.size(),
          ])
        }
      }
    }
    log.info("saveAncestorPaths duration: ${stopWatch} time: ${new Date()}")
  }

  /**
   * Recursive method to walk up the hierarchy to the root
   * @param term
   * @return a List of 1 or List<Term>, so return a list of each unique path to the term
   */
  private List<List<Term>> getAncestorPaths(Term term) {
    final List<List<Term>> paths = []
    Set<TermId> parentTermIds = hpoOntology.getParentTermIds(term.id)
    if (parentTermIds.isEmpty()) {
      paths.add([term])  // no parent so add a list with current term
    } else {
      for (TermId parentId in parentTermIds) {
        Term parent = hpoOntology.getTermMap().get(parentId)
        for (List<Term> ancestorPath in getAncestorPaths(parent)) {
          ancestorPath.add(term)
          paths.add(ancestorPath)
        }
      }
    }
    paths
  }
}

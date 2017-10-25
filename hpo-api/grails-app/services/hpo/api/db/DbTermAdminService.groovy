package hpo.api.db

import com.github.phenomics.ontolib.formats.hpo.HpoOntology
import com.github.phenomics.ontolib.ontology.data.Term
import com.github.phenomics.ontolib.ontology.data.TermId
import grails.gorm.transactions.Transactional
import grails.plugins.executor.PersistenceContextExecutorWrapper
import hpo.api.term.DbTerm
import hpo.api.term.DbTermPath
import hpo.api.util.AncestorPathsBuilder
import org.apache.commons.lang.time.StopWatch

import java.util.concurrent.ExecutorService

/**
 * Created by djd on 10/22/17.
 */
@Transactional
class DbTermAdminService {

    HpoOntology hpoOntology
    PersistenceContextExecutorWrapper executorService

    void deleteDbTerms() {
        StopWatch stopWatch = new StopWatch()
        stopWatch.start()
        DbTermPath.executeUpdate("delete from DbTermPath")
        DbTerm.executeUpdate("delete from DbTerm")
        println("duration: ${stopWatch} time: ${new Date()}")
    }

    void refreshDbTerms(List<Term> terms = hpoOntology.allTermIds.collect{hpoOntology.termMap.get(it)}) {
        StopWatch stopWatch = new StopWatch()
        stopWatch.start()
        DbTerm.withTransaction {
            AncestorPathsBuilder ancestorPathsBuilder = new AncestorPathsBuilder(hpoOntology)
            for (Term term in terms) {
                DbTerm dbTerm = new DbTerm(term as Term).save()
                saveAncestorPaths(term, dbTerm, ancestorPathsBuilder)
            }
        }
        println("duration: ${stopWatch} time: ${new Date()}")
    }

    private void saveAncestorPaths(Term term, DbTerm dbTerm, ancestorPathsBuilder) {
        List<List<Term>> ancestorPaths = ancestorPathsBuilder.getAncestorPaths(term)
        for (List<Term> ancestorPath in ancestorPaths) {
            new DbTermPath(
                    dbTerm: dbTerm,
                    pathNames: ancestorPath.collect { Term ancestorTerm -> ancestorTerm.name.toLowerCase() }.join(' > '),
                    pathIds: ancestorPath.collect { Term ancestorTerm -> ancestorTerm.id.idWithPrefix },
                    pathLength: ancestorPath.size(),
            ).save()
        }
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

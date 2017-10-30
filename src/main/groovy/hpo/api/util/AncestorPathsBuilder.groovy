package hpo.api.util

import com.github.phenomics.ontolib.formats.hpo.HpoOntology
import com.github.phenomics.ontolib.ontology.data.Term
import com.github.phenomics.ontolib.ontology.data.TermId
import org.springframework.beans.factory.annotation.Autowired

/**
 * Created by djd on 10/24/17.
 */
class AncestorPathsBuilder {
    final private HpoOntology hpoOntology

//    final private Map<Term,List<List<Term>>> termToAncestorPaths = [:].withDefault {[]}

    AncestorPathsBuilder(HpoOntology hpoOntology){
        this.hpoOntology = hpoOntology
    }


    /**
     * Recursive method to walk up the hierarchy to the root
     * @param term
     * @return a List of 1 or List<Term>, so return a list of each unique path to the term
     */
    List<List<Term>> getAncestorPaths(Term term) {
        final List<List<Term>> paths = []
        if(paths.isEmpty()){
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
//            termToAncestorPaths.put(term, paths)
        }
        paths
    }

}

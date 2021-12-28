package hpo.api.util

import org.monarchinitiative.phenol.ontology.data.Ontology
import org.monarchinitiative.phenol.ontology.data.Term
import org.monarchinitiative.phenol.ontology.data.TermId

/**
 * Created by djd on 10/24/17.
 */
class AncestorPathsBuilder {
    final private Ontology hpoOntology

//    final private Map<Term,List<List<Term>>> termToAncestorPaths = [:].withDefault {[]}

    AncestorPathsBuilder(Ontology hpoOntology){
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

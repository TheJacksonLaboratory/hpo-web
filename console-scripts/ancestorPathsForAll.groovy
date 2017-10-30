import com.github.phenomics.ontolib.ontology.data.ImmutableTermId
import com.github.phenomics.ontolib.ontology.data.Term
import com.github.phenomics.ontolib.ontology.data.TermId
    
def termId = DbTerm.findByName('all').ontologyId
hpoOntology = ctx.hpoOntology

def term = ctx.hpoOntology.getTermMap().get(ImmutableTermId.constructWithPrefix(termId))

def ancestorpaths = getAncestorPaths(term)
ancestorpaths.each{ ancestorPath ->
    println(ancestorPath*.name)
}

null

List<List<Term>>  getAncestorPaths(Term term){
        final List<List<Term>> paths = []
        Set<TermId> parentTermIds = hpoOntology.getParentTermIds(term.id)
        if(parentTermIds.isEmpty()){
            paths.add([term])
        }
        else {
            for(TermId parentId in parentTermIds){
                Term parent = hpoOntology.getTermMap().get(parentId)
                for(List<Term> ancestorPath in getAncestorPaths(parent)){
                    ancestorPath.add(parent)
                    paths.add(ancestorPath)
                }
            }
        }
        paths
    }
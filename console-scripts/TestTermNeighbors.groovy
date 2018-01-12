
import hpo.api.term.DbTerm
import com.github.phenomics.ontolib.formats.hpo.HpoOntology
import com.github.phenomics.ontolib.ontology.data.ImmutableTermId
import com.github.phenomics.ontolib.ontology.data.Term
import com.github.phenomics.ontolib.ontology.data.TermId
import com.github.phenomics.ontolib.ontology.algo.OntologyTerms
import hpo.api.util.HpoOntologyFactory


DbTerm term = DbTerm.findByOntologyId('HP:0000022')
Set<DbTerm> children = term.getChildren()
Set<DbTerm> parents = term.getParents()

println 'Children ' + children
println 'Parents ' + parents


def searchTerm = 'HP:0000022'
def list = ctx.hpoTermRelationsService.findTermRelations(searchTerm)
println "Term =" +  list.term
println "Children =" + list.children.data
println "Parents = " + list.parents.data


//Query for some data against the onlogy

HpoOntology hpoOntology = new HpoOntologyFactory().getInstance()
String trimmedQ = "eye"

List<Term> termResult = []
if (trimmedQ.startsWith('HP:')) {
    termResult.add(hpoOntology.termMap.get(ImmutableTermId.constructWithPrefix(trimmedQ)))
}
termResult.addAll(hpoOntology.terms.findAll { it.name.toLowerCase().contains(trimmedQ.toLowerCase()) })
println "termResults :" + termResult*.id.size()


// Query for children and parents against the ontology

def term2 = termResult[0]
println 'children of ' + OntologyTerms.childrenOf(term2.id, hpoOntology).size()

println 'parents of ' + OntologyTerms.parentsOf(term2.id, hpoOntology).size()

Term t = hpoOntology.getTermMap().get(term2.getId())
println t.getId()

// Use ontology getParentTermIds
Set<TermId> parentTermIds = hpoOntology.getParentTermIds(t.id)
println 'parentTermIds size = ' + parentTermIds.size()
List<Term> parents2 = []
if (! parentTermIds.isEmpty()) {
    for (TermId parentId in parentTermIds) {
        Term parentAAA = hpoOntology.getTermMap().get(parentId)
        println 'parentAAA ' + parentAAA
        parents2.add(parentAAA)
    }
}
println 'parents2 size = ' + parents2.size()



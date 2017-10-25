import com.github.phenomics.ontolib.ontology.data.ImmutableTermId
import com.github.phenomics.ontolib.ontology.data.Term



def termIds = ctx.hpoOntology.allTermIds
def terms = termIds.collect{ctx.hpoOntology.termMap.get(it)}.findAll()
terms = terms.subList(0,1000)
println(terms.size())


ctx.dbTermAdminService.deleteDbTerms()
ctx.dbTermAdminService.refreshDbTerms(terms)
println("DbTerm.count() : ${DbTerm.count}")
println("DbTermPath.count() : ${DbTermPath.count}")
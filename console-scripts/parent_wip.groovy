def searchTerm = 'syndrome'
def list = ctx.hpoSearchService.searchAll(searchTerm)
//println list.diseases

def map = ctx.hpoSearchService.searchAll('abnormality of limbs')
def term = map.terms.data[0]
println(term.name)

def hpoOntology = ctx.hpoOntology
def parentIds = hpoOntology.getParentTermIds()
println("parent terms")
for(parentId in parentIds){
    println( "  ${hpoOntology.termMap.get(parentId).name}")
}

def map = ctx.hpoSearchService.search('abnormality of limbs')
def term = map.terms[0]
println(term.name)

def hpoOntology = ctx.hpoOntology
def parentIds = hpoOntology.getParentTermIds(term.id)
println("parent terms")
for(parentId in parentIds){
    println( "  ${hpoOntology.termMap.get(parentId).name}")
}

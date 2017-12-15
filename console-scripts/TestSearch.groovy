
def searchTerm = 'syndrome'
def list = ctx.hpoSearchService.searchAll(searchTerm)
println list.diseases
println list.diseases.size()
println list.terms
println list.terms.size()
println list.genes
println list.genes.size()

import hpo.api.db.DbGeneAdminService
import hpo.api.gene.DbGene
import hpo.api.term.DbTerm

DbGeneAdminService dbGeneAdminService = ctx.dbGeneAdminService

//dbGeneAdminService.deleteDbGenes()
//Map<Integer, String> entrezIdToSymbolMap = dbGeneAdminService.getEntrezIdToSymbolMap()
//Map<Integer, String> entrezIdToDbGeneMap = dbGeneAdminService.saveGenes(entrezIdToSymbolMap)

dbGeneAdminService.deleteDbGeneDbTermJoinTable()
dbGeneAdminService.joinGenesAndTermsWithSql()
null

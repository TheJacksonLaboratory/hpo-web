import hpo.api.db.DbGeneAdminService
import hpo.api.gene.DbGene
import hpo.api.term.DbTerm
//ctx.dbDiseaseAdminService.truncateDbDiseases()
//ctx.dbDiseaseAdminService.loadDiseases()
ctx.dbDiseaseAdminService.joinDiseaseAndTermsWithSql()
/*
DbGeneAdminService dbGeneAdminService = ctx.dbGeneAdminService
dbGeneAdminService.loadEntrezGenes()

//dbGeneAdminService.deleteDbGenes()
//Map<Integer, String> entrezIdToSymbolMap = dbGeneAdminService.getEntrezIdToSymbolMap()
//Map<Integer, String> entrezIdToDbGeneMap = dbGeneAdminService.saveGenes(entrezIdToSymbolMap)

/*dbGeneAdminService.truncateGeneTermJoinTable()
dbGeneAdminService.joinGenesAndTermsWithSql()*/
null
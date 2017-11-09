// LOAD THE ENTIRE DATABASE
ctx.dbTermAdminService.refreshDbTerms() 		// Load Terms
dbGeneAdminService.loadEntrezGenes() 			// Load Genes
dbGeneAdminService.truncateGeneTermJoinTable()	// Truncate Genes to Terms
dbGeneAdminService.joinGenesAndTermsWithSql() 	// Create Genes to Terms
ctx.dbDiseaseAdminService.truncateDbDiseases() 	// Truncate Disease
ctx.dbDiseaseAdminService.loadDiseases() 	 	// Load Diseases
ctx.dbDiseaseAdminService.joinDiseaseAndTermsWithSql()// Load Diseases To Term
null
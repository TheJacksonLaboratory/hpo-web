// LOAD THE ENTIRE DATABASE
ctx.dbTermAdminService.refreshDbTerms() 			// Load Terms Table
//ctx.dbGeneAdminService.truncateDbGenes()			// Truncate Gene Table
ctx.dbGeneAdminService.loadEntrezGenes() 			// Load Genes Table
//ctx.dbGeneAdminService.truncateGeneTermJoinTable()	// Truncate Genes to Terms
ctx.dbGeneAdminService.joinGenesAndTermsWithSql() 	// Create Genes to Terms
null
//ctx.dbDiseaseAdminService.truncateDbDiseases() 		// Truncate Disease
ctx.dbDiseaseAdminService.loadDiseases() 	 		// Load Diseases
//ctx.dbDiseaseAdminService.truncateDiseaseTermJoinTable() // Truncate Disease Join Table
ctx.dbDiseaseAdminService.joinDiseaseAndTermsWithSql()	 // Load Diseases To Term*/
null

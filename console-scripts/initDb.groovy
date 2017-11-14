import org.apache.commons.lang.time.StopWatch

StopWatch stopWatch = new StopWatch()
stopWatch.start()
// LOAD THE ENTIRE DATABASE
ctx.dbTermAdminService.refreshDbTerms() 			// Load Terms Table

ctx.dbGeneAdminService.truncateGeneTermJoinTable()	// Truncate Genes to Terms
ctx.dbGeneAdminService.truncateDbGenes()			// Truncate Gene Table
ctx.dbGeneAdminService.loadEntrezGenes() 			// Load Genes Table
ctx.dbGeneAdminService.joinGenesAndTermsWithSql() 	// Create Genes to Terms

ctx.dbDiseaseAdminService.truncateDiseaseTermJoinTable() // Truncate Disease Join Table
ctx.dbDiseaseAdminService.truncateDbDiseases() 		     // Truncate Disease
ctx.dbDiseaseAdminService.truncateDiseaseGeneJoinTable() // Truncate Disease To Gene
ctx.dbDiseaseAdminService.loadDiseases() 	 		     // Load Diseases
ctx.dbDiseaseAdminService.joinDiseaseAndTermsWithSql()	 // Load Diseases To Term
ctx.dbDiseaseAdminService.joinDiseasesToGenesWithSql()   // Load Disease To Gene

println("finished refreshing database duration: ${stopWatch} time: ${new Date()}")

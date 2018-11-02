package hpo.api


import grails.dev.commands.*
import org.apache.commons.lang.time.StopWatch

class LoadHpoDbCommand implements GrailsApplicationCommand {

    boolean handle() {
      StopWatch stopWatch = new StopWatch()
      stopWatch.start()
      // LOAD THE ENTIRE DATABASE
      def appCtx = getApplicationContext()
      appCtx.sqlUtilsService.stopForeignChecks()
      appCtx.dbGeneAdminService.truncateGeneTermJoinTable()	// Truncate Genes to Terms
      appCtx.dbDiseaseAdminService.truncateDiseaseGeneJoinTable() // Truncate Disease To Gene
      appCtx.dbDiseaseAdminService.truncateDiseaseTermJoinTable() // Truncate Disease Join Table
      appCtx.dbTermAdminService.truncatedDbTermPath()
      appCtx.dbTermAdminService.tuncateDbTermRelationship()
      appCtx.dbTermAdminService.truncateDbTermSynonyms()
      appCtx.dbTermAdminService.truncateDbTerms()       // Truncate Term Table
      appCtx.dbGeneAdminService.truncateDbGenes()			// Truncate Gene Table
      appCtx.dbDiseaseAdminService.truncateDbDiseases() 		     // Truncate Disease
      appCtx.sqlUtilsService.startForeignChecks()

      appCtx.dbTermAdminService.loadDbTerms() 			// Load Terms Table
      appCtx.dbGeneAdminService.loadEntrezGenes() 			// Load Genes Table
      appCtx.dbGeneAdminService.joinGenesAndTermsWithSql() 	// Create Genes to Terms
      appCtx.dbDiseaseAdminService.loadDiseases() 	 		     // Load Diseases
      appCtx.dbDiseaseAdminService.joinDiseaseAndTermsWithSql()	 // Load Diseases To Term
      appCtx.dbDiseaseAdminService.joinDiseasesToGenesWithSql()   // Load Disease To Gene

      println("finished refreshing database duration: ${stopWatch} time: ${new Date()}")
        return true
    }
}


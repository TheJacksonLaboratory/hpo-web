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
      appCtx.dbTermAdminService.truncateDbMaxo()
      appCtx.dbDiseaseAdminService.truncateDiseaseGeneJoinTable() // Truncate Disease To Gene
      appCtx.dbDiseaseAdminService.truncateAnnotationTable() // Truncate Disease Term Table
      appCtx.dbTermAdminService.truncatedDbTermPath()
      appCtx.dbTermAdminService.tuncateDbTermRelationship()
      appCtx.dbTermAdminService.truncateDbTermSynonyms()
      appCtx.dbTermAdminService.truncateDbTerms()       // Truncate Term Table
      appCtx.dbGeneAdminService.truncateDbGenes()			// Truncate Gene Table
      appCtx.dbDiseaseAdminService.truncateDbDiseases() 		     // Truncate Disease
      appCtx.sqlUtilsService.startForeignChecks()

      try{
        appCtx.dbTermAdminService.loadDbTerms() 			// Load Terms Table
        appCtx.dbTermAdminService.loadDbMaxo()        // Load Maxo Table
        appCtx.dbGeneAdminService.executeGeneSchemaLoad() 			// Load Genes Table
        appCtx.dbDiseaseAdminService.executeDiseaseSchemaLoad() 	 		     // Load Diseases
      }catch(Exception e){
        println(e.toString());
        println("FAILED refreshing database duration: ${stopWatch} time: ${new Date()}")
        return false
      }

      println("Finished refreshing database duration: ${stopWatch} time: ${new Date()}")
        return true
    }
}


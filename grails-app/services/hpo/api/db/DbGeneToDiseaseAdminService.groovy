package hpo.api.db

import com.github.phenomics.ontolib.formats.hpo.HpoGeneAnnotation
import com.github.phenomics.ontolib.io.base.TermAnnotationParserException
import grails.gorm.transactions.Transactional
import hpo.api.gene.DbGene
import hpo.api.gene.DbGeneToDisease
import hpo.api.io.HpoGeneToDiseaseAnnotationParser
import hpo.api.io.HpoGeneTransitiveAnnotationParser
import hpo.api.models.HpoGeneDiseaseAnnotation
import org.apache.commons.lang.time.StopWatch
import org.grails.io.support.ClassPathResource
import org.hibernate.Session

@Transactional
class DbGeneToDiseaseAdminService {

  void deleteGeneMapping() {
    StopWatch stopWatch = new StopWatch()
    stopWatch.start()
    DbGeneToDisease.executeUpdate("delete from DbGene")
    DbGeneToDisease.executeUpdate("delete from DbGene")
    println("duration: ${stopWatch} time: ${new Date()}")
  }

  void refreshGeneMapping() {
    deleteGeneMapping()
    StopWatch stopWatch = new StopWatch()
    stopWatch.start()
    DbGeneToDisease.withSession { Session session ->
      File file = new ClassPathResource("genes_to_diseases.txt").file
      HpoGeneToDiseaseAnnotationParser geneMappingParser = new HpoGeneToDiseaseAnnotationParser(file)
      while (geneMappingParser.hasNext()) {
        HpoGeneDiseaseAnnotation geneMappingAnnotation = geneMappingParser.next()
        DbGeneToDisease geneMapping = new DbGeneToDisease(geneMappingAnnotation as HpoGeneDiseaseAnnotation)
        geneMapping.save()
      }
      session.flush()
      session.clear()
    }
    println("duration: ${stopWatch} time: ${new Date()}")
  }

}

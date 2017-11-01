package hpo.api.db

import com.github.phenomics.ontolib.formats.hpo.HpoGeneAnnotation
import grails.gorm.transactions.Transactional
import hpo.api.io.HpoGeneTransitiveAnnotationParser
import org.apache.commons.lang.time.StopWatch
import hpo.api.gene.DbGene
import org.grails.io.support.ClassPathResource
import org.hibernate.Session

@Transactional
class DbGeneAdminService {
  void deleteDbGenes() {
    StopWatch stopWatch = new StopWatch()
    stopWatch.start()
    DbGene.executeUpdate("delete from DbGene")
    DbGene.executeUpdate("delete from DbGene")
    println("duration: ${stopWatch} time: ${new Date()}")
  }

  void refreshTransitiveGenes(){
    deleteDbGenes()
    StopWatch stopWatch = new StopWatch()
    stopWatch.start()
    DbGene.withSession { Session session ->
      File file = new ClassPathResource("ALL_SOURCES_ALL_FREQUENCIES_phenotype_to_genes.txt").file
      HpoGeneTransitiveAnnotationParser geneTransitiveParser = new HpoGeneTransitiveAnnotationParser(file)
      while (geneTransitiveParser.hasNext()) {
        HpoGeneAnnotation geneAnnotation = geneTransitiveParser.next()
        DbGene dbGene = new DbGene(geneAnnotation as HpoGeneAnnotation)
        dbGene.save()
      }
      session.flush()
      session.clear()
    }
    println("duration: ${stopWatch} time: ${new Date()}")
  }
}



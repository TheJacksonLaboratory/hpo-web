package hpo.api.db

import com.github.phenomics.ontolib.formats.hpo.HpoDiseaseAnnotation
import com.github.phenomics.ontolib.io.obo.hpo.HpoDiseaseAnnotationParser
import hpo.api.io.HpoDiseaseParser
import grails.gorm.transactions.Transactional
import hpo.api.disease.DbDisease
import org.apache.commons.lang.time.StopWatch
import org.grails.io.support.ClassPathResource
import org.hibernate.Session
import org.hibernate.SessionFactory

import java.lang.reflect.InvocationTargetException

@Transactional
class DbDiseaseAdminService {

  void deleteDbDiseases() {
    StopWatch stopWatch = new StopWatch()
    stopWatch.start()
    DbDisease.executeUpdate("delete from DbGene")
    DbDisease.executeUpdate("delete from DbGene")
    println("duration: ${stopWatch} time: ${new Date()}")
  }

  void refreshDbDiseases() {
    deleteDbDiseases()
    StopWatch stopWatch = new StopWatch()
    stopWatch.start()
    Integer counter;
    List<HpoDiseaseAnnotation> diseaseAnnotations = []
    File file = new ClassPathResource("phenotype_annotation.tab").file
    HpoDiseaseParser diseaseAnnotationParser = new HpoDiseaseParser(file)
      DbDisease.withSession { Session session ->
        counter = 0
        while (diseaseAnnotationParser.hasNext()) {
          counter = counter + 1
          HpoDiseaseAnnotation diseaseAnnotation = diseaseAnnotationParser.next()
          DbDisease dbDisease = new DbDisease(diseaseAnnotation as HpoDiseaseAnnotation)
          if (counter < 1000) {
            dbDisease.save()
          } else {
            session.flush()
            session.clear()
            counter = 1
            dbDisease.save()
          }

        }
        session.flush()
        session.clear()
      }
    println("duration: ${stopWatch} time: ${new Date()}")
  }
}



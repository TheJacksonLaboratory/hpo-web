package hpo.api.db

import com.github.phenomics.ontolib.formats.hpo.HpoDiseaseAnnotation
import com.github.phenomics.ontolib.io.obo.hpo.HpoDiseaseAnnotationParser
import hpo.api.io.HpoDiseaseParser
import grails.gorm.transactions.Transactional
import hpo.api.disease.DbDisease
import hpo.api.term.DbTerm
import org.apache.commons.lang.time.StopWatch
import org.grails.io.support.ClassPathResource
import org.hibernate.Session

@Transactional
class DbDiseaseAdminService {

  void deleteDbDiseases() {
    StopWatch stopWatch = new StopWatch()
    stopWatch.start()
    DbDisease.executeUpdate("delete from DbGene")
    DbDisease.executeUpdate("delete from DbGene")
    println("duration: ${stopWatch} time: ${new Date()}")
  }
  void loadDB(){
    List<HpoDiseaseAnnotation> diseaseAnnotations =[]
    File file = new ClassPathResource("phenotype_annotation.tab").file
    HpoDiseaseParser diseaseParser = new HpoDiseaseParser(file)
    Map<String, DbTerm> termMemoryMap = [:]
    Map<String, DbDisease> dMemoryMap = [:]
    Integer counter = 0
    DbDisease dbDisease = null
    DbTerm term = null
    while (diseaseParser.hasNext()) {
      HpoDiseaseAnnotation diseaseAnnotation = diseaseParser.next()
      dbDisease = dMemoryMap.get(diseaseAnnotation.getDbReference())
      if(!dbDisease) {
        dbDisease = new DbDisease(diseaseAnnotation)
        dMemoryMap.put(diseaseAnnotation.getDbReference(),dbDisease)
        dbDisease.save()
      }
      term = termMemoryMap.get(diseaseAnnotation.getTermId().getIdWithPrefix())
      if(!term){
        term = DbTerm.findByOntologyId(diseaseAnnotation.getTermId().getIdWithPrefix())
        termMemoryMap.put(diseaseAnnotation.getTermId().getIdWithPrefix(),term)
      }
      if(term){
        term.addToDbDisease(dbDisease)
      }else{
        // THESE ARE TERMS NOT FOUND IN DB_TERM BUT IN PHENOTYPE FILE
        counter++
      }
    }
    System.out.println(counter.toString())
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



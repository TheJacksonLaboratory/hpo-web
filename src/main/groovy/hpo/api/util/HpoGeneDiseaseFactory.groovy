package hpo.api.util

import groovy.transform.CompileStatic
import hpo.api.io.HpoGeneToDiseaseAnnotationParser
import hpo.api.models.HpoGeneDiseaseAnnotation
import org.grails.io.support.ClassPathResource

@CompileStatic
class HpoGeneDiseaseFactory {
    List<HpoGeneDiseaseAnnotation> getInstance(){
      final File file = new ClassPathResource("genes_to_diseases.txt").file
      List<HpoGeneDiseaseAnnotation> geneToDiseaseAnnotations = []
      HpoGeneToDiseaseAnnotationParser geneToDiseaseParser = new HpoGeneToDiseaseAnnotationParser(file)
      while (geneToDiseaseParser.hasNext()) {
        geneToDiseaseAnnotations.add(geneToDiseaseParser.next())
      }
      return geneToDiseaseAnnotations
    }
}

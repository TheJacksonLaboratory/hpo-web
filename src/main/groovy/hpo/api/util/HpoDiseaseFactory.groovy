package hpo.api.util

import com.github.phenomics.ontolib.formats.hpo.HpoDiseaseAnnotation
import com.github.phenomics.ontolib.io.obo.hpo.HpoDiseaseAnnotationParser
import groovy.transform.CompileStatic
import org.grails.io.support.ClassPathResource


@CompileStatic
class HpoDiseaseFactory {
    List<HpoDiseaseAnnotation> getInstance(){
        final File file = new ClassPathResource('phenotype_annotation.tab').file
        List<HpoDiseaseAnnotation> diseaseAnnotations= []
        HpoDiseaseAnnotationParser diseaseAnnotationParser = new HpoDiseaseAnnotationParser(file)
        while (diseaseAnnotationParser.hasNext()){
            diseaseAnnotations.add(diseaseAnnotationParser.next())
        }
        diseaseAnnotations.asImmutable()
    }
}

package hpo.api.util

import com.github.phenomics.ontolib.formats.hpo.HpoDiseaseAnnotation
import com.github.phenomics.ontolib.io.obo.hpo.HpoDiseaseAnnotationParser
import groovy.transform.CompileStatic
import org.grails.io.support.ClassPathResource


@CompileStatic
class HpoAnnotationFactory {
    static List<HpoDiseaseAnnotation> getAnnotationInstance(){
        final File file = new ClassPathResource('phenotype_annotation.tab').file
        List<HpoDiseaseAnnotation> arraylistOfAnnotations= []
        HpoDiseaseAnnotationParser diseaseAnnotationParser = new HpoDiseaseAnnotationParser(file)
        while (diseaseAnnotationParser.hasNext()){
            arraylistOfAnnotations.add(diseaseAnnotationParser.next())
        }
        arraylistOfAnnotations.asImmutable()
    }
}

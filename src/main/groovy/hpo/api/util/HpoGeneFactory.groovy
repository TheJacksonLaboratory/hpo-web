package hpo.api.util

import org.monarchinitiative.phenol.formats.hpo.HpoGeneAnnotation
import org.monarchinitiative.phenol.io.obo.hpo.HpoGeneAnnotationParser
import groovy.transform.CompileStatic
import org.grails.io.support.ClassPathResource

@CompileStatic
class HpoGeneFactory {
    List<HpoGeneAnnotation> getInstance() {
        final File file = new ClassPathResource('ALL_SOURCES_ALL_FREQUENCIES_genes_to_phenotype.txt').file
        List<HpoGeneAnnotation> geneAnnotations = []
        HpoGeneAnnotationParser geneParser = new HpoGeneAnnotationParser(file)
        while (geneParser.hasNext()) {
            geneAnnotations.add(geneParser.next())
        }
        geneAnnotations.asImmutable()
    }
}

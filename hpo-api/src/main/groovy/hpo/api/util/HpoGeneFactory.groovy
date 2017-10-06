package hpo.api.util
import com.github.phenomics.ontolib.io.obo.hpo.HpoGeneAnnotationParser
import com.github.phenomics.ontolib.formats.hpo.HpoGeneAnnotation
import groovy.transform.CompileStatic
import org.grails.io.support.ClassPathResource
@CompileStatic
class HpoGeneFactory {
    static List<HpoGeneAnnotation> getGeneAnnotationInstance() {
        final File file = new ClassPathResource('ALL_SOURCES_ALL_FREQUENCIES_genes_to_phenotype.txt').file
        List<HpoGeneAnnotation> geneAnnotations = []
        HpoGeneAnnotationParser geneParser = new HpoGeneAnnotationParser(file)
        while (geneParser.hasNext()) {
            geneAnnotations.add(geneParser.next())
        }
        geneAnnotations.asImmutable()
    }
}

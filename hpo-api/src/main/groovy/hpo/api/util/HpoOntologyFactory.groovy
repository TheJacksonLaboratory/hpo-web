package hpo.api.util

import com.github.phenomics.ontolib.formats.hpo.HpoOntology
import com.github.phenomics.ontolib.formats.hpo.HpoDiseaseAnnotation
import com.github.phenomics.ontolib.io.obo.hpo.HpoOboParser
import com.github.phenomics.ontolib.io.obo.hpo.HpoDiseaseAnnotationParser
import groovy.transform.CompileStatic
import org.grails.io.support.ClassPathResource

/**
 * Created by djd on 9/11/17.
 */
@CompileStatic
class HpoOntologyFactory {
    static HpoOntology getInstance() {
        final File file = new ClassPathResource('hpo.obo').file
        new HpoOboParser(file).parse()
    }
}

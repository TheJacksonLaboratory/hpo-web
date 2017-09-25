package hpo.api.util

import com.github.phenomics.ontolib.formats.hpo.HpoOntology
import com.github.phenomics.ontolib.io.obo.hpo.HpoOboParser
import org.grails.io.support.ClassPathResource

/**
 * Created by djd on 9/11/17.
 */
class HpoOntologyFactory {
    static HpoOntology getInstance() {
        final File file = new ClassPathResource('hpo.obo').file
        new HpoOboParser(file).parse()
    }
}

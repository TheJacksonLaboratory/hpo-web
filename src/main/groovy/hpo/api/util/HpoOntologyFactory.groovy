package hpo.api.util

import org.monarchinitiative.phenol.formats.hpo.HpoOntology
import org.monarchinitiative.phenol.io.obo.hpo.HpOboParser
import groovy.transform.CompileStatic
import org.grails.io.support.ClassPathResource


/**
 * Created by djd on 9/11/17.
 */
@CompileStatic
class HpoOntologyFactory {
    HpoOntology getInstance() {
        final File file = new ClassPathResource('hp_new.obo').file
        return new HpOboParser(file).parse()
    }
}

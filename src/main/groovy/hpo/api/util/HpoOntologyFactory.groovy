package hpo.api.util

import org.monarchinitiative.phenol.ontology.data.Ontology
import org.monarchinitiative.phenol.io.OntologyLoader
import groovy.transform.CompileStatic
import org.grails.io.support.ClassPathResource


/**
 * Created by djd on 9/11/17.
 */
@CompileStatic
class HpoOntologyFactory {
    Ontology getInstance() {
        final File file = new ClassPathResource('hp_mostrecent.obo').file
        return OntologyLoader.loadOntology(file)
    }
}

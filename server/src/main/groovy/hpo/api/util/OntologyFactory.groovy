package hpo.api.util

import org.monarchinitiative.phenol.io.utils.CurieUtil
import org.monarchinitiative.phenol.io.utils.CurieUtilBuilder
import org.monarchinitiative.phenol.ontology.data.Ontology
import org.monarchinitiative.phenol.io.OntologyLoader
import groovy.transform.CompileStatic
import org.grails.io.support.ClassPathResource


/**
 * Created by djd on 9/11/17.
 */
@CompileStatic
class OntologyFactory {
    Ontology getHpoOntology() {
        final File file = new ClassPathResource('hp.json').file
        return OntologyLoader.loadOntology(file)
    }

   Ontology getMaxoOntology() {
      final File file = new ClassPathResource('maxo.json').file
      CurieUtil curieUtil = CurieUtilBuilder.withDefaultsAnd(['APOLLO_SV':'http://purl.obolibrary.org/obo/APOLLO_SV_'])
      return OntologyLoader.loadOntology(file, curieUtil, "MAXO")
    }
}

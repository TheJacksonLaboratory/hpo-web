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
        final InputStream stream = new ClassPathResource('hp.json').getInputStream()
        return OntologyLoader.loadOntology(stream)
    }

   Ontology getMaxoOntology() {
      final InputStream stream = new ClassPathResource('maxo.json').getInputStream()
      CurieUtil curieUtil = CurieUtilBuilder.withDefaultsAnd(['APOLLO_SV':'http://purl.obolibrary.org/obo/APOLLO_SV_'])
      return OntologyLoader.loadOntology(stream, curieUtil, "MAXO")
    }
}

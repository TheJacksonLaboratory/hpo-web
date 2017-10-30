package hpo.api

import com.github.phenomics.ontolib.formats.hpo.HpoDiseaseAnnotation
import grails.compiler.GrailsCompileStatic
import org.apache.commons.lang.StringUtils

@GrailsCompileStatic
class HpoDiseaseDetailsService {

    List<HpoDiseaseAnnotation> hpoDiseases
    /**
     *
     * Query the ontology by HPO ID
     *
     * @param q the term to query with
     * @return Term Object with result term.
     */
    List<HpoDiseaseAnnotation> searchDisease(String q){
        final String trimmedQ = StringUtils.trimToNull(q)
        final List<HpoDiseaseAnnotation> diseaseResult = []
        if (trimmedQ) {
            diseaseResult = this.hpoDiseases.findAll {it.dbReference.equals(trimmedQ)}
            diseaseResult.unique {it.dbReference}
        }
        return diseaseResult
    }
}

package hpo.api

import com.github.phenomics.ontolib.formats.hpo.HpoDiseaseAnnotation
import com.github.phenomics.ontolib.ontology.data.ImmutableTermId
import com.github.phenomics.ontolib.ontology.data.Term
import groovy.transform.CompileStatic


@CompileStatic
class HpoDiseaseDetailsService {

    List<HpoDiseaseAnnotation> hpoDiseases
    /**
     *
     * Query the ontology by HPO ID
     *
     * @param q the term to query with
     * @return Term Object with result term.
     */
    List<HpoDiseaseAnnotation> searchDisease(String trimmedQ){
        final List<HpoDiseaseAnnotation> diseaseResult = null
        if (trimmedQ) {
            diseaseResult = this.hpoDiseases.findAll {it.dbReference.equals(trimmedQ)}
            diseaseResult.unique {it.dbReference}
        }
        return diseaseResult
    }
}

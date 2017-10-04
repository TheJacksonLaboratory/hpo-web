package hpo.api

import com.github.phenomics.ontolib.formats.hpo.HpoOntology
import com.github.phenomics.ontolib.formats.hpo.HpoDiseaseAnnotation
import com.github.phenomics.ontolib.ontology.data.ImmutableTermId
import com.github.phenomics.ontolib.ontology.data.Term
import groovy.transform.CompileStatic
import org.apache.commons.lang.StringUtils
import java.util.HashMap;

@CompileStatic
class HpoSearchService {

    HpoOntology hpoOntology
    List<HpoDiseaseAnnotation> hpoDiseaseAnnotations
    /**
     *
     * Currently supporting Ids and partial names case insensitive
     *
     * @param q the term to query with
     * @return {@link List} <code>Term</code>s for query term
     */
    Map search(String q) {
        final Map resultMap = ['terms':[],'diseases':[]]
        final String trimmedQ = StringUtils.trimToNull(q)
        if (trimmedQ) {
            resultMap.put("terms", searchTerms(trimmedQ))
            resultMap.put("diseases", searchDiseaseAnnotations(trimmedQ))
        }
        return resultMap
    }

    private List<HpoDiseaseAnnotation> searchDiseaseAnnotations(String trimmedQ){
        final List<HpoDiseaseAnnotation> diseaseResult = []
        diseaseResult.addAll(this.hpoDiseaseAnnotations.findAll {it.dbName.toLowerCase().contains(trimmedQ.toLowerCase())})
        diseaseResult.unique{it.dbName}

        return diseaseResult
    }
    private List<Term> searchTerms(String trimmedQ){
        final List<Term> termResult = []
        if (trimmedQ.startsWith('HP:')) {
            termResult.add(this.hpoOntology.termMap.get(ImmutableTermId.constructWithPrefix(trimmedQ)))
        }
        termResult.addAll(this.hpoOntology.terms.findAll { it.name.toLowerCase().contains(trimmedQ.toLowerCase()) })
        termResult.unique()

        return termResult
    }
}

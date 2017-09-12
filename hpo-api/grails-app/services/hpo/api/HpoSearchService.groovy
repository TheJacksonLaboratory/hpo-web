package hpo.api

import com.github.phenomics.ontolib.formats.hpo.HpoOntology
import com.github.phenomics.ontolib.ontology.data.ImmutableTermId
import com.github.phenomics.ontolib.ontology.data.Term
import org.apache.commons.lang.StringUtils

class HpoSearchService {

    HpoOntology hpoOntology

    /**
     *
     * Currently supporting Ids and partial names case insensitive
     *
     * @param q the term to query with
     * @return {@link List} <code>Term</code>s for query term
     */
    List<Term> search(String q) {
        final List<Term> results = []
        final String trimmedQ = StringUtils.trimToNull(q)
        if (trimmedQ) {
            if (trimmedQ.startsWith('HP:')) {
                results.add(this.hpoOntology.termMap.get(ImmutableTermId.constructWithPrefix(trimmedQ)))
            }
            results.addAll(this.hpoOntology.terms.findAll { it.name.toLowerCase().contains(trimmedQ.toLowerCase()) })
        }
        results.unique()
    }


}

package hpo.api

import com.github.phenomics.ontolib.ontology.data.ImmutableTermId
import grails.gorm.transactions.Transactional
import com.github.phenomics.ontolib.ontology.data.Term
import com.github.phenomics.ontolib.formats.hpo.HpoOntology
import groovy.transform.CompileStatic


@CompileStatic
class HpoTermDetailsService {

    HpoOntology hpoOntology

    Term searchTerms(String trimmedQ){
        final Term termResult = null
        if (trimmedQ.startsWith('HP:')) {
            termResult =  this.hpoOntology.termMap.get(ImmutableTermId.constructWithPrefix(trimmedQ))
        }
        return termResult
    }
}

package hpo.api

import com.github.phenomics.ontolib.formats.hpo.HpoDisease
import com.github.phenomics.ontolib.formats.hpo.HpoGeneAnnotation
import com.github.phenomics.ontolib.formats.hpo.HpoOntology
import com.github.phenomics.ontolib.ontology.data.Term
import grails.core.GrailsApplication
import hpo.DbTerm
import hpo.api.util.HpoOntologyFactory

class BootStrap {

    def init = { servletContext ->
        HpoOntology hpoOntology = new HpoOntologyFactory().getInstance()
        for(Term term in hpoOntology.getTerms()){
            new DbTerm(
                    name: term.name,
                    definition: term.definition,
                    comment: term.comment,
                    ontologyId: term.id.idWithPrefix,
                    isObsolete: term.isObsolete()
            ).save(failOnError:true)
        }

    }
    def destroy = {
    }
}

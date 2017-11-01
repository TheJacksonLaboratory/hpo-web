package hpo.api

import com.github.phenomics.ontolib.formats.hpo.HpoOntology
import com.github.phenomics.ontolib.ontology.data.ImmutableTermId
import com.github.phenomics.ontolib.ontology.data.Term
import com.github.phenomics.ontolib.formats.hpo.HpoOntology
import groovy.transform.CompileStatic
import com.github.phenomics.ontolib.formats.hpo.HpoDiseaseAnnotation
import com.github.phenomics.ontolib.formats.hpo.HpoGeneAnnotation
import java.lang.reflect.Array
import grails.compiler.GrailsCompileStatic

@GrailsCompileStatic
class HpoTermDetailsService {

    HpoOntology hpoOntology
    List<HpoDiseaseAnnotation> hpoDiseases
    List<HpoGeneAnnotation> hpoGenes
    /**
     *
     * Query the ontology by HPO ID
     *
     * @param q the term to query with
     * @return Term Object with result term.
     */
    Map searchTerms(String trimmedQ){
        final Map resultMap = [:]
        if (trimmedQ.startsWith('HP:')) {
            resultMap.put("term",this.hpoOntology.termMap.get(ImmutableTermId.constructWithPrefix(trimmedQ)))
            resultMap.put("geneAssoc", this.hpoGenes.findAll {it.getTermId().getIdWithPrefix().equals(trimmedQ)})
            resultMap.put("diseaseAssoc",this.hpoDiseases.findAll {it.getHpoId().getIdWithPrefix().equals(trimmedQ)})
        }
        return resultMap
    }

    /*List<Map> mapGenesToDiseases(trimmedQ){
        List<HpoGeneAnnotation> genes = this.hpoGenes.findAll {it.getTermId().getIdWithPrefix().equals(trimmedQ)}
        List<Map> mappedResult = [];
        for(gene in genes){
            List<HpoDiseaseAnnotation> diseases = []
            diseases.addAll(this.hpoDiseases.findAll {it.getHpoId().getIdWithPrefix().toLowerCase().equals(gene.)})
            gene.putAt("diseaseAssoc",diseases)
        }
        }*/
}

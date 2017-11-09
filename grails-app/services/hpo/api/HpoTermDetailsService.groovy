package hpo.api

import com.github.phenomics.ontolib.formats.hpo.HpoOntology
import com.github.phenomics.ontolib.ontology.data.ImmutableTermId
import com.github.phenomics.ontolib.ontology.data.Term
import com.github.phenomics.ontolib.formats.hpo.HpoOntology
import com.github.phenomics.ontolib.ontology.data.TermId
import com.github.phenomics.ontolib.ontology.data.TermIds
import groovy.transform.CompileStatic
import com.github.phenomics.ontolib.formats.hpo.HpoDiseaseAnnotation
import com.github.phenomics.ontolib.formats.hpo.HpoGeneAnnotation
import hpo.api.gene.DbGene
import com.github.phenomics.ontolib.ontology.algo.OntologyTerms
import java.lang.reflect.Array
import grails.compiler.GrailsCompileStatic


class HpoTermDetailsService {

    HpoOntology hpoOntology
    //List<HpoDiseaseAnnotation> hpoDiseases
    //List<HpoGeneAnnotation> hpoGenes
    /**
     *
     * Query the ontology by HPO ID
     *
     * @param q the term to query with
     * @return Term Object with result term.
     */
    Map searchTerm(String trimmedQ){
        final Map resultMap = [:]
        if (trimmedQ.startsWith('HP:')) {
            Term term = this.hpoOntology.termMap.get(ImmutableTermId.constructWithPrefix(trimmedQ))
            resultMap.put("term",term)
            resultMap.put("geneAssoc", getGenes(term))
            //resultMap.put("diseaseAssoc",this.hpoDiseases.findAll {it.getHpoId().getIdWithPrefix().equals(trimmedQ)})
        }
        return resultMap
    }
    List<DbGene> getGenes(query){
      Set<TermId> terms = OntologyTerms.childrenOf(query.id,this.hpoOntology)
      def c = DbGene.createCriteria()
      List<DbGene> geneList = c.list(){
            dbTerms {
              'in'('ontologyId',terms.collect{ it.getIdWithPrefix()})
            }
      }
      return geneList
    }
}

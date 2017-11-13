package hpo.api

import com.github.phenomics.ontolib.ontology.data.ImmutableTermId
import com.github.phenomics.ontolib.ontology.data.Term
import com.github.phenomics.ontolib.formats.hpo.HpoOntology
import com.github.phenomics.ontolib.ontology.data.TermId
import hpo.api.disease.DbDisease
import hpo.api.gene.DbGene
import com.github.phenomics.ontolib.ontology.algo.OntologyTerms
import grails.compiler.GrailsCompileStatic
import groovy.transform.TypeCheckingMode

@GrailsCompileStatic
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
        final Map resultMap = ["term":'', "geneAssoc":[],"diseaseAssoc":[]]
        if (trimmedQ.startsWith('HP:')) {
            Term term = this.hpoOntology.termMap.get(ImmutableTermId.constructWithPrefix(trimmedQ))
            resultMap.put("term",term)
            resultMap.put("geneAssoc", getGenes(term))
            resultMap.put("diseaseAssoc",getDiseases(term))
        }
        return resultMap
    }
    Set<TermId> getChildren(Term query){
      Set<TermId> terms = OntologyTerms.childrenOf(query.id,this.hpoOntology)
      return terms
    }
    List<DbGene> getGenes(Term query){
      Set<TermId> terms = getChildren(query)
      queryDbGene(terms)
    }
  @GrailsCompileStatic(TypeCheckingMode.SKIP)
  List<DbGene> queryDbGene(Set<TermId> terms){
    List<DbGene> gene = DbGene.list()
    def c = DbGene.createCriteria()
    List<DbGene> geneList = c.list(){
      dbTerms {
        'in'('ontologyId',terms.collect{ it.getIdWithPrefix()})
      }
    }
    return geneList
  }
    List<DbDisease> getDiseases(Term query){
      Set<TermId> terms = getChildren(query)
      queryDbDisease(terms)
    }

    @GrailsCompileStatic(TypeCheckingMode.SKIP)
    List<DbDisease> queryDbDisease(Set<TermId> terms){
        def c = DbDisease.createCriteria()
        List<DbDisease> diseaseList = c.list(){
          dbTerms {
            'in'('ontologyId',terms.collect{ it.getIdWithPrefix()})
          }
        }
        return diseaseList
    }
}

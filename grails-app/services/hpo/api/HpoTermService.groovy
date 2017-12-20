package hpo.api

import com.github.phenomics.ontolib.ontology.data.ImmutableTermId
import com.github.phenomics.ontolib.ontology.data.Term
import com.github.phenomics.ontolib.formats.hpo.HpoOntology
import com.github.phenomics.ontolib.ontology.data.TermId
import grails.gorm.transactions.Transactional
import hpo.api.disease.DbDisease
import hpo.api.gene.DbGene
import com.github.phenomics.ontolib.ontology.algo.OntologyTerms
import grails.compiler.GrailsCompileStatic
import groovy.transform.TypeCheckingMode
import hpo.api.term.DbTerm
import static hpo.api.models.TermEnum.*;
import  hpo.api.models.TermEnum;


@GrailsCompileStatic
class HpoTermService {

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
    Map result = [:]
      if (trimmedQ.startsWith('HP:')) {
        DbTerm dbterm = DbTerm.findByOntologyId(trimmedQ)
        Term term = this.hpoOntology.termMap.get(ImmutableTermId.constructWithPrefix(trimmedQ))
        result.put("TERM",term)
        result.put("DBTERM",dbterm)
        return result
      }
    return result
  }
  List<DbGene> searchGenesByTerm(String trimmedQ){
    List<DbGene> genes = []
    if (trimmedQ.startsWith('HP:')) {
      Term term = this.hpoOntology.termMap.get(ImmutableTermId.constructWithPrefix(trimmedQ))
      genes = getGenes(term)
    }
    return genes
  }
  List<DbDisease> searchDiseasesByTerm(String trimmedQ){
    List<DbDisease> diseases = []
    if (trimmedQ.startsWith('HP:')) {
      Term term = this.hpoOntology.termMap.get(ImmutableTermId.constructWithPrefix(trimmedQ))
      diseases = getDiseases(term)
    }
    return diseases
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

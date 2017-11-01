package hpo.api

import com.github.phenomics.ontolib.formats.hpo.HpoOntology
import com.github.phenomics.ontolib.ontology.data.ImmutableTermId
import com.github.phenomics.ontolib.ontology.data.Term
import grails.compiler.GrailsCompileStatic
import hpo.api.gene.DbGene

@GrailsCompileStatic
class HpoTermDetailsService {

  HpoOntology hpoOntology
  /**
   *
   *
   * Query the ontology by HPO ID
   *
   * @param q the term to query with
   * @return Term Object with result term.
   */
  Term searchTerms(String trimmedQ) {
    final Term termResult = null
    if (trimmedQ.startsWith('HP:')) {
      termResult = this.hpoOntology.termMap.get(ImmutableTermId.constructWithPrefix(trimmedQ))
      resultMap.put("term", this.hpoOntology.termMap.get(ImmutableTermId.constructWithPrefix(trimmedQ)))
      resultMap.put("geneAssoc", getGenes(trimmedQ))
      //resultMap.put("diseaseAssoc",this.hpoDiseases.findAll {it.getHpoId().getIdWithPrefix().equals(trimmedQ)})
      // }
      return termResult
    }
  }
  List<DbGene> getGenes(String trimmedQ) {
    def c = DbGene.createCriteria()
    List<DbGene> geneList = c.list() {
      like('ontologyId', '%${trimmedQ}%')
    }
  }
}

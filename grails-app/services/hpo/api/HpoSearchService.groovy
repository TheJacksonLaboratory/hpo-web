package hpo.api

import com.github.phenomics.ontolib.formats.hpo.HpoDiseaseAnnotation
import com.github.phenomics.ontolib.formats.hpo.HpoGeneAnnotation
import com.github.phenomics.ontolib.formats.hpo.HpoOntology
import com.github.phenomics.ontolib.ontology.data.ImmutableTermId
import com.github.phenomics.ontolib.ontology.data.Term
import grails.compiler.GrailsCompileStatic
import org.apache.commons.lang.StringUtils

@GrailsCompileStatic
class HpoSearchService {

  HpoOntology hpoOntology
  List<HpoDiseaseAnnotation> hpoDiseases
  List<HpoGeneAnnotation> hpoGenes
  /**
   *
   * Currently supporting Ids and partial names case insensitive
   *
   * @param q the term to query with
   * @return {@link List} <code>Term</code>s for query term
   */
  Map search(String q) {
    final Map resultMap = ['terms': [], 'diseases': [], 'genes': []]
    final String trimmedQ = StringUtils.trimToNull(q)
    if (trimmedQ) {
      resultMap.put('terms', searchTerms(trimmedQ))
      resultMap.put('diseases', searchDiseases(trimmedQ))
      resultMap.put('genes', searchGenes(trimmedQ))
    }
    return resultMap
  }

  private List<HpoDiseaseAnnotation> searchDiseases(String trimmedQ) {
    final List<HpoDiseaseAnnotation> diseaseResult = []
    diseaseResult.addAll(this.hpoDiseases.findAll { it.dbName.toLowerCase().contains(trimmedQ.toLowerCase()) })
    diseaseResult.unique { it.dbName }

    return diseaseResult
  }

  private List<Term> searchTerms(String trimmedQ) {
    final List<Term> termResult = []
    if (trimmedQ.startsWith('HP:')) {
      termResult.add(this.hpoOntology.termMap.get(ImmutableTermId.constructWithPrefix(trimmedQ)))
    }
    termResult.addAll(this.hpoOntology.terms.findAll { it.name.toLowerCase().contains(trimmedQ.toLowerCase()) })
    termResult.unique()

    return termResult
  }

  private List<HpoGeneAnnotation> searchGenes(String trimmedQ) {
    final List<HpoGeneAnnotation> geneResult = []
    geneResult.addAll(this.hpoGenes.findAll { it.entrezGeneSymbol.toLowerCase().contains(trimmedQ.toLowerCase()) })
    geneResult.unique { it.entrezGeneSymbol }

    return geneResult
  }

}

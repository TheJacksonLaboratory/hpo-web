package hpo.api

import com.github.phenomics.ontolib.formats.hpo.HpoOntology
import com.github.phenomics.ontolib.ontology.algo.OntologyTerms
import com.github.phenomics.ontolib.ontology.data.ImmutableTermId
import com.github.phenomics.ontolib.ontology.data.Term
import com.github.phenomics.ontolib.ontology.data.TermId
import grails.compiler.GrailsCompileStatic
import groovy.sql.GroovyRowResult
import hpo.api.db.utils.SqlUtilsService
import hpo.api.disease.DbDisease
import hpo.api.gene.DbGene
import hpo.api.term.DbTerm
import org.apache.commons.lang.time.StopWatch
import org.hibernate.SessionFactory

@GrailsCompileStatic
class HpoTermService {

  HpoOntology hpoOntology
  SqlUtilsService sqlUtilsService
  SessionFactory sessionFactory
  /**
   * Search For a Term By HPO ID
   *
   * @param TrimmedQ the HPO ID
   * @return DBTerm (for Relations) and Term (for Details)
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
  /**
   * Search For Associated Genes By Term
   *
   * @param TrimmedQ the HPO ID
   * @return genes: List of Genes Associated to Term
   */
  List<DbGene> searchGenesByTerm(String trimmedQ){
    List<DbGene> genes = []
    if (trimmedQ.startsWith('HP:')) {
      final Term term = this.hpoOntology.termMap.get(ImmutableTermId.constructWithPrefix(trimmedQ))
      final List<DbTerm> descendantTerms = findTermDescendants(term)

      if (descendantTerms) {
        genes = findDbGenes(descendantTerms)
      }
    }

    log.info("Associated gene count = " + genes.size()  + " for term " + trimmedQ)
    return genes
  }
  /**
   * Search For Associated Diseases By Term
   *
   * @param TrimmedQ the HPO ID
   * @return genes: List of Diseases Associated to Term
   */
  List<DbDisease> searchDiseasesByTerm(String trimmedQ){
    List<DbDisease> diseases = []
    if (trimmedQ.startsWith('HP:')) {
      final Term term = this.hpoOntology.termMap.get(ImmutableTermId.constructWithPrefix(trimmedQ))
      final List<DbTerm> descendantTerms = findTermDescendants(term)

      if (descendantTerms) {
        diseases = findDbDiseases(descendantTerms)
      }
    }
    log.info("Associated disease count = " + diseases.size()  + " for term " + trimmedQ)
    return diseases
  }

  /**
   * Given the term find all its term descendants from the ontology
   * @param term
   * @return List of DbTerm objects
   */
  private List<DbTerm> findTermDescendants(Term term){
    final StopWatch stopWatch = new StopWatch()
    stopWatch.start()

    List<DbTerm> descendantTerms = []
    final Set<TermId> termIds = OntologyTerms.childrenOf(term.id, this.hpoOntology)
    final List<String>  termIdList = termIds*.getIdWithPrefix()

    if (termIdList) {
      descendantTerms = DbTerm.findAllByOntologyIdInList(termIdList)
    }

    log.info("Find term descendant duration = " + stopWatch)
    descendantTerms
  }

  /**
   * Given the list of DbTerms find associated diseases
   * @param terms
   * @return list of DBDisease sorted by disease name asc
   */
  private List<DbDisease> findDbDiseases(List<DbTerm> terms){

    final StopWatch stopWatch = new StopWatch()
    stopWatch.start()
    final List<DbDisease> diseaseList = []
    final List<Long> diseaseIdList = getDiseaseListForAssociatedTerms(terms)

    if (diseaseIdList) {
      diseaseList = DbDisease.findAllByIdInList(diseaseIdList, [sort: 'diseaseName', order: 'asc'])
    }

    log.info("Find associated diseases duration = " + stopWatch)
    return diseaseList
  }

  /**
   * Given a list of DBTerms, it constructs a sql query and executes to obtain a list of associated disease Ids
   * @param terms
   * @return List of disease Ids
   */
  private List<Long> getDiseaseListForAssociatedTerms(List<DbTerm> terms){

    final String placeholders = terms*.id.collect{'?'}.join(',')
    final String query = """
      select db_disease_id from db_term_db_diseases
      where db_term_id in ( ${placeholders})
    """

    final List<GroovyRowResult> rows = sqlUtilsService.executeQuery(query, terms*.id as List<Object>)
    final List<Long> diseaseIdList = rows.collect{row->
      row.db_disease_id
    } as List<Long>

    diseaseIdList
  }

  /**
   * Given the list of DbTerms find associated genes
   * @param terms
   * @return list of DbGenes sorted by entrezGeneSymbol asc
   */
  private List<DbGene> findDbGenes(List<DbTerm> terms) {
    final StopWatch stopWatch = new StopWatch()
    stopWatch.start()
    final List<DbGene> geneList = []
    final List<Long> geneIdList = getGeneListForAssociatedTerms(terms)
    if (geneIdList) {
      geneList = DbGene.findAllByIdInList(geneIdList, [sort: 'entrezGeneSymbol', order: 'asc'])
    }
    log.info("Find associated genes duration = " + stopWatch)
    geneList
  }

  /**
   * Given a list of DBTerms, it constructs a sql query and executes to obtain a list of associated gene Ids
   * @param terms
   * @return
   */
  private List<Long> getGeneListForAssociatedTerms(List<DbTerm> terms){

    final String placeholders = terms*.id.collect{'?'}.join(',')
    final String query = """
      select db_gene_id from db_term_db_genes
      where db_term_id in ( ${placeholders})
    """

    List<GroovyRowResult> rows = sqlUtilsService.executeQuery(query, terms*.id as List<Object>)
    final List<Long> geneIdList = rows.collect{row->
      row.db_gene_id
    } as List<Long>

    geneIdList
  }

}

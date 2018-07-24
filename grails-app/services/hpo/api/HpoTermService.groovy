package hpo.api

import org.monarchinitiative.phenol.formats.hpo.HpoOntology
import org.monarchinitiative.phenol.ontology.algo.OntologyTerms
import org.monarchinitiative.phenol.ontology.data.Term
import org.monarchinitiative.phenol.ontology.data.TermId

import grails.compiler.GrailsCompileStatic
import groovy.sql.GroovyRowResult
import hpo.api.db.utils.SqlUtilsService
import hpo.api.disease.DbDisease
import hpo.api.gene.DbGene
import hpo.api.term.DbTerm
import org.apache.commons.lang.time.StopWatch
import org.grails.plugins.web.interceptors.InterceptorsGrailsPlugin
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
        Term term = this.hpoOntology.termMap.get(TermId.constructWithPrefix(trimmedQ))
        result.put("TERM",term)
        result.put("DBTERM",dbterm)
        return result
      }
    return result
  }
  /**
   * Search For Associated Genes By Term
   * @param offset -- for paging
   * @param max -- for paging
   * @param TrimmedQ the HPO ID
   * @return Map [List of Genes Associated with given term, total gene count, given offset, given max]
   */
  Map<String, Object> searchGenesByTerm(String trimmedQ, Integer offset, Integer max){

    Map<String, Object> resultMap = [genes:[], geneCount:0, offset:offset, max:max]
    if (trimmedQ.startsWith('HP:')) {
      final Term term = this.hpoOntology.termMap.get(TermId.constructWithPrefix(trimmedQ))
      final List<DbTerm> descendantTerms = findTermDescendants(term)

      if (descendantTerms) {
        Map<String, Object> queryResults= findDbGenes(descendantTerms, offset, max)
        resultMap.genes = queryResults.geneList
        resultMap.geneCount = queryResults.geneCount
      }
    }

    log.info("Associated gene count = " + resultMap.geneCount  + " for term " + trimmedQ)
    return resultMap
  }
  /**
   * Search For Associated Diseases By Term
   *
   * @param TrimmedQ the HPO ID
   * @param offset -- for paging
   * @param max -- for paging
   * @return result Map [list of diseases associated with given term, total disease count, given offset, given max]
   */
  Map<String, Object> searchDiseasesByTerm(String trimmedQ, Integer offset, Integer max){

    Map<String, Object> resultMap = [diseases:[], diseaseCount:0, offset:offset, max:max]
    if (trimmedQ.startsWith('HP:')) {
      final Term term = this.hpoOntology.termMap.get(TermId.constructWithPrefix(trimmedQ))
      final List<DbTerm> descendantTerms = findTermDescendants(term)

      if (descendantTerms) {
        Map<String, Object> queryResults= findDbDiseases(descendantTerms, offset, max)
        resultMap.diseases = queryResults.diseaseList
        resultMap.diseaseCount = queryResults.diseaseCount
      }
    }

    log.info("Associated disease count = " + resultMap.diseaseCount  + " for term " + trimmedQ)
    return resultMap
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
   * @param offset -- for paging
   * @param max -- for paging
   * @return a Map with list of DBDisease sorted by disease name asc and total disease count
   */
  private Map<String, Object> findDbDiseases(List<DbTerm> terms, Integer offset, Integer max){

    final StopWatch stopWatch = new StopWatch()
    stopWatch.start()

    final Map<String, Object> resultMap = [diseaseList:[], diseaseCount:0]
    final List<DbDisease> diseaseList = []
    final List<Long> diseaseIdList = getDiseaseListForAssociatedTerms(terms)

    if (diseaseIdList) {
      diseaseList = DbDisease.findAllByIdInList(diseaseIdList, [offset:offset, max:max, sort: 'diseaseName', order: 'asc'])
      resultMap.diseaseCount = diseaseIdList.size()
    }
    resultMap.diseaseList = diseaseList

    log.info("Find associated diseases duration = " + stopWatch)
    return resultMap
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

    diseaseIdList.unique()
  }

  /**
   * Given the list of DbTerms find associated genes
   * @param terms
   * @param offset -- for paging
   * @param max -- for paging
   * @return Map with list of DbGenes sorted by entrezGeneSymbol asc and total gene count
   */
  private Map<String, Object> findDbGenes(List<DbTerm> terms, Integer offset, Integer max) {
    final StopWatch stopWatch = new StopWatch()
    stopWatch.start()
    final Map<String, Object> resultMap = [geneList:[], geneCount:0]
    final List<DbGene> geneList = []
    final List<Long> geneIdList = getGeneListForAssociatedTerms(terms)
    if (geneIdList) {
      geneList = DbGene.findAllByIdInList(geneIdList, [offset:offset, max:max, sort: 'entrezGeneSymbol', order: 'asc'])
      resultMap.geneCount = geneIdList.size()
    }

    resultMap.geneList = geneList
    log.info("Find associated genes duration = " + stopWatch)
    resultMap
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

    geneIdList.unique()
  }

}

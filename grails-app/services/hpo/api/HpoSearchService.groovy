package hpo.api

import grails.compiler.GrailsCompileStatic
import groovy.sql.GroovyRowResult
import groovy.transform.TypeCheckingMode
import hpo.api.db.utils.SqlUtilsService
import hpo.api.disease.DbDisease
import hpo.api.gene.DbGene
import hpo.api.term.DbTerm
import hpo.api.util.HpoUtilities
import org.apache.commons.lang.StringUtils
import org.grails.datastore.mapping.query.api.BuildableCriteria
import hpo.api.model.SearchTermResult
import org.monarchinitiative.phenol.formats.hpo.HpoOntology
import org.monarchinitiative.phenol.ontology.data.TermId

@GrailsCompileStatic
class HpoSearchService {

  SqlUtilsService sqlUtilsService
  HpoOntology hpoOntology
  HpoUtilities hpoUtilities
    /**
     * Given a search query string, it executes domain object searches for terms, diseases and genes.
     * The given string is split by white spaces to form a list of terms. These are used to dynamically build a matching criteria.
     * @param searchTerm
     * @return Map
     */
    Map<String, Map> searchAll(String searchTerm, Integer offsetIn = 0, Integer maxIn = 10) {

      final Map<String, Map> resultMap = ['terms': [data:[]] as Map, 'diseases': [data:[]] as Map, 'genes': [data:[]] as Map]


      List<String> inputTerms = trimAndSplit(searchTerm)
      if (inputTerms) {
        resultMap.put('terms', searchTermAll(inputTerms, offsetIn, maxIn))
        resultMap.put('diseases', searchDiseasesAll(inputTerms, offsetIn, maxIn))
        resultMap.put('genes', searchGenesAll(inputTerms, offsetIn, maxIn))
      }
      return resultMap
    }

    protected static List<String> trimAndSplit(String query){
      final String trimmedQ = StringUtils.trimToNull(query)
      if(trimmedQ){
        List<String> inputTerms = trimmedQ.split('\\s').toList()
        return inputTerms
      }else{
        return null
      }
    }

    /**
     * Builds and executes a query against DbDisease domain object to return Disease by the disease name.
     * All terms in the given list must be part of the name.
     * Supports paging with offset and max result set params
     * @param terms
     * @param offsetIn
     * @param maxIn
     * @return Map (total count, data<result set list>, offset)
     */
      @GrailsCompileStatic(TypeCheckingMode.SKIP)
      private Map searchDiseasesAll(List<String> terms , int offsetIn = 0, int maxIn = 10) {

        final List<DbDisease> diseaseResults = []
        final Map resultsMap = [:]
        Map params = [:]
        params.max = maxIn // if -1, all results are returned
        params.offset = offsetIn
        params.sort = 'diseaseName'
        params.order = 'asc'

        BuildableCriteria c = DbDisease.createCriteria()
        def results = []
        def firstUpper = terms[0].toUpperCase();
        if(firstUpper.startsWith('OMIM:') || firstUpper.startsWith("ORPHA:") || firstUpper.startsWith("MONDO:")){
          results = c.list(max: params.max, offset: params.offset) {
            ilike('diseaseId', terms[0] + '%')
            order(params.sort, params.order)
          }
        }else{
           results = c.list(max: params.max, offset: params.offset) {
            for (term in terms) {
              ilike('diseaseName', '%' + term + '%')
            }
            order(params.sort, params.order)
          }
        }


        int totalCount = results.totalCount
        diseaseResults.addAll(results as List<DbDisease>)
        diseaseResults.unique()

        resultsMap.put('data', diseaseResults)
        resultsMap.put('totalCount', totalCount)
        resultsMap.put('offset', offsetIn)

        return resultsMap

      }

    /**
     * Builds and executes a query against DbTerm domain object to return Terms by ontology Id or the term name.
     * Searching by ontology ID, the string must match the 'HP:' suffix, only the first item in the list is considered
     * Searching by name, all terms in the given list must be part of the name and also searches synonyms
     * Supports paging with offset and max result set params
     * @param terms
     * @param offsetIn
     * @param maxIn
     * @return Map (total count, data<result set list>, offset)
     */
    @GrailsCompileStatic(TypeCheckingMode.SKIP)
    public Map searchTermAll(List<String> terms, int offsetIn = 0, int maxIn = 10) {


      List termResults = []
      final Map resultsMap = [:]
      Map params = [:]
      params.max = maxIn // if -1, all results are returned
      params.offset = offsetIn
      params.sort = 'numberOfChildren'
      params.sortPS = 'number_of_children'
      params.order = 'desc'

      if(terms[0].toUpperCase().startsWith('HP:')){
        terms[0] = hpoUtilities.checkReturnPrimaryId(terms[0].toUpperCase())
        BuildableCriteria c = DbTerm.createCriteria()
        termResults = c.list(max: params.max, offset: params.offset) {
          ilike('ontologyId', terms[0] + '%')
          order(params.sort, params.order)
        }
        termResults = termResults.collect{ DbTerm term -> new SearchTermResult(term)}
      }else{
        // Search term name join with a search on synonym name.
        def termMap = [:]
        String statement = buildSearchTermsAndSynonymsPS(terms, termMap, params)
        List<GroovyRowResult> results = sqlUtilsService.executeQuery(statement, termMap)
        termResults = results.collect{ it -> new SearchTermResult(it)}
        termResults = filterAndUnique(termResults, maxIn)
      }

      resultsMap.put('data', termResults)
      resultsMap.put('totalCount', termResults.size())
      resultsMap.put('offset', offsetIn)

      return resultsMap
    }

  /***
   * Method to filter synonym and terms results. We want to know if the query matched a term(synonym == null)
   * or a synonym. if it matched both, we will only take the term.
   * If a term has multiple synonyms, take the smallest so long as the term was not matched. ^
   * @param results
   * @param limit
   */

  @GrailsCompileStatic(TypeCheckingMode.SKIP)
    static protected filterAndUnique(List results, int limit){
      def uniqueMap = [:]
      results.each { term ->
        if(!uniqueMap.containsKey(term.ontologyId) || term.synonym == null ){
          // Not in our map drop it in or we found a term with a null synonym which means
          // it has the most importance
          uniqueMap[term.ontologyId] = term
        }else if(uniqueMap.containsKey(term.ontologyId) &&
          uniqueMap[term.ontologyId].synonym != null &&
          uniqueMap[term.ontologyId].synonym.length() > term.synonym.length())
        {
          //in the map, synonym isn't null, and our new snyonym is shorter
          uniqueMap[term.ontologyId] = term
        }
      }
      // Limiter on SQL will not work with this funky logic, requested by @JulieMcMurry (Monarch Initiative)
      if(limit != -1){
        return uniqueMap.values().take(limit).collect()
      }

      return uniqueMap.values().collect()

  }

  /***
   * Builds a prepared statement for searching terms and synonyms
   * @param terms
   * @param termMap
   * @param params
   * @return Sql
   */
    @GrailsCompileStatic(TypeCheckingMode.SKIP)
    static protected buildSearchTermsAndSynonymsPS(List<String> terms, termMap, params){
      String synonymLikeSQL = ""
      String termLikeSQL = ""

      termMap.put('term0', "%" + terms[0] + "%");
      if(terms.size() > 1){
        for(def i=0; i < terms.size(); i++){
          if(i != 0){
            termMap.put('term' + i, "%" + terms[i] + "%");
            synonymLikeSQL += 'AND s.synonym LIKE :' + "term" + i + " "
            termLikeSQL += 'AND t.name LIKE :' + "term" + i + " "
          }
        }
      }

      String statement = "SELECT * FROM ( SELECT t.ontology_id, t.name, t.id, t.number_of_children, NULL as synonym " +
        "FROM db_term t WHERE t.name LIKE :term0 " + termLikeSQL +
        "UNION SELECT t.ontology_id, t.name, t.id, t.number_of_children, s.synonym FROM db_term t " +
        "RIGHT JOIN db_term_synonym s " +
        "ON t.id = s.db_term_id " +
        "WHERE s.synonym LIKE :term0 " + synonymLikeSQL +
        ") AS result_table ORDER BY " + params.sortPS + " " + params.order + ", name " + params.order


      return statement
    }

    /**
     * Builds and executes a query against DbGenes domain object to return genes by the entrezGeneSymbol.
     * All terms in the given list must be part of the entrezGeneSymbol.
     * Supports paging with offset and max result set params
     * @param terms
     * @param offsetIn
     * @param maxIn
     * @return Map (total count, data<result set list>, offset)
     */
      @GrailsCompileStatic(TypeCheckingMode.SKIP)
      private Map searchGenesAll(List<String> terms, int offsetIn = 0, int maxIn = 10) {

        final List<DbTerm> geneResults = []
        final Map resultsMap = [:]
        Map params = [:]
        params.max = maxIn // if -1, all results are returned
        params.offset = offsetIn
        params.sort = 'entrezGeneSymbol'
        params.order = 'asc'

        BuildableCriteria c = DbGene.createCriteria()
        def results = c.list(max: params.max, offset: params.offset) {
          if(terms.size() == 1 && terms[0].isInteger()){
            eq('entrezGeneId', terms[0].toInteger())
          }else{
            for (term in terms) {
              ilike('entrezGeneSymbol', '%' + term + '%')
            }
          }
          order(params.sort, params.order)
        }
        int totalCount = results.totalCount

        geneResults.addAll(results as List<DbGene>)
        geneResults.unique()

        resultsMap.put('data', geneResults)
        resultsMap.put('totalCount', totalCount)
        resultsMap.put('offset', offsetIn)

        return resultsMap
      }

}

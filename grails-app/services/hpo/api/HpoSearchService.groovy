package hpo.api

import grails.compiler.GrailsCompileStatic
import groovy.transform.TypeCheckingMode
import hpo.api.disease.DbDisease
import hpo.api.gene.DbGene
import hpo.api.term.DbTerm
import org.apache.commons.lang.StringUtils
import org.grails.datastore.mapping.query.api.BuildableCriteria
import org.hibernate.sql.JoinType

@GrailsCompileStatic
class HpoSearchService {


    /**
     * Given a search query string, it executes domain object searches for terms, diseases and genes.
     * The given string is split by white spaces to form a list of terms. These are used to dynamically build a matching criteria.
     * @param searchTerm
     * @return Map
     */
    Map<String, Map> searchAll(String searchTerm, Integer offsetIn = 0, Integer maxIn = 10) {

      final Map<String, Map> resultMap = ['terms': [data:[]] as Map, 'diseases': [data:[]] as Map, 'genes': [data:[]] as Map]
      final String trimmedQ = StringUtils.trimToNull(searchTerm)

      if (trimmedQ) {
        List<String> inputTerms = trimmedQ.split('\\s').toList()
        resultMap.put('terms', searchTermsAll(inputTerms, offsetIn, maxIn))
        resultMap.put('diseases', searchDiseasesAll(inputTerms, offsetIn, maxIn))
        resultMap.put('genes', searchGenesAll(inputTerms, offsetIn, maxIn))
      }
      return resultMap

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
        def results = c.list(max: params.max, offset: params.offset) {
          for (term in terms) {
            ilike('diseaseName', '%' + term + '%')
          }
          order(params.sort, params.order)
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
     * Searching by name, all terms in the given list must be part of the name.
     * Supports paging with offset and max result set params
     * @param terms
     * @param offsetIn
     * @param maxIn
     * @return Map (total count, data<result set list>, offset)
     */
    @GrailsCompileStatic(TypeCheckingMode.SKIP)
      private Map searchTermsAll(List<String> terms, int offsetIn = 0, int maxIn = 10) {

        final List<DbTerm> termResults = []
        final Map resultsMap = [:]
        Map params = [:]
        params.max = maxIn // if -1, all results are returned
        params.offset = offsetIn
        params.sort = 'numberOfChildren'
        params.order = 'desc'

        // Search the term table
        BuildableCriteria c = DbTerm.createCriteria()
        def results = c.list(max: params.max, offset: params.offset) {
          if (terms[0].startsWith('HP:')) {
            ilike('ontologyId', terms[0] + '%')
          } else {
            and {
              for (term in terms) {
                ilike('name', '%' + term + '%')
              }
            }
          }
          order(params.sort, params.order)
        }

        def synResults = []
        // Search the synonyms with the entire string
        // if we find something. Only suggest that one.
        BuildableCriteria s = DbTerm.createCriteria()
        synResults = s.list(max: params.max, offset: params.offset) {
          dbTermSynonyms {
            ilike("synonym", '%'+ terms.join(' ') + '%')
          }
          order(params.sort, params.order)
        }
        synResults.unique()
        if(synResults.size() == 1){
          results = synResults
        }

        termResults.addAll(results as List<DbTerm>)
        termResults.unique()
        resultsMap.put('data', termResults)
        resultsMap.put('totalCount', termResults.size())
        resultsMap.put('offset', offsetIn)

        return resultsMap
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

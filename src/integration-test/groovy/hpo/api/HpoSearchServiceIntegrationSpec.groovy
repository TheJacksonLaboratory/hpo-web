package hpo.api

import grails.gorm.transactions.Rollback
import grails.testing.mixin.integration.Integration
import groovy.sql.Sql
import hpo.api.db.utils.SqlUtilsService
import hpo.api.term.DbTerm
import hpo.api.term.DbTermSynonym
import org.hibernate.Session
import org.hibernate.SessionFactory
import spock.lang.Specification
import spock.lang.Unroll

import javax.sql.DataSource

@Integration
@Rollback
@Unroll
class HpoSearchServiceIntegrationSpec extends Specification {

    HpoSearchService hpoSearchService

    def setup(){
    }

    def setupData() {
      DbTerm.withTransaction {
        DbTerm term1 = new DbTerm(name: 'Microcephaly', ontologyId: 'HP:000222333444XX', numberOfChildren: 30)
        term1.save(flush: true, failOnError:true)
        new DbTermSynonym(term1, "small skull").save(flush: true, failOnError:true)
        DbTerm term2 = new DbTerm(name: 'Congential Microcephaly', ontologyId: 'HP:000222333XX', numberOfChildren: 20).save(flush: true, failOnError:true)
        term2.save(flush: true, failOnError: true)
        new DbTermSynonym(term2 , "small cranium").save(flush:true, failOnError: true)
        new DbTerm(name: 'Progressive Microcephaly', ontologyId: 'HP:000222XX', numberOfChildren: 10).save(flush: true, failOnError:true)
      }
    }

    def cleanup() {
    }

    void "test our search terms service #desc"() {
      given:
        setupData()
      when:
        Map resultMap = [:]
        query = hpoSearchService.trimAndSplit(query)
        resultMap = hpoSearchService.searchTermAll(query)


      then:
      resultMap.data*.name == expected

      where:
        query           | expected                                                                        | desc
        'micro'         | ['Microcephaly', 'Congential Microcephaly', 'Progressive Microcephaly']         | "all three"
        'Congential'    | ['Congential Microcephaly']                                                     | "just one"
        'small skull'   | ['Microcephaly']                                                                | "synonym"
        'skull small'   | ['Microcephaly']                                                                | "synyonm reverse order"
        'small'         | ['Microcephaly', 'Congential Microcephaly']                                     | "synyonm partial two"
    }

}

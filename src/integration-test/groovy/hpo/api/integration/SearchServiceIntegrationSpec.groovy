package hpo.api.integration

import grails.gorm.transactions.Rollback
import grails.testing.mixin.integration.Integration
import hpo.api.SearchService
import spock.lang.Specification
import spock.lang.Unroll

@Integration
@Rollback
@Unroll
class SearchServiceIntegrationSpec extends Specification {

    SearchService hpoSearchService

    def setup(){
    }

    /*
     **********************
     Definitive Testing would be great if we didn't have to commit the data for SQL queries to see it.
     Subsequently.. in a ci-environment.. build will execute all integration tests. In essence to save
     build command complexity. We will use data we expect from the ontology to verify.

     This could change but I believe the trade off for build complexity will be worth it.
     **********************

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
    } */

    def cleanup() {
    }

    void "test our search terms service #desc"() {
      when:
        Map resultMap = [:]
        query = hpoSearchService.trimAndSplit(query)
        resultMap = hpoSearchService.searchTermAll(query)


      then:
      resultMap.data*.name == expected

      where:
        query           | expected                                                                                                      | desc
        'small skull'   | ['Microcephaly', "Small flat posterior fossa", "Progressive microcephaly", "Congenital microcephaly"]         | "synonym small skull"
        'sore mouth'    | ['Oral ulcer', "Angular cheilitis"]                                                                           | "synonym sore mouth"
        'small nose'    | ['Short nose', "Hypoplastic nasal tip", "Hypoplastic nasal septum", "Hypoplastic nasal bridge"]               | "synonym small nose"
        'short fore'    | ['Forearm undergrowth', "Ventral shortening of foreskin", "Short forearm"]                                    | "synonym short fore"
        'eyeball size'  | ['Abnormality of globe size', 'Microphthalmia', 'Bilateral microphthalmos']                                   | "synonym eyeball size"
    }

}

package hpo.api.integration

import com.github.phenomics.ontolib.formats.hpo.HpoOntology
import grails.testing.mixin.integration.Integration
import grails.testing.services.ServiceUnitTest
import hpo.api.HpoTermDetailsService
import hpo.api.util.HpoOntologyFactory
import spock.lang.Shared
import spock.lang.Specification
@Integration
class HpoTermDetailsServiceIntegrationSpec extends Specification implements ServiceUnitTest<HpoTermDetailsService>{

    @Shared
    HpoOntology hpoOntology
    def setupSpec(){
        hpoOntology = new HpoOntologyFactory().getInstance()
   }
    def setup() {
        service.hpoOntology = hpoOntology
    }

    def cleanup() {
    }

    void "test search term"() {
        Map resultTerm = service.searchTerm(query)
        expect: "fix me"
        resultTerm.term.name == expected
        where:
        query                 | expected                   | desc
        /*null                  | []                       | 'null'
        ' '                   | []                         | 'blank'
        '   '                 | []                         | 'blank'
        '   \n'               | []                         | 'blank'*/
        'HP:0002862'          | 'Bladder carcinoma'        | 'exact id'
    }
    void "test search term assoc genes"(){
      Map resultTerm = service.searchTerm(query)
      expect: "fix me"
      resultTerm.geneAssoc.entrezGeneId == expected
      where:
      query                 | expected                                                                                                         | desc
      'HP:0002862'          | [538,3265,8313,207,324,701,1499,1630,2033,10395,2261,3845,201163,4893,5290,5728,5925,79719,55612,6714,7157,7373] | 'exact id'
    }
}

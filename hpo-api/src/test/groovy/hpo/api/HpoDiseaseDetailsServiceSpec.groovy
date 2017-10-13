package hpo.api

import com.github.phenomics.ontolib.formats.hpo.HpoDisease
import com.github.phenomics.ontolib.formats.hpo.HpoDiseaseAnnotation
import grails.testing.services.ServiceUnitTest
import hpo.api.util.HpoDiseaseFactory
import spock.lang.Shared
import spock.lang.Specification

class HpoDiseaseDetailsServiceSpec extends Specification implements ServiceUnitTest<HpoDiseaseDetailsService>{

    @Shared
    List<HpoDiseaseAnnotation> hpoDiseases
    def setupSpec(){
        hpoDiseases = new HpoDiseaseFactory().getInstance()
    }
    def setup() {
        service.hpoDiseases = hpoDiseases
    }

    def cleanup() {
    }

    void "test search term details #desc"() {

        final List<HpoDiseaseAnnotation> diseaseResult = service.searchDisease(query)
        HpoDisease
        expect: "fix me"
        diseaseResult[0].dbReference == expected

        where:
        query                 | expected                                                                                        | desc
        /*null                  | []                                                                                              | 'null'
        ' '                   | []                                                                                              | 'blank'
        '   '                 | []                                                                                              | 'blank'
        '   \n'               | []                                                                                              | 'blank'*/
        'OMIM:158350'         | 'OMIM:158350'                                                                                   | 'exact id'
    }
}

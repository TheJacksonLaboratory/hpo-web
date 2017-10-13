package hpo.api

import com.github.phenomics.ontolib.formats.hpo.HpoDiseaseAnnotation
import com.github.phenomics.ontolib.formats.hpo.HpoGeneAnnotation
import com.github.phenomics.ontolib.formats.hpo.HpoOntology
import grails.testing.services.ServiceUnitTest
import hpo.api.util.HpoDiseaseFactory
import hpo.api.util.HpoGeneFactory
import hpo.api.util.HpoOntologyFactory
import spock.lang.Shared
import spock.lang.Specification
import com.github.phenomics.ontolib.ontology.data.Term

class HpoTermDetailsServiceSpec extends Specification implements ServiceUnitTest<HpoTermDetailsService>{

    @Shared
    HpoOntology hpoOntology
    /*@Shared
    List<HpoDiseaseAnnotation> hpoDiseases
    @Shared
    List<HpoGeneAnnotation> hpoGenes*/
    def setupSpec(){
        hpoOntology = new HpoOntologyFactory().getInstance()
        /*hpoDiseases = new HpoDiseaseFactory().getInstance()
        hpoGenes = new HpoGeneFactory().getInstance()*/
    }
    def setup() {
        service.hpoOntology = hpoOntology
       /* service.hpoDiseases = hpoDiseases
        service.hpoGenes = hpoGenes*/
    }

    def cleanup() {
    }

    void "test search term details #desc"() {

        final Term resultTerm = service.searchTerms(query)

        expect: "fix me"
        resultTerm.name == expected

        where:
        query                 | expected                                                                                        | desc
        /*null                  | []                                                                                              | 'null'
        ' '                   | []                                                                                              | 'blank'
        '   '                 | []                                                                                              | 'blank'
        '   \n'               | []                                                                                              | 'blank'*/
        'HP:0002862'          | 'Bladder carcinoma'                                                                             | 'exact id'
    }
}

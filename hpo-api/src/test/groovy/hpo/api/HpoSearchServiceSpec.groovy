package hpo.api

import com.github.phenomics.ontolib.formats.hpo.HpoDiseaseAnnotation
import com.github.phenomics.ontolib.formats.hpo.HpoOntology
import com.github.phenomics.ontolib.ontology.data.Term
import grails.testing.services.ServiceUnitTest
import grails.testing.spring.AutowiredTest
import hpo.api.util.HpoAnnotationFactory
import hpo.api.util.HpoOntologyFactory
import spock.lang.Shared
import spock.lang.Specification
import spock.lang.Unroll

@Unroll
class HpoSearchServiceSpec extends Specification implements ServiceUnitTest<HpoSearchService>{

    @Shared
    HpoOntology hpoOntology
    @Shared List<HpoDiseaseAnnotation> hpoDiseaseAnnotations

    HpoSearchServiceSpec() {}

    def setupSpec() {
        hpoOntology = HpoOntologyFactory.getInstance()
        hpoDiseaseAnnotations = HpoAnnotationFactory.getAnnotationInstance()
    }

    def setup() {
        service.hpoOntology = hpoOntology
        service.hpoDiseaseAnnotations = hpoDiseaseAnnotations
    }

    void "test searchAll terms #desc"() {

        final Map resultMap = service.search(query)

        expect: "fix me"
        resultMap.terms*.name == expected

        where:
        query                 | expected                                                                                        | desc
        null                  | []                                                                                              | 'null'
        ' '                   | []                                                                                              | 'blank'
        '   '                 | []                                                                                              | 'blank'
        '   \n'               | []                                                                                              | 'blank'

        'Abnormality of body' | ['Abnormality of body height', 'Abnormality of body weight', 'Abnormality of body mass index',] | 'with uppercase'
        'abnormality of body' | ['Abnormality of body height', 'Abnormality of body weight', 'Abnormality of body mass index',] | 'with lower case'
        'HP:0000003'          | ['Multicystic kidney dysplasia']                                                                | 'hp id'
    }
    void "test searchAll diseases #desc"() {

        final Map resultMap = service.search(query)

        expect: "fix me"
        resultMap.diseases*.dbName == expected

        where:
        query                 | expected                                                                                        | desc
        null                  | []                                                                                              | 'null'
        ' '                   | []                                                                                              | 'blank'
        '   '                 | []                                                                                              | 'blank'
        '   \n'               | []                                                                                              | 'blank'
        'Grant'               | ['GRANT SYNDROME', 'Grant syndrome']                                                            | 'with uppercase'
        'grant'               | ['GRANT SYNDROME', 'Grant syndrome']                                                            | 'with lowercase'
    }
}

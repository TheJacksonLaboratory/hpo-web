package hpo.api.unit

import com.github.phenomics.ontolib.formats.hpo.HpoDiseaseAnnotation
import com.github.phenomics.ontolib.formats.hpo.HpoGeneAnnotation
import com.github.phenomics.ontolib.formats.hpo.HpoOntology
import grails.testing.services.ServiceUnitTest
import hpo.api.HpoSearchService
import hpo.api.util.HpoDiseaseFactory
import hpo.api.util.HpoGeneFactory
import hpo.api.util.HpoOntologyFactory
import spock.lang.Shared
import spock.lang.Specification
import spock.lang.Unroll

@Unroll
class HpoSearchServiceSpec extends Specification implements ServiceUnitTest<HpoSearchService> {

    @Shared
    HpoOntology hpoOntology
    @Shared
    List<HpoDiseaseAnnotation> hpoDiseases
    @Shared
    List<HpoGeneAnnotation> hpoGenes

    HpoSearchServiceSpec() {}

    def setupSpec() {
        hpoOntology = new HpoOntologyFactory().getInstance()
        hpoDiseases = new HpoDiseaseFactory().getInstance()
        hpoGenes = new HpoGeneFactory().getInstance()
    }
    def setup() {
        service.hpoOntology = hpoOntology
        service.hpoDiseases = hpoDiseases
        service.hpoGenes = hpoGenes
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
        query   | expected                             | desc
        null    | []                                   | 'null'
        ' '     | []                                   | 'blank'
        '   '   | []                                   | 'blank'
        '   \n' | []                                   | 'blank'
        'Grant' | ['GRANT SYNDROME', 'Grant syndrome'] | 'with uppercase'
        'grant' | ['GRANT SYNDROME', 'Grant syndrome'] | 'with lowercase'
    }

    void "test searchAll genes #desc"() {

        final Map resultMap = service.search(query)

        expect: "fix me"
        resultMap.genes*.entrezGeneSymbol == expected

        where:
        query   | expected | desc
        null    | []       | 'null'
        ' '     | []       | 'blank'
        '   '   | []       | 'blank'
        '   \n' | []       | 'blank'
        'TP53'  | ['TP53'] | 'with uppercase'
    }
}

package hpo.api

import grails.testing.spring.AutowiredTest
import grails.testing.web.controllers.ControllerUnitTest
import hpo.api.util.HpoDiseaseFactory
import hpo.api.util.HpoGeneFactory
import hpo.api.util.HpoOntologyFactory
import spock.lang.Specification
import spock.lang.Unroll

@Unroll
class HpoSearchControllerSpec extends Specification implements ControllerUnitTest<HpoSearchController>,AutowiredTest {

    Closure doWithSpring() {
        { ->
            hpoOntologyFactory(HpoOntologyFactory)
            hpoDiseaseFactory(HpoDiseaseFactory)
            hpoGeneFactory(HpoGeneFactory)

            hpoOntology(hpoOntologyFactory: "getInstance")
            hpoDiseases(hpoDiseaseFactory: "getInstance")
            hpoGenes(hpoGeneFactory: "getInstance")
        }
    }

    HpoSearchService hpoSearchService

    void "test search #desc"() {
        when:
        controller.searchAll(query)

        println(response.text)
        println(response.text)

        then:
        controller.getModelAndView().getViewName() == '/hpoSearch/search'
        controller.modelAndView.model.termList*.name == expected

        and:
        controller.response.toString() == ''

        where:
        query                 | expected                                                                                       | desc
        'HP:0000002'          | ['Abnormality of body height']                                                                 | 'by ID'
        'Abnormality of body' | ['Abnormality of body height', 'Abnormality of body weight', 'Abnormality of body mass index'] | 'by term name'
    }
}

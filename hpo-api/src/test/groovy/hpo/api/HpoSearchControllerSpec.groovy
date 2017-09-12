package hpo.api

import com.github.phenomics.ontolib.formats.hpo.HpoOntology
import com.github.phenomics.ontolib.io.obo.hpo.HpoOboParser
import grails.testing.spring.AutowiredTest
import grails.testing.web.controllers.ControllerUnitTest
import hpo.api.util.HpoOntologyFactory
import org.grails.io.support.ClassPathResource
import org.grails.web.json.JSONElement
import spock.lang.Shared
import spock.lang.Specification
import spock.lang.Unroll

@Unroll
class HpoSearchControllerSpec extends Specification implements ControllerUnitTest<HpoSearchController>,AutowiredTest {

    Closure doWithSpring() {
        { ->
            hpoSearchService(HpoSearchService) {
                hpoOntology = HpoOntologyFactory.getInstance()
            }
        }
    }

    HpoSearchService hpoSearchService

    void "test search #desc"() {
        when:
        controller.search(query)

        println(response.text)
        println(response.text)

        then:
        controller.getModelAndView().getViewName() == '/hpoSearch/search'
        controller.modelAndView.model.termList*.name == expected

        where:
        query                 | expected                                                                                       | desc
        'HP:0000002'          | ['Abnormality of body height']                                                                 | 'by ID'
        'Abnormality of body' | ['Abnormality of body height', 'Abnormality of body weight', 'Abnormality of body mass index'] | 'by term name'
    }
}

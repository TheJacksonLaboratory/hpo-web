package hpo.api

import grails.testing.spring.AutowiredTest
import grails.testing.web.controllers.ControllerUnitTest
import hpo.api.term.DbTerm
import spock.lang.Specification
import spock.lang.Unroll

@Unroll
class HpoSearchControllerSpec extends Specification implements ControllerUnitTest<HpoSearchController>, AutowiredTest {

    /**
     * this test, verifies the wiring,
     * so the query gets passed to the service
     * the map returned from the service gets passed to the controller in the ModelView object named as resultMap
     * it also tests the view that's going to be used
     */
    void "test searchAll wiring"() {
        SearchService searchService = Mock()
        controller.searchService = searchService

        when:
        controller.searchAll(query, false)

        then: 'verify the view name'
        1 * searchService.searchAll(query) >> mockReturn
        controller.getModelAndView().getViewName() == '/hpoSearch/searchAll'

        and: 'the map returned by the service is passed in the model as resultMap'
        controller.modelAndView.model.resultMap == expected

        where:
        query       | mockReturn                           | expected
        'some term' | [:]                                  | [:]
        'some term' | [terms: [], genes: [], diseases: []] | [terms: [], genes: [], diseases: []]
    }


    /**
     * this test, verifies the wiring,
     * so the query gets passed to the service
     * the map returned from the service gets passed to the controller in the ModelView object named as resultMap
     * it also tests the view that's going to be used
     */
    void "test search fetch all Results wiring"() {
      SearchService searchService = Mock()
      controller.searchService = searchService

      when:
      controller.searchAll(query, true)

      then: 'verify the view name'
      1 * searchService.searchAll(query, 0, -1) >> mockReturn
      controller.getModelAndView().getViewName() == '/hpoSearch/searchAll'

      and: 'the map returned by the service is passed in the model as resultMap'
      controller.modelAndView.model.resultMap == expected

      where:
      query       | mockReturn                           | expected
      'some term' | [:]                                  | [:]
      'some term' | [terms: [], genes: [], diseases: []] | [terms: [], genes: [], diseases: []]
    }

  void "test searchDescendants wiring"(){
    HpoTermRelationsService service = Mock()
    controller.hpoTermRelationsService = service

    when:
    controller.descendantSearch(anchor, query)

    then: 'verify the view name'
    1 * service.findAllDescendants(anchor, query) >> mockReturn
    controller.getModelAndView().getViewName() == '/hpoSearch/descendants'

    and: 'the map returned by the service is passed in the model as resultMap'
    controller.modelAndView.model.descendantList.size() == expected.size()

    where:
    anchor          | query       | mockReturn                                          | expected
    ''              | 'juvenile'  | []                                                  | []
    'HP:000395'     | 'juvenile'  | [new DbTerm(ontologyId: "HP:000395", name: "fake")] | [new DbTerm(ontologyId: "HP:000395", name: "fake")]
  }
}

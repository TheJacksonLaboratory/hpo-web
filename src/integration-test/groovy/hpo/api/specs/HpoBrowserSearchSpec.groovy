package hpo.api.specs

import grails.testing.mixin.integration.Integration
import grails.transaction.Rollback
import geb.spock.*
import hpo.api.pages.HomePage

/**
 * See http://www.gebish.org/manual/current/ for more instructions
 */

@Integration
@Rollback
class HpoHomeSearchSpec extends  GebReportingSpec {

    def setup() {
    }

    def cleanup() {
    }

    void "test home page landing"() {
        when:"The home page is visited"
            go '/app/index.html'

        then:"The title is correct"
        	title == "HPO"
    }

    void "test term search input" (){

      given:
         HomePage homePage = browser.to(HomePage)

      when:
        homePage.findTermInput.value('limbs')

      then:
        homePage.termResultsPanel.text().startsWith("Terms")
    }

}

package hpo.api.specs

import grails.testing.mixin.integration.Integration
import grails.transaction.Rollback
import hpo.api.pages.BrowserPage
import geb.spock.*

/**
 * See http://www.gebish.org/manual/current/ for more instructions
 */

@Integration
@Rollback
class HpoBrowserSearchSpec extends  GebReportingSpec {

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

    void "test browser page landing" (){

      when:
      BrowserPage browserPage  = browser.to(BrowserPage)

      then:"The JSON response has data"
      browser.at(BrowserPage)

    }

    void "test term search input" (){

      given:
         BrowserPage browserPage = browser.to(BrowserPage)

      when:
        browserPage.findTermInput.value('limbs')

      then:
        browserPage.termResultsPanel.text().startsWith("Terms")
    }

}

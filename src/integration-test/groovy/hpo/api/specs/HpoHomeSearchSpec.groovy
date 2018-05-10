package hpo.api.specs

import geb.spock.GebReportingSpec
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
    when: "The home page is visited"
    go '/app/index.html'

    then: "The title is correct"
    title == "Human Phenotype Ontology"
  }

    void "test term search input" (){

      given:
         HomePage homePage = browser.to(HomePage)

      when:
        waitFor(25, 2){ homePage.findTermInput.value('limbs')}

      then:
        homePage.termResultsPanel.text().startsWith("Terms")
    }

  void "test js and css resource content type response"(){

    when:
    URL url = new URL(browser.getProperty("baseUrl") + uri )
    URLConnection conn = url.openConnection()
    String contentTypeValue = conn.getHeaderField("Content-Type")

    then:
    contentTypeValue == expectedContentType

    where:
    uri                                     | expectedContentType             | desc
    '/app/assets/hammer-time.min.js'        | 'text/javascript;charset=UTF-8' | 'java script file'
    '/app/assets/bootstrap.min.css'         | 'text/css;charset=UTF-8'        | 'css file'
  }

}

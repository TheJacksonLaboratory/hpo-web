package hpo.api.functional.specs

import geb.spock.GebReportingSpec
import grails.testing.mixin.integration.Integration
import hpo.api.functional.pages.HomePage

/**
 * See http://www.gebish.org/manual/current/ for more instructions
 */

@Integration
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
        waitFor(25, 2){ homePage.findTermInput}

      then:
        homePage.findTermInput.value('limbs');

      when:
        waitFor(25, 2){ homePage.termResultsPanel.text().size() != 0 }

      then:
        homePage.termResultsPanel.text().contains("Terms");
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

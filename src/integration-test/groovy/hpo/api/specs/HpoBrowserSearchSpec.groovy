package hpo.api.specs

import geb.spock.GebReportingSpec
import grails.testing.mixin.integration.Integration
import grails.transaction.Rollback
import hpo.api.pages.BrowserPage

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
    when: "The home page is visited"
    go '/app/index.html'

    then: "The title is correct"
    title == "HPO"
  }

  void "test browser page landing"() {

    when:
    BrowserPage browserPage = browser.to(BrowserPage)
    //def prop = $('head script')[0]

    then: "The JSON response has data"
    browser.at(BrowserPage)

  }

  void "test term search input"() {

    given:
    BrowserPage browserPage = browser.to(BrowserPage)

    when:
    browserPage.findTermInput.value('limbs')

    then:
    browserPage.termResultsPanel.text().startsWith("Terms")
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

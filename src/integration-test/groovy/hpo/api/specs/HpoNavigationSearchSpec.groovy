package hpo.api.specs

import geb.spock.GebReportingSpec
import grails.testing.mixin.integration.Integration
import grails.transaction.Rollback

import geb.spock.*
import hpo.api.pages.DownloadsPage

@Integration
@Rollback
class HpoNavigationSearchSpec extends GebReportingSpec {

    def setup() {
    }

    def cleanup() {
    }

    void "test navigation term search input" (){

      given:
      DownloadsPage downloadsPage = browser.to(DownloadsPage)

      when:
      downloadsPage.navSearchBar.value('limbs')

      then:
      downloadsPage.navSearchResults.children(".result")
        .children(".name")[0].text() == "Abnormality of limbs"
    }

}


package hpo.api.specs

import geb.spock.GebReportingSpec
import grails.testing.mixin.integration.Integration
import grails.transaction.Rollback
import hpo.api.pages.DownloadAnnotationsPage
import hpo.api.pages.DownloadOntologyPage

@Integration
@Rollback
class HpoNavigationSearchSpec extends GebReportingSpec {

    def setup() {
    }

    def cleanup() {
    }

    void "test navigation term search input on download annotations page" (){

      given:
      DownloadAnnotationsPage downloadAnnotationPage = browser.to(DownloadAnnotationsPage)

      when:
      downloadAnnotationPage.pageTitle.text() == "Download Annotations"
      downloadAnnotationPage.navSearchBar.value('limbs')

      then:
      waitFor {
        downloadAnnotationPage.navSearchResults.children(".result").children(".name")[0].text() == "Abnormality of limbs"
      }
    }

    void "test navigation to download ontology page" (){
      given:
      DownloadOntologyPage downloadOntologyPage = browser.to(DownloadOntologyPage)

      when:
      downloadOntologyPage.pageTitle.text() == "Download Ontology"
      downloadOntologyPage.navSearchBar.value('eye')

      then:
      waitFor {
        downloadOntologyPage.navSearchResults.children(".result").children(".name")[1].text() == "Abnormal eye morphology"
      }
    }

}


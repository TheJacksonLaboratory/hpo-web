package hpo.api.functional.specs

import geb.spock.GebReportingSpec
import grails.testing.mixin.integration.Integration
import hpo.api.functional.pages.DiseaseDetailsPage


@Integration
class HpoDiseaseDetailsSpec extends  GebReportingSpec {
  def setup() {
  }

  def cleanup() {
  }

  void "test gene association filter" (){

    given:
      DiseaseDetailsPage diseaseDetailsPage = browser.to(DiseaseDetailsPage)

    when:
        //diseaseDetailsPage.loadGeneAssociations()
        waitFor(10){
          diseaseDetailsPage.geneTabElement
          diseaseDetailsPage.geneTabElement.click()
        }
    then:
    waitFor(35, 2) {
      diseaseDetailsPage.genePagingRangeLabelElement.text() == '1 - 4 of 4'

    }

    when:
      waitFor(25, 2){
        diseaseDetailsPage.geneFilterElement.value('RB1')
      }

    then:
      waitFor(25, 2) {
        diseaseDetailsPage.genePagingRangeLabelElement.text() == '1 - 1 of 1'
      }
  }
}

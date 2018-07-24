package hpo.api.specs

import geb.spock.GebReportingSpec
import grails.testing.mixin.integration.Integration
import grails.transaction.Rollback
import hpo.api.pages.GeneDetailsPage


@Integration
@Rollback
class HpoGeneDetailsSpec extends  GebReportingSpec {
  def setup() {
  }

  def cleanup() {
  }

  void "test disease association filter" (){

    given:
      GeneDetailsPage geneDetailsPage = browser.to(GeneDetailsPage)

    when:
        waitFor(10){
          geneDetailsPage.diseaseTabElement
          geneDetailsPage.diseaseTabElement.click()
        }
    then:
    waitFor(25, 2) {
      geneDetailsPage.diseasePagingRangeLabelElement.text() == '1 - 4 of 4'

    }

    when:
      waitFor(25, 2){
        geneDetailsPage.diseaseFilterElement.value('Bladder Cancer')
      }

    then:
      waitFor(25, 2) {
        geneDetailsPage.diseasePagingRangeLabelElement.text() == '1 - 1 of 1'
      }
  }


  void "test term association filter" (){

    given:
    GeneDetailsPage geneDetailsPage = browser.to(GeneDetailsPage)

    when:
    waitFor(10){
      geneDetailsPage.termTabElement
      geneDetailsPage.termTabElement.click()
    }
    then:
    waitFor(25, 2) {
      geneDetailsPage.termPagingRangeLabelElement.text() == '1 - 18 of 18'

    }

    when:
    waitFor(25, 2){
      geneDetailsPage.termFilterElement.value('Leuk')
    }

    then:
    waitFor(25, 2) {
      geneDetailsPage.termPagingRangeLabelElement.text() == '1 - 2 of 2'
    }
  }

}

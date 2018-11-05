package hpo.api.functional.specs

import geb.spock.GebReportingSpec
import grails.testing.mixin.integration.Integration
import hpo.api.functional.pages.TermDetailsPage


@Integration
class HpoTermDetailsSpec extends  GebReportingSpec {
  def setup() {
  }

  def cleanup() {
  }

  void "test disease paging element" (){

    when:
    TermDetailsPage termDetailsPage = browser.to(TermDetailsPage)

    then:
    termDetailsPage.diseasePagingElement.text().startsWith("Displaying")

  }

  void "test gene paging element" (){

    when:
    TermDetailsPage termDetailsPage = browser.to(TermDetailsPage)

    then:
    termDetailsPage.diseasePagingElement.text().startsWith("Displaying")

  }

  void "test disease filter" (){

    when:
    TermDetailsPage termDetailsPage = browser.to(TermDetailsPage)

    then:
    termDetailsPage.diseasePagingElement.text().startsWith("Displaying")

    when:
    termDetailsPage.loadDiseaseAssociations()

    then:
    termDetailsPage.diseasePagingElement.text().startsWith("Displaying")

    when:
    termDetailsPage.loadAllDiseases()

    then:
    termDetailsPage.diseaseFilterElement.value('disability')
    waitFor {
      termDetailsPage.diseasePagingRangeLabelElement.text() == '1 - 5 of 5'
    }
  }
}

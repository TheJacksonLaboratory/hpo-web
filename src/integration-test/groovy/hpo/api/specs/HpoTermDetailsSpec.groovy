package hpo.api.specs

import geb.spock.GebReportingSpec
import grails.testing.mixin.integration.Integration
import grails.transaction.Rollback
import hpo.api.pages.TermDetailsPage


@Integration
@Rollback
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

    when:
    termDetailsPage.diseaseViewAllLink.click()

    then:
    termDetailsPage.diseasePagingElementAll.text().startsWith("Count:")
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
    termDetailsPage.diseasePagingElementAll.text().startsWith("Count:")

    when:
    waitFor(5){termDetailsPage.diseaseFilterElement.value('disability')}

    then:
    waitFor {
      termDetailsPage.diseasePagingRangeLabelElement.text() == '1 - 5 of 5'
    }
  }
}

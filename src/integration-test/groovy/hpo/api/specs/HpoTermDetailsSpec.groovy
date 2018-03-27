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

    when:
    termDetailsPage.loadGeneAssociations()

    then:
    termDetailsPage.genePagingElement.text().startsWith("Displaying")

    when:
    termDetailsPage.loadAllGenes()

    then:
    termDetailsPage.genePagingElementAll.text().startsWith("Count:")

  }
}

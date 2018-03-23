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
    termDetailsPage.diseasePagingElementViewAllLink.click()

    then:
    termDetailsPage.diseasePagingElementAll.text().startsWith("Count:")
  }

  void "test gene paging element" (){

    when:
    TermDetailsPage termDetailsPage = browser.to(TermDetailsPage)

    then:
    termDetailsPage.diseasePagingElement.text().startsWith("Displaying")

    when:
    //termDetailsPage.geneTabElement.click()
    termDetailsPage.loadGeneAssociations()

    then:
    termDetailsPage.genePagingElement.text().startsWith("Displaying")
    println (termDetailsPage.genePagingElement.children("p").children('a'))

    when:
    termDetailsPage.loadAllGenes()
    //termDetailsPage.genePagingElement.children("p").children('a').click()
    // termDetailsPage.genePagingElementViewAllLink.click()
    //termDetailsPage.genePagingElement.children('p').children('a').click()

    then:
    termDetailsPage.genePagingElementAll.text().startsWith("Count:")

  }
}

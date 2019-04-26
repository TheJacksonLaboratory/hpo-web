package hpo.api.functional.specs

import builders.dsl.spreadsheet.query.api.SpreadsheetCriteria
import builders.dsl.spreadsheet.query.api.SpreadsheetCriteriaResult
import builders.dsl.spreadsheet.query.poi.PoiSpreadsheetCriteria
import geb.spock.GebReportingSpec
import grails.testing.mixin.integration.Integration
import hpo.api.HpoSpecHelpers
import hpo.api.functional.pages.GeneDetailsPage


@Integration
class HpoGeneDetailsSpec extends  GebReportingSpec {

  /* If you change api url for term controller download change this */
  final API_DOWNLOAD_EXCEL_GENE_URL = "/api/hpo/download/gene?identifier="

  def setup() {
  }

  def cleanup() {
  }

  void "test disease association filter" (){

    given:
      GeneDetailsPage geneDetailsPage = browser.to(GeneDetailsPage)

    when:
        waitFor(25){
          geneDetailsPage.diseaseTabElement
          geneDetailsPage.diseaseTabElement.click()
        }
    then:
    waitFor(35, 2) {
      geneDetailsPage.diseasePagingRangeLabelElement.text() == '1 - 6 of 6'

    }

    when:
      waitFor(25, 2){
        geneDetailsPage.diseaseFilterElement.value('bladder')
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
    waitFor(25){
      geneDetailsPage.termTabElement
      geneDetailsPage.termTabElement.click()
    }
    then:
    waitFor(25, 2) {
      geneDetailsPage.termPagingRangeLabelElement.text() == '1 - 50 of 60'

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

  def "terms can be downloaded as an excel file from gene association"() {

    given: 'we go to the page'
    GeneDetailsPage geneDetailsPage = browser.to(GeneDetailsPage)

    when: 'clicking export association button'
    waitFor{ geneDetailsPage.downloadAssociationButton.displayed }
    geneDetailsPage.downloadAssociationButton.click()

    then: 'the dialog should open'
    assert geneDetailsPage.downloadAssociationDialog.displayed

    when: 'clicking disease association download'
    def identifier = geneDetailsPage.getPageUrl().split("/").last()
    def association = geneDetailsPage.downloadTermsAssociationButton.text().toLowerCase()
    def url = API_DOWNLOAD_EXCEL_GENE_URL+ identifier + "&association=" + association

    then:
    def excelBytes = downloadBytes(url)

    when: 'if we search for a row for a specific disease'
    ByteArrayInputStream bis = new ByteArrayInputStream(excelBytes);
    SpreadsheetCriteria query = PoiSpreadsheetCriteria.FACTORY.forStream(bis)
    SpreadsheetCriteriaResult result = HpoSpecHelpers.queryExcelSheet(query, 'HP:0000286')

    then: 'a row is found'
    result.cells.size() == 1
    result.cells.first().value.equals('HP:0000286')

  }

  def "diseases can be downloaded as an excel file from gene association"() {

    given: 'we got to the page'
    GeneDetailsPage geneDetailsPage = browser.to(GeneDetailsPage)

    when: 'clicking export association button'
    waitFor{ geneDetailsPage.downloadAssociationButton.displayed }
    geneDetailsPage.downloadAssociationButton.click()

    then: 'the dialog should open'
    assert geneDetailsPage.downloadAssociationDialog.isDisplayed()

    when: 'clicking disease association download'
    String identifier = geneDetailsPage.getPageUrl().split("/").last()
    String association = geneDetailsPage.downloadDiseaseAssociationButton.text().toLowerCase()
    String url = API_DOWNLOAD_EXCEL_GENE_URL + identifier + "&association=" + association

    then:
    def excelBytes = downloadBytes(url)

    when: 'if we search for a row for a specific disease'
    ByteArrayInputStream bis = new ByteArrayInputStream(excelBytes);
    SpreadsheetCriteria query = PoiSpreadsheetCriteria.FACTORY.forStream(bis)
    SpreadsheetCriteriaResult result = HpoSpecHelpers.queryExcelSheet(query, 'OMIM:109800')

    then: 'a row is found'
    result.cells.size() == 1
    result.cells.first().value.equals('OMIM:109800')


  }

}

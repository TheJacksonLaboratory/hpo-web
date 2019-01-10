package hpo.api.functional.specs

import builders.dsl.spreadsheet.query.api.SpreadsheetCriteria
import builders.dsl.spreadsheet.query.api.SpreadsheetCriteriaResult
import builders.dsl.spreadsheet.query.poi.PoiSpreadsheetCriteria
import geb.spock.GebReportingSpec
import grails.testing.mixin.integration.Integration
import hpo.api.HpoSpecHelpers
import hpo.api.functional.pages.DiseaseDetailsPage


@Integration
class HpoDiseaseDetailsSpec extends  GebReportingSpec {

  /* If you change api url for term controller download change this */
  final API_DOWNLOAD_EXCEL_DISEASE_URL = "/api/hpo/download/disease?identifier="


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

  def "genes can be downloaded as an excel file from disease association"() {

    given: 'we go to the page'
    DiseaseDetailsPage diseaseDetailsPage = browser.to(DiseaseDetailsPage)

    when: 'clicking export association button'
    waitFor { diseaseDetailsPage.downloadAssociationButton.displayed }
    diseaseDetailsPage.downloadAssociationButton.click()

    then: 'the dialog should open'
    assert diseaseDetailsPage.downloadAssociationDialog.isDisplayed()

    when: 'clicking gene association download'
    def identifier = diseaseDetailsPage.getPageUrl().split("/").last()
    def association = diseaseDetailsPage.downloadGenesAssociationButton.attr('ng-reflect-dialog-result')
    def url = API_DOWNLOAD_EXCEL_DISEASE_URL+ identifier + "&association=" + association

    then:
    def excelBytes = downloadBytes(url)

    when: 'if we search for a row for a specific disease'
    ByteArrayInputStream bis = new ByteArrayInputStream(excelBytes);
    SpreadsheetCriteria query = PoiSpreadsheetCriteria.FACTORY.forStream(bis)
    SpreadsheetCriteriaResult result = HpoSpecHelpers.queryExcelSheet(query, 'KRAS')

    then: 'a row is found'
    result.cells.size() == 1
    result.cells.first().value.equals('KRAS')

  }

  def "terms can be downloaded as an excel file from disease association"() {

    given: 'we go to the page'
    DiseaseDetailsPage diseaseDetailsPage = browser.to(DiseaseDetailsPage)

    when: 'clicking export association button'
    waitFor { diseaseDetailsPage.downloadAssociationButton.displayed }
    diseaseDetailsPage.downloadAssociationButton.click()

    then: 'the dialog should open'
    assert diseaseDetailsPage.downloadAssociationDialog.isDisplayed()

    when: 'clicking gene association download'
    def identifier = diseaseDetailsPage.getPageUrl().split("/").last()
    def association = diseaseDetailsPage.downloadTermsAssociationButton.attr('ng-reflect-dialog-result')
    def url = API_DOWNLOAD_EXCEL_DISEASE_URL+ identifier + "&association=" + association

    then:
    def excelBytes = downloadBytes(url)

    when: 'if we search for a row for a specific disease'
    ByteArrayInputStream bis = new ByteArrayInputStream(excelBytes);
    SpreadsheetCriteria query = PoiSpreadsheetCriteria.FACTORY.forStream(bis)
    SpreadsheetCriteriaResult result = HpoSpecHelpers.queryExcelSheet(query, 'HP:0000006')

    then: 'a row is found'
    result.cells.size() == 1
    result.cells.first().value.equals('HP:0000006')

  }
}

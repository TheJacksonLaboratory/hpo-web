package hpo.api;

import builders.dsl.spreadsheet.query.api.SpreadsheetCriteria;
import builders.dsl.spreadsheet.query.api.SpreadsheetCriteriaResult;
import hpo.api.HpoExcelService;

class HpoSpecHelpers
{

  static SpreadsheetCriteriaResult queryExcelSheet(SpreadsheetCriteria query, String valueQuery){
    SpreadsheetCriteriaResult result = query.query {
      sheet(HpoExcelService.SHEET_NAME) {
        row {
          cell {
            value valueQuery
          }
        }
      }
    }
    return result
  }
}

package hpo.api

import builders.dsl.spreadsheet.builder.poi.PoiSpreadsheetBuilder
import grails.gorm.transactions.Transactional
import hpo.api.disease.DbDisease
import hpo.api.gene.DbGene

@Transactional
class HpoExcelService {



  public static final String SHEET_NAME = "annotations"
  public static final String HEADERS = "Isbn"
  public static final String HEADER_NAME = "Name"
  public static final String EXCEL_FILE_SUFIX = ".xlsx"
  public static String EXCEL_FILE_PREFIX = ""
  public static String EXCEL_FILENAME = ""

  void setExcelFilePrefixAndName(String prefix){
    EXCEL_FILE_PREFIX = prefix
    EXCEL_FILENAME = EXCEL_FILE_PREFIX + EXCEL_FILE_SUFIX
  }

  void exportExcelGenesFromTerm(OutputStream outs, List<DbGene> genes) {
    File file = File.createTempFile(EXCEL_FILE_PREFIX, EXCEL_FILE_SUFIX)
    PoiSpreadsheetBuilder.create(outs).build {
      sheet(SHEET_NAME) { s ->
        row {
          ["GENE_ID", "GENE_NAME"].each { header ->
            cell {
              value header
            }
          }
        }
        genes.each { gene ->
          row {
            cell(gene.getEntrezGeneId())
            cell(gene.getEntrezGeneSymbol())
          }
        }
      }
    }
    file
  }

  void exportExcelDiseaseFromTerm(OutputStream outs, List<DbDisease> diseases) {
    File file = File.createTempFile(EXCEL_FILE_PREFIX, EXCEL_FILE_SUFIX)
    PoiSpreadsheetBuilder.create(outs).build {
      sheet(SHEET_NAME) { s ->
        row {
          ["DISEASE_ID", "DISEASE_NAME"].each { header ->
            cell {
              value header
            }
          }
        }
        diseases.each { disease ->
          row {
            cell(disease.getDiseaseId())
            cell(disease.getDiseaseName())
          }
        }
      }
    }
    file
  }
}

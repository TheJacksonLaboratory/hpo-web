package hpo.api

import builders.dsl.spreadsheet.builder.poi.PoiSpreadsheetBuilder
import grails.gorm.transactions.Transactional
import hpo.api.disease.DbDisease
import hpo.api.gene.DbGene
import hpo.api.term.DbTerm

@Transactional
class HpoExcelService {

  public static final String SHEET_NAME = "associations"
  public static final String EXCEL_FILE_SUFIX = ".xlsx"
  public static String EXCEL_FILE_PREFIX = ""
  public static String EXCEL_FILENAME = ""

  void setExcelFilePrefixAndName(String prefix){
    EXCEL_FILE_PREFIX = prefix
    EXCEL_FILENAME = EXCEL_FILE_PREFIX + EXCEL_FILE_SUFIX
  }

  void exportExcelGenesFromTerm(OutputStream outs, List<DbGene> genes) {
    PoiSpreadsheetBuilder.create(outs).build { w ->
      w.sheet(SHEET_NAME) { s ->
        s.row { r ->
          ["GENE_ENTREZ_ID", "GENE_SYMBOL", "DISEASE_IDS"].each { header ->
            r.cell(header)
          }
        }
        genes.each { gene ->
          s.row { r ->
            r.cell(gene.getEntrezGeneId())
            r.cell(gene.getEntrezGeneSymbol())
            r.cell(String.join(",", gene.dbDiseases.diseaseId))
          }
        }
      }
    }
  }

  void exportExcelDiseaseFromTerm(OutputStream outs, List<DbDisease> diseases) {
    PoiSpreadsheetBuilder.create(outs).build { w ->
      w.sheet(SHEET_NAME) { s ->
        s.row { r ->
          ["DISEASE_ID", "DISEASE_NAME"].each { header ->
            r.cell(header)
          }
        }
        diseases.each { disease ->
          s.row { r ->
            r.cell(disease.getDiseaseId())
            r.cell(disease.getDiseaseName())
          }
        }
      }
    }
  }

  void exportExcelGenesFromDisease(OutputStream outs, Set<DbGene> genes){
    PoiSpreadsheetBuilder.create(outs).build { w ->
      w.sheet(SHEET_NAME) { s ->
        s.row { r ->
          ["GENE_ENTREZ_ID", "GENE_SYMBOL"].each { header ->
            r.cell(header)
          }
        }
        genes.each { gene ->
          s.row { r ->
            r.cell(gene.getEntrezGeneId())
            r.cell(gene.getEntrezGeneSymbol())
          }
        }
      }
    }
  }

  void exportExcelTermsFromDisease(OutputStream outs, Set<DbTerm> terms, List categories){
    Map<String, String> catMap = getCategoryForTerm(categories);
    PoiSpreadsheetBuilder.create(outs).build { w ->
      w.sheet(SHEET_NAME) { s ->
        s.row { r ->
          ["HPO_TERM_ID", "HPO_TERM_NAME", "CATEGORY"].each { header ->
            r.cell(header)
          }
        }
        terms.each { term ->
          s.row { r ->
            r.cell(term.getOntologyId())
            r.cell(term.getName())
            r.cell(catMap.get(term.getOntologyId()))
          }
        }
      }
    }
  }

  protected static Map<String, String> getCategoryForTerm(List categoryList){
    /* HP Term to Category */
    Map<String, String> catMap = [:]
    categoryList.each { cat ->
      cat.terms.each { term ->
        catMap.put(term.ontologyId, cat.catLabel)
      }
    }
    return catMap;
  }

  void exportDiseaseFromGene(OutputStream outs, Set<DbDisease> diseases){
    PoiSpreadsheetBuilder.create(outs).build { w ->
      w.sheet(SHEET_NAME) { s ->
        s.row { r ->
          ["HPO_TERM_ID", "HPO_TERM_NAME"].each { header ->
            r.cell(header)
          }
        }
        diseases.each { disease ->
          s.row { r ->
            r.cell(disease.diseaseId)
            r.cell(disease.diseaseName)
          }
        }
      }
    }
  }

  void exportTermsFromGene(OutputStream outs, Set<DbTerm> terms){
    PoiSpreadsheetBuilder.create(outs).build { w ->
      w.sheet(SHEET_NAME) { s ->
        s.row { r ->
          ["HPO_TERM_ID", "HPO_TERM_NAME"].each { header ->
            r.cell(header)
          }
        }
        terms.each { term ->
          s.row { r ->
            r.cell(term.getOntologyId())
            r.cell(term.getName())
          }
        }
      }
    }
  }
}

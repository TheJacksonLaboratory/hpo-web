package hpo.api

import grails.config.Config
import grails.core.support.GrailsConfigurationAware
import hpo.api.disease.DbDisease
import org.monarchinitiative.phenol.formats.hpo.HpoDisease

class HpoExcelController implements GrailsConfigurationAware {

    HpoExcelService hpoExcelService
    HpoTermService hpoTermService
    HpoDiseaseDetailsService hpoDiseaseDetailsService

    String xlsxMimeType
    String encoding

    @Override
    void setConfiguration(Config co) {
      xlsxMimeType = co.getProperty('grails.mime.types.xlsxMimeType',
        String,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      encoding = co.getProperty('grails.converters.encoding', String, 'UTF-8')
    }

    def downloadTermAnnotation() {
      response.contentType = "${xlsxMimeType};charset=${encoding}"
      response.status = 200

      OutputStream outs
      if (params.term.startsWith("HP:")) {
        String termId = params.term
        if (params.association == "genes") {
          hpoExcelService.setExcelFilePrefixAndName("genes_for_" + termId.replace(":","_"))
          response.addHeader("Content-disposition", "attachment; filename=${HpoExcelService.EXCEL_FILENAME}")
          outs = response.outputStream

          hpoExcelService.exportExcelGenesFromTerm(outs, (List) hpoTermService.searchGenesByTerm(termId, 0, -1).genes)

          outs.flush()
          outs.close()

        } else if (params.association == "diseases") {
          hpoExcelService.setExcelFilePrefixAndName("diseases_for_" + termId.replace(":","_"))
          response.addHeader("Content-disposition", "attachment; filename=${HpoExcelService.EXCEL_FILENAME}")
          outs = response.outputStream

          hpoExcelService.exportExcelDiseaseFromTerm(outs, (List) hpoTermService.searchDiseasesByTerm(termId, 0, -1).diseases)

          outs.flush()
          outs.close()
        }else {
          render(view: '/error')
        }
      } else {
        render(view: '/error')
      }
    }

  def downloadDiseaseAnnotation(){
    response.contentType = "${xlsxMimeType};charset=${encoding}"
    response.status = 200

    OutputStream outs
    if (params.term.startsWith("OMIM:") || params.term.startsWith("ORPHA:")) {
      String termId = params.term
      if (params.association == "genes") {
        hpoExcelService.setExcelFilePrefixAndName("genes_for_" + termId.replace(":","_"))
        response.addHeader("Content-disposition", "attachment; filename=${HpoExcelService.EXCEL_FILENAME}")
        outs = response.outputStream

        hpoExcelService.exportExcelGenesFromTerm(outs, (List) hpoDiseaseDetailsService.searchDisease(termId).geneAssoc)

        outs.flush()
        outs.close()
      } else if (params.association == "term") {
        hpoExcelService.setExcelFilePrefixAndName("diseases_for_" + termId.replace(":","_"))
        response.addHeader("Content-disposition", "attachment; filename=${HpoExcelService.EXCEL_FILENAME}")
        outs = response.outputStream

        hpoExcelService.exportExcelDiseaseFromTerm(outs, (List) hpoDiseaseDetailsService.searchDisease(termId).termAssoc)

        outs.flush()
        outs.close()
      }else {
        render(view: '/error')
      }
    } else {
      render(view: '/error')
    }
  }

  private boolean isValidTerm(String term){
    if(params.term.startsWith("OMIM:") || params.term.startsWith("ORPHA:") ||
      params.term.startsWith("HP:") || params.term.startsWith("NCBI:")){
      return true;
    }
    return false;
  }
}

package hpo.api

import grails.config.Config
import grails.core.support.GrailsConfigurationAware

class HpoExcelController implements GrailsConfigurationAware {

    HpoExcelService hpoExcelService
    HpoTermService hpoTermService
    HpoDiseaseDetailsService hpoDiseaseDetailsService
    HpoGeneDetailsService hpoGeneDetailsService

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
      if ( params.identifier && params.identifier.startsWith("HP:")) {
        String termId = params.identifier
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
    if ( params.identifier && (params.identifier.startsWith("OMIM:") || params.identifier.startsWith("ORPHA:"))) {
      String diseaseId = params.identifier
      if (params.association == "genes") {
        hpoExcelService.setExcelFilePrefixAndName("genes_for_" + diseaseId.replace(":","_"))
        response.addHeader("Content-disposition", "attachment; filename=${HpoExcelService.EXCEL_FILENAME}")
        outs = response.outputStream
        hpoExcelService.exportExcelGenesFromDisease(outs, (Set) hpoDiseaseDetailsService.searchDisease(diseaseId).geneAssoc)

        outs.flush()
        outs.close()
      } else if (params.association == "terms") {
        hpoExcelService.setExcelFilePrefixAndName("terms_for_" + diseaseId.replace(":","_"))
        response.addHeader("Content-disposition", "attachment; filename=${HpoExcelService.EXCEL_FILENAME}")
        outs = response.outputStream
        Map<String, Object> diseaseResponse = hpoDiseaseDetailsService.searchDisease(diseaseId)
        hpoExcelService.exportExcelTermsFromDisease(outs,
          (Set) diseaseResponse.termAssoc,
          (List) diseaseResponse.catTerms)

        outs.flush()
        outs.close()
      }else {
        render(view: '/error')
      }
    } else {
      render(view: '/error')
    }
  }

  def downloadGeneAnnotation(){
    response.contentType = "${xlsxMimeType};charset=${encoding}"
    response.status = 200

    OutputStream outs
    if (params.identifier && Integer.parseInt(params.identifier)) {
      Integer geneId = Integer.parseInt(params.identifier)
      if (params.association == "diseases") {
        hpoExcelService.setExcelFilePrefixAndName("diseases_for_" + geneId)
        response.addHeader("Content-disposition", "attachment; filename=${HpoExcelService.EXCEL_FILENAME}")
        outs = response.outputStream
        hpoExcelService.exportDiseaseFromGene(outs, (Set) hpoGeneDetailsService.searchGene(geneId).diseaseAssoc)

        outs.flush()
        outs.close()
      } else if (params.association == "terms") {
        hpoExcelService.setExcelFilePrefixAndName("terms_for_" + geneId)
        response.addHeader("Content-disposition", "attachment; filename=${HpoExcelService.EXCEL_FILENAME}")
        outs = response.outputStream
        hpoExcelService.exportTermsFromGene(outs, (Set) hpoGeneDetailsService.searchGene(geneId).termAssoc)

        outs.flush()
        outs.close()
      }else {
        render(view: '/error')
      }
    } else {
      render(view: '/error')
    }
  }
}

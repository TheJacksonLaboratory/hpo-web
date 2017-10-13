package hpo.api


import grails.rest.*
import grails.converters.*

class HpoDiseaseDetailsController {
	static responseFormats = ['json']
    HpoDiseaseDetailsService hpoDiseaseDetailsService

    def searchDisease(String q){
        render(view: 'searchDisease', model: [diseaseResult: hpoDiseaseDetailsService.searchDisease(q)])
    }
}

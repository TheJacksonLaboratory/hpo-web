package hpo.api


import grails.rest.*
import grails.converters.*

class HpoTermDetailsController {
    HpoTermDetailsService hpoTermDetailsService
	static responseFormats = ['json']

    def searchTerm(String q){
        render(view: 'searchTerm', model: [resultMap: hpoTermDetailsService.searchTerm(q)])
    }
}

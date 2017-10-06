package hpo.api


import grails.rest.*
import grails.converters.*

class HpoTermDetailsController {
    HpoTermDetailsService hpoTermDetailsService
	static responseFormats = ['json']

    def searchTerm(String q){
        render(view: 'hpoTermDetails.searchTerm', model: [termResult: hpoTermDetailsService.searchTerms(q)])
    }
}

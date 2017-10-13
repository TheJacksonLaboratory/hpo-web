package hpo.api

class UrlMappings {

    static mappings = {
        delete "/$controller/$id(.$format)?"(action:"delete")
        get "/$controller(.$format)?"(action:"index")
        get "/$controller/$id(.$format)?"(action:"show")
        post "/$controller(.$format)?"(action:"save")
        put "/$controller/$id(.$format)?"(action:"update")
        patch "/$controller/$id(.$format)?"(action:"patch")

        "/"(controller: 'application', action:'index')
        "/hpo/search"(controller: 'hpoSearch', action:'searchAll')
        "/hpo/search/term"(controller: 'hpoTermDetails', action:'searchTerm')
        "/hpo/search/disease"(controller: 'hpoDiseaseDetails', action:'searchDisease')
        "500"(view: '/error')
        "404"(view: '/notFound')
    }
}

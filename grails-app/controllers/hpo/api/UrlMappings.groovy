package hpo.api

class UrlMappings {

    //exclude the paths to:
    // 1) Tell grails to avoid routing for these static resources, but instead have direct access to these via http://<host>/app/<filename>
    // 2) Allow routing of /app/* to angular app (index.html), but ignore these paths
    static excludes = ['/app/index.html', '/app/*.css', '/app/*.js','/app/*.jpg']

    static mappings = {
        delete "/$controller/$id(.$format)?"(action:"delete")
        get "/$controller(.$format)?"(action:"index")
        get "/$controller/$id(.$format)?"(action:"show")
        post "/$controller(.$format)?"(action:"save")
        put "/$controller/$id(.$format)?"(action:"update")
        patch "/$controller/$id(.$format)?"(action:"patch")

        "/"(uri: '/app/index.html')
        "/app/"(uri: '/app/index.html')
        "/app/**"(uri: '/app/index.html')
        "/api/hpo/search"(controller: 'hpoSearch', action:'searchAll')
        "/api/hpo/search/term"(controller: 'hpoTermDetails', action:'searchTerm')
        "/api/hpo/search/gene"(controller: 'hpoGeneDetails', action:'searchGene')
        "/api/hpo/search/disease"(controller: 'hpoDiseaseDetails', action:'searchDisease')
        "500"(view: '/error')
        "404"(view: '/notFound')
    }
}


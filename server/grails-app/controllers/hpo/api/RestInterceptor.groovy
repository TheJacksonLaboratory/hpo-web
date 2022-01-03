package hpo.api

class RestInterceptor {

    RestInterceptor(){
      matchAll()
    }

    boolean before() {
      if(!System.properties['grails.console']){
        header( "X-Frame-Options", "DENY" )
        header( "X-Content-Type-Options", "nosniff" )
        header( "X-XSS-Protection", "1" )
        header( "Content-Security-Policy", "script-src 'self' 'sha256-uGJV1INRCzRQ65HtahUNomtGV0G2E/dzVWsvQpazKHw=' https://www.googletagmanager.com/gtag/js https://www.google-analytics.com/analytics.js")
      }
        true
    }

    boolean after() { true }

    void afterView() {
        // no-op
    }
}

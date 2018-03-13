package hpo.api

class RestInterceptor {

    RestInterceptor(){
      matchAll()
    }
    boolean before() {
      header( "X-Frame-Options", "DENY" )
      header( "X-Content-Type-Options", "nosniff" )
      header( "X-XSS-Protection", "1" )
      header( "Content-Security-Policy", "script-src 'self'")
      true
    }

    boolean after() { true }

    void afterView() {
        // no-op
    }
}

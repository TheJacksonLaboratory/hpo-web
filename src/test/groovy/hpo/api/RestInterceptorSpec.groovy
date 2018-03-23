package hpo.api

import grails.testing.web.interceptor.InterceptorUnitTest
import spock.lang.Specification

class RestInterceptorSpec extends Specification implements InterceptorUnitTest<RestInterceptor> {

    def setup() {
    }

    def cleanup() {

    }

    void "Test rest interceptor matching"() {
        when:"A request matches the interceptor"
            withRequest(controller:"rest")

        then:"The interceptor does match"
            interceptor.doesMatch()

    }

    void "Test rest interceptor renders headers"(){
      given:
      request.method = "GET"

      and:
      interceptor.before()

      expect:
      response.getHeaderNames().containsAll(["X-Frame-Options", "X-Content-Type-Options","X-XSS-Protection",
                                    "Content-Security-Policy"])
    }
    void "Test rest interceptor renders headers and values"(){
      given:
      request.method = "GET"

      and:
      interceptor.before()

      expect:
      response.getHeader("X-Frame-Options") == "DENY"
      response.getHeader("X-Content-Type-Options") == "nosniff"
      response.getHeader("X-XSS-Protection") == "1"
      response.getHeader("Content-Security-Policy") == "script-src 'self'"
    }
}

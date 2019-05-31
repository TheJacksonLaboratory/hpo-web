import io.swagger.models.Scheme

swagger {
  info {
    description = "HPO Swagger API Documentation"
    version = "1.5.0"
    title = "HPO REST API"
    termsOfServices = ""
    contact {
      name = "Michael Gargano"
      url = "https://github.com/TheJacksonLaboratory/hpo-web/"
      email = "michael.gargano@jax.org"
    }
    license {
      name = ""
      url = "https://github.com/TheJacksonLaboratory/hpo-web/blob/master/LICENSE.md"
    }
  }
  schemes = [Scheme.HTTP]
  consumes = ["application/json"]
}

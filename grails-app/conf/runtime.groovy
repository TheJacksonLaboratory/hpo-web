import io.swagger.models.Scheme

swagger {
  info {
    description = "HPO Swagger API Documentation"
    title = "HPO REST API"
    termsOfServices = ""
    contact {
      name = "Human Phenotype Ontology"
      url = "https://github.com/TheJacksonLaboratory/hpo-web/"
      email = "michael.gargano@jax.org"
    }
    license {
      name = ""
      url = "https://github.com/TheJacksonLaboratory/hpo-web/blob/master/LICENSE.md"
    }
  }
  schemes = [Scheme.HTTPS, Scheme.HTTP]
  consumes = ["application/json"]
}

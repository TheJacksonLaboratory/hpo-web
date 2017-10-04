import hpo.api.HpoSearchService
import hpo.api.util.HpoOntologyFactory
import hpo.api.util.HpoAnnotationFactory

// Place your Spring DSL code here
beans = {
  hpoSearchService(HpoSearchService) {
    hpoOntology = HpoOntologyFactory.getInstance()
    hpoDiseaseAnnotations = HpoAnnotationFactory.getAnnotationInstance()
  }
}

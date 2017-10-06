import hpo.api.HpoSearchService
import hpo.api.HpoTermDetailsService
import hpo.api.util.HpoOntologyFactory
import hpo.api.util.HpoDiseaseFactory
import hpo.api.util.HpoGeneFactory

// Place your Spring DSL code here
beans = {
  hpoSearchService(HpoSearchService) {
    hpoOntology = HpoOntologyFactory.getInstance()
    hpoDiseases = HpoDiseaseFactory.getAnnotationInstance()
    hpoGenes = HpoGeneFactory.getGeneAnnotationInstance()
  }
  hpoTermDetailsService(HpoTermDetailsService) {
    //hpoOntology = HpoOntologyFactory.getInstance()
  }
}

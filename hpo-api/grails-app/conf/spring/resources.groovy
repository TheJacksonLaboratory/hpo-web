import com.github.phenomics.ontolib.formats.hpo.HpoOntology
import hpo.api.HpoSearchService
import hpo.api.util.HpoOntologyFactory

// Place your Spring DSL code here
beans = {
    hpoSearchService(HpoSearchService){
        hpoOntology = HpoOntologyFactory.getInstance()
    }
}

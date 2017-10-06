import com.github.phenomics.ontolib.formats.hpo.HpoDiseaseAnnotation
import com.github.phenomics.ontolib.formats.hpo.HpoGeneAnnotation
import com.github.phenomics.ontolib.formats.hpo.HpoOntology
import hpo.api.HpoSearchService
import hpo.api.HpoTermDetailsService
import hpo.api.util.HpoOntologyFactory
import hpo.api.util.HpoDiseaseFactory
import hpo.api.util.HpoGeneFactory

// Place your Spring DSL code here
beans = {
    hpoOntologyFactory(HpoOntologyFactory)
    hpoDiseaseFactory(HpoDiseaseFactory)
    hpoGeneFactory(HpoGeneFactory)

    hpoOntology(hpoOntologyFactory: "getInstance")
    hpoDiseases(hpoDiseaseFactory: "getInstance")
    hpoGenes(hpoGeneFactory: "getInstance")
}

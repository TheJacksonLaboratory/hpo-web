import hpo.api.util.HpoDiseaseFactory
import hpo.api.util.HpoGeneFactory
import hpo.api.util.HpoOntologyFactory

// Place your Spring DSL code here
beans = {
    hpoOntologyFactory(HpoOntologyFactory)
   // hpoDiseaseFactory(HpoDiseaseFactory)
   // hpoGeneFactory(HpoGeneFactory)

    hpoOntology(hpoOntologyFactory: "getInstance")
    /*hpoDiseases(hpoDiseaseFactory: "getInstance")
    hpoGenes(hpoGeneFactory: "getInstance")*/

    groovySql(groovy.sql.Sql, ref('dataSource'))
}

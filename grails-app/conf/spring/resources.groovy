import hpo.api.util.HpoAssociationFactory
import hpo.api.util.HpoOntologyFactory

// Place your Spring DSL code here
beans = {
    hpoOntologyFactory(HpoOntologyFactory)
    hpoOntology(hpoOntologyFactory: "getInstance")

    hpoAssociationFactory(HpoAssociationFactory, hpoOntology)
    hpoAssociation(hpoAssociationFactory: "getInstance")

    groovySql(groovy.sql.Sql, ref('dataSource'))
}

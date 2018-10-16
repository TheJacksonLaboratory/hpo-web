package spring
import hpo.api.util.HpoAssociationFactory
import hpo.api.util.HpoOntologyFactory
import hpo.api.util.HpoUtilities

// Place your Spring DSL code here
beans = {
    hpoOntologyFactory(HpoOntologyFactory)
    hpoOntology(hpoOntologyFactory: "getInstance")

    hpoAssociationFactory(HpoAssociationFactory, hpoOntology)
    hpoAssociation(hpoAssociationFactory: "getInstance")

    hpoUtilities(HpoUtilities, hpoOntology)

    groovySql(groovy.sql.Sql, ref('dataSource'))
}

package spring
import hpo.api.util.HpoAssociationFactory
import hpo.api.util.HpoOntologyFactory
import hpo.api.util.HpoUtilities
import hpo.api.util.Loinc2HpoFactory

// Place your Spring DSL code here
beans = {
    hpoOntologyFactory(HpoOntologyFactory)
    hpoOntology(hpoOntologyFactory: "getInstance")

    hpoAssociationFactory(HpoAssociationFactory, hpoOntology)
    hpoAssociation(hpoAssociationFactory: "getInstance")

    hpoLoincFactory(Loinc2HpoFactory)
    hpoLoinc(hpoLoincFactory: "getInstance")

    hpoUtilities(HpoUtilities, hpoOntology)

    groovySql(groovy.sql.Sql, ref('dataSource'))
}

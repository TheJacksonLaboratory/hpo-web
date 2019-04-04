package spring

import groovy.sql.Sql
import hpo.api.util.HpoAssociationFactory
import hpo.api.util.HpoOntologyFactory
import hpo.api.util.HpoUtilities
import hpo.api.util.Loinc2HpoFactory
import org.springframework.beans.factory.config.MethodInvokingFactoryBean

// Place your Spring DSL code here
beans = {
    hpoOntologyFactory(HpoOntologyFactory)
    hpoOntology(hpoOntologyFactory: "getInstance")

    hpoAssociationFactory(HpoAssociationFactory, hpoOntology)
    hpoAssociation(hpoAssociationFactory: "getInstance")

    hpoLoincFactory(Loinc2HpoFactory)
    hpoLoinc(hpoLoincFactory: "getInstance")

    hpoUtilities(HpoUtilities, hpoOntology)

    groovySql(Sql, ref('dataSource'))
}

package spring

import groovy.sql.Sql
import hpo.api.util.HpoAssociationFactory
import hpo.api.util.OntologyFactory
import hpo.api.util.HpoUtilities
import hpo.api.util.Loinc2HpoFactory

// Place your Spring DSL code here
//maxoOntology(ontologyFactory: "getMaxoOntology")
beans = {
    ontologyFactory(OntologyFactory)
    hpoOntology(ontologyFactory: "getHpoOntology")
    maxoOntology(ontologyFactory: "getMaxoOntology")
    hpoAssociationFactory(HpoAssociationFactory, hpoOntology)
    hpoLoincFactory(Loinc2HpoFactory)
    hpoLoinc(hpoLoincFactory: "getInstance")
    hpoUtilities(HpoUtilities, hpoOntology)
}

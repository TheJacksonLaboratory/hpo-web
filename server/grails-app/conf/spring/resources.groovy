package spring
import grails.util.Environment
import hpo.api.util.HpoAssociationFactory
import hpo.api.util.OntologyFactory
import hpo.api.util.HpoUtilities
import hpo.api.util.Loinc2HpoFactory

beans = {
  ontologyFactory(OntologyFactory)
  hpoOntology(ontologyFactory: "getHpoOntology")
  maxoOntology(ontologyFactory: "getMaxoOntology")
  hpoUtilities(HpoUtilities, hpoOntology)

  hpoLoincFactory(Loinc2HpoFactory)
  hpoLoinc(hpoLoincFactory: "getInstance")
  switch(Environment.current) {
    case Environment.DEVELOPMENT:
      hpoAssociationFactory(HpoAssociationFactory, hpoOntology)
  }
}

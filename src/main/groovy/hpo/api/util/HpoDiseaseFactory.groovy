package hpo.api.util

import org.monarchinitiative.phenol.formats.hpo.HpoDisease
import org.monarchinitiative.phenol.formats.hpo.HpoOntology
import org.monarchinitiative.phenol.io.obo.hpo.HpoDiseaseAnnotationParser

import groovy.transform.CompileStatic
import org.grails.io.support.ClassPathResource
import org.monarchinitiative.phenol.ontology.data.TermId

@CompileStatic
class HpoDiseaseFactory {

  HpoOntology hpoOntology

  Map<TermId, HpoDisease> getInstance(){
        final String file = new ClassPathResource('phenotype_annotation.tab').path
        HpoDiseaseAnnotationParser diseaseAnnotationParser = new HpoDiseaseAnnotationParser(file, hpoOntology)
        Map<TermId, HpoDisease> diseaseAnnotations = diseaseAnnotationParser.parse()
        diseaseAnnotations.asImmutable()
    }
}

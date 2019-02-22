package hpo.api.util

import org.grails.io.support.ClassPathResource
import org.monarchinitiative.loinc2hpo.io.LoincAnnotationSerializerToTSVSingleFile
import org.monarchinitiative.loinc2hpo.loinc.LOINC2HpoAnnotationImpl
import org.monarchinitiative.loinc2hpo.loinc.LoincId
import org.monarchinitiative.phenol.ontology.data.TermId


class Loinc2HpoFactory {

  Map<LoincId, LOINC2HpoAnnotationImpl> annotationMap;
  Map<TermId, Set<LoincId>> reverseAnnotationMap;

  Map<LoincId, LOINC2HpoAnnotationImpl> annotationMap() {
    if (annotationMap == null) {
      File annotationFile = new ClassPathResource('loinc2hpo_annotations.tsv').file;
      def parser = new LoincAnnotationSerializerToTSVSingleFile(null);
      annotationMap = parser.parse(annotationFile.absolutePath);
    }

    return annotationMap;
  }

  Map<TermId, Set<LoincId>> reverseAnnotationMap() {
    if (reverseAnnotationMap == null) {
      annotationMap.entrySet().stream().forEach {entry ->
        entry.getValue().getCandidateHpoTerms().values().forEach {
          mapping ->
            TermId hpo = mapping.getId()
            reverseAnnotationMap.putIfAbsent(hpo, new HashSet<LoincId>())
            reverseAnnotationMap.get(hpo).add(entry.getKey())
        }
      }
    }

    return reverseAnnotationMap;

  }

}

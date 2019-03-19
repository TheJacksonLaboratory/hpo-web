package hpo.api.util

import org.grails.io.support.ClassPathResource
import org.monarchinitiative.loinc2hpo.io.LoincAnnotationSerializerToTSVSingleFile
import org.monarchinitiative.loinc2hpo.loinc.LOINC2HpoAnnotationImpl
import org.monarchinitiative.loinc2hpo.loinc.LoincEntry
import org.monarchinitiative.loinc2hpo.loinc.LoincId
import org.monarchinitiative.phenol.ontology.data.Term
import org.monarchinitiative.phenol.ontology.data.TermId


class Loinc2HpoFactory {

  Map<LoincId, LOINC2HpoAnnotationImpl> annotationMap
  Map<TermId, Set<LoincId>> reverseAnnotationMap
  Map<LoincId, LoincEntry> loincEntryMap
  String annotationPath
  String loincEntryPath


  /**
   * @return annotation map from LOINC ids to the annotations
   */
  Map<LoincId, LOINC2HpoAnnotationImpl> annotationMap() {
    if (annotationMap == null) {
      if (annotationPath == null) {
        annotationPath = new ClassPathResource('loinc2hpo_annotations_v2.0.tsv').file.absolutePath
      }
      // TODO: remove empty map after refactoring loinc2hpo
      def parser = new LoincAnnotationSerializerToTSVSingleFile(new HashMap<TermId, Term>())
      annotationMap = parser.parse(annotationPath)
    }

    return annotationMap
  }

  /**
   * @return annotation map from HPO terms to sets of LOINC ids
   */
  Map<TermId, Set<LoincId>> reverseAnnotationMap() {
    if (reverseAnnotationMap == null) {
      annotationMap = annotationMap()
      reverseAnnotationMap = new HashMap<>()
      annotationMap.entrySet().stream().forEach {entry ->
        entry.getValue().getCandidateHpoTerms().values().forEach {
          mapping ->
            TermId hpo = mapping.getId()
            reverseAnnotationMap.putIfAbsent(hpo, new HashSet<LoincId>())
            reverseAnnotationMap.get(hpo).add(entry.getKey())
        }
      }
    }

    return reverseAnnotationMap
  }


  Map<LoincId, LoincEntry> loincEntryMap() {
    if (loincEntryMap == null) {
      if (loincEntryPath == null) {
        loincEntryPath = new ClassPathResource('LoincTableCore').file.absolutePath
      }
      loincEntryMap = LoincEntry.getLoincEntryList(loincEntryPath)
    }

    return loincEntryMap
  }

}

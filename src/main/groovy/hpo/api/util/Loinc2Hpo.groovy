package hpo.api.util

import org.monarchinitiative.loinc2hpo.loinc.LOINC2HpoAnnotationImpl
import org.monarchinitiative.loinc2hpo.loinc.LoincEntry
import org.monarchinitiative.loinc2hpo.loinc.LoincId
import org.monarchinitiative.phenol.ontology.data.TermId

class Loinc2Hpo {
  Map<LoincId, LOINC2HpoAnnotationImpl> annotationMap
  Map<TermId, Set<LoincId>> reverseAnnotationMap
  Map<LoincId, LoincEntry> loincEntryMap

  Loinc2Hpo(Map<LoincId, LOINC2HpoAnnotationImpl> annotationMap,
            Map<TermId, Set<LoincId>> reverseAnnotationMap,
            Map<LoincId, LoincEntry> loincEntryMap) {

    this.annotationMap = annotationMap;
    this.reverseAnnotationMap = reverseAnnotationMap;
    this.loincEntryMap = loincEntryMap;
  }
}

package hpo.api

import org.monarchinitiative.loinc2hpo.loinc.LOINC2HpoAnnotationImpl
import org.monarchinitiative.loinc2hpo.loinc.LoincEntry
import org.monarchinitiative.loinc2hpo.loinc.LoincId
import org.monarchinitiative.phenol.ontology.data.TermId

class HpoLoincService {

  Map<LoincId, LOINC2HpoAnnotationImpl> annotationMap
  Map<TermId, Set<LoincId>> reverseAnnotationMap

  Set<LoincEntry> searchByHpo(TermId query) {
    return reverseAnnotationMap.get(query)
  }

  LOINC2HpoAnnotationImpl searchByLoinc(LoincId loincId) {
    return annotationMap.get(loincId)
  }
}

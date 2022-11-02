package hpo.api.util

import org.monarchinitiative.loinc2hpocore.loinc.LoincEntry
import org.monarchinitiative.loinc2hpocore.loinc.LoincId
import org.monarchinitiative.phenol.ontology.data.TermId

class Loinc2Hpo {

  Map<TermId, Set<LoincId>> hpoToLoincMap
  Map<LoincId, LoincEntry> loincCoreMap

  Loinc2Hpo(Map<TermId, Set<LoincId>> hpoToLoincMap,
            Map<LoincId, LoincEntry> loincCoreMap) {

    this.hpoToLoincMap = hpoToLoincMap;
    this.loincCoreMap = loincCoreMap;
  }
}

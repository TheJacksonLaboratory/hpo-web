package hpo.api

import grails.compiler.GrailsCompileStatic
import hpo.api.util.Loinc2Hpo
import org.monarchinitiative.loinc2hpocore.loinc.LoincEntry
import org.monarchinitiative.loinc2hpocore.loinc.LoincId
import org.monarchinitiative.phenol.ontology.data.TermId

@GrailsCompileStatic
/**
 * This class services query with HPO termId and returns a set of LoincEntry.
 * Refer to {@link: LoincEntry} to see available fields.
 */
class HpoLoincService {

  Loinc2Hpo hpoLoinc

  Set<LoincEntry> searchByHpo(TermId query) {
    Set<LoincId> loincIds = hpoLoinc.getHpoToLoincMap().get(query)
    Map<LoincId, LoincEntry> loincEntryMap = hpoLoinc.getLoincCoreMap()

    Set<LoincEntry> result = new HashSet<>()
    if(loincIds != null){
      loincIds.each { LoincId loincId ->
        result.add(loincEntryMap.get(loincId))
      }
    }
    return result
  }
}

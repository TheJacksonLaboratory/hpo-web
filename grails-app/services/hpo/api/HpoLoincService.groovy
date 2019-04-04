package hpo.api

import grails.compiler.GrailsCompileStatic
import hpo.api.util.Loinc2Hpo
import hpo.api.util.Loinc2HpoFactory
import org.monarchinitiative.loinc2hpo.loinc.LoincEntry
import org.monarchinitiative.loinc2hpo.loinc.LoincId
import org.monarchinitiative.phenol.ontology.data.TermId

@GrailsCompileStatic
/**
 * This class services query with HPO termId and returns a set of LoincEntry.
 * Refer to {@link: LoincEntry} to see available fields.
 */
class HpoLoincService {

  Loinc2Hpo hpoLoinc

  Set<LoincEntry> searchByHpo(TermId query) {
    Set<LoincId> loincIds = hpoLoinc.getReverseAnnotationMap().get(query)
    Map<LoincId, LoincEntry> loincEntryMap = hpoLoinc.getLoincEntryMap()

    Set<LoincEntry> result = new HashSet<>()
    if(loincIds != null){
      loincIds.each { LoincId loincId ->
        LoincEntry loincEntry = loincEntryMap.get(loincId)
        result.add(loincEntry)
      }
    }

    return result
  }


}

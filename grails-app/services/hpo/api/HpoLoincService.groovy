package hpo.api

import grails.compiler.GrailsCompileStatic
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

  Loinc2HpoFactory loinc2HpoFactory

  Set<LoincEntry> searchByHpo(TermId query) {
    Set<LoincId> loincIds = loinc2HpoFactory.reverseAnnotationMap().get(query)
    Map<LoincId, LoincEntry> loincEntryMap = loinc2HpoFactory.loincEntryMap()

    Set<LoincEntry> result = new HashSet<>()

    for (LoincId loincid : loincIds) {
      LoincEntry loincEntry = loincEntryMap.get(loincid)
      result.add(loincEntry)
    }

    return result
  }


}

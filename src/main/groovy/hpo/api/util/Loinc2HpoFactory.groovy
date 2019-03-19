package hpo.api.util

import org.grails.io.support.ClassPathResource
import org.monarchinitiative.loinc2hpo.io.LoincAnnotationSerializerToTSVSingleFile
import org.monarchinitiative.loinc2hpo.loinc.LOINC2HpoAnnotationImpl
import org.monarchinitiative.loinc2hpo.loinc.LoincEntry
import org.monarchinitiative.loinc2hpo.loinc.LoincId
import org.monarchinitiative.phenol.ontology.data.Term
import org.monarchinitiative.phenol.ontology.data.TermId


class Loinc2HpoFactory {

  String annotationPath
  String loincEntryPath

  Loinc2Hpo getInstance(){
    Map<LoincId, LOINC2HpoAnnotationImpl> annotationMap = annotationMap()
    return new Loinc2Hpo(annotationMap, reverseAnnotationMap(annotationMap), loincEntryMap())
  }

  /**
   * @return annotation map from LOINC ids to the annotations
   */
  Map<LoincId, LOINC2HpoAnnotationImpl> annotationMap() {
    Map<LoincId, LOINC2HpoAnnotationImpl> annotationMap;
    annotationPath = new ClassPathResource('loinc2hpo_annotations_v2.0.tsv').file.absolutePath
    // TODO: remove empty map after refactoring loinc2hpo
    def parser = new LoincAnnotationSerializerToTSVSingleFile(new HashMap<TermId, Term>())
    return parser.parse(annotationPath);
  }

  /**
   * @return annotation map from HPO terms to sets of LOINC ids
   */
  Map<TermId, Set<LoincId>> reverseAnnotationMap(Map<LoincId, LOINC2HpoAnnotationImpl> annotationMap) {
      if(annotationMap == null){
        throw new IllegalStateException("Annotation Map is null.")
      }
      Map<TermId, Set<LoincId>> reverseAnnotationMap = new HashMap<>()
      annotationMap.entrySet().stream().forEach {entry ->
        entry.getValue().getCandidateHpoTerms().values().forEach {
          mapping ->
            TermId hpo = mapping.getId()
            reverseAnnotationMap.putIfAbsent(hpo, new HashSet<LoincId>())
            reverseAnnotationMap.get(hpo).add(entry.getKey())
        }
      }
    return reverseAnnotationMap;
  }


  Map<LoincId, LoincEntry> loincEntryMap() {
    loincEntryPath = new ClassPathResource('LoincTableCore.csv').file.absolutePath
    return LoincEntry.getLoincEntryList(loincEntryPath)
  }
}

package hpo.api.util

import org.grails.io.support.ClassPathResource
import org.monarchinitiative.loinc2hpocore.annotation.Loinc2HpoAnnotation
import org.monarchinitiative.loinc2hpocore.io.Loinc2HpoAnnotationParser
import org.monarchinitiative.loinc2hpocore.io.LoincTableCoreParser
import org.monarchinitiative.loinc2hpocore.loinc.LoincEntry
import org.monarchinitiative.loinc2hpocore.loinc.LoincId
import org.monarchinitiative.phenol.ontology.data.TermId

import java.util.stream.Collectors


class Loinc2HpoFactory {

  String annotationPath = new ClassPathResource('loinc2hpo_annotations_v2.0.tsv').file.absolutePath
  String loincCorePath = new ClassPathResource('LoincTableCore.csv').file.absolutePath

  Loinc2Hpo getInstance(){
    return new Loinc2Hpo(reverseAnnotationMap(annotationMap()), loincEntryMap())
  }

  /**
   * @return annotation map from LOINC ids to the annotations
   */
  Map<LoincId, List<Loinc2HpoAnnotation>> annotationMap() {
   return Loinc2HpoAnnotationParser.load(annotationPath).groupBy({it -> it.getLoincId()})
  }

  /**
   * @return annotation map from HPO terms to sets of LOINC ids
   */
  static Map<TermId, Set<LoincId>> reverseAnnotationMap(Map<LoincId, List<Loinc2HpoAnnotation>> annotationMap) {
      if(annotationMap == null){
        throw new IllegalStateException("Annotation Map is null.")
      }
      Map<TermId, Set<LoincId>> reverseAnnotationMap = new HashMap<>()
      annotationMap.entrySet().each {it ->
        it.value.collect({ annots -> annots.getHpoTermId() }).each {hpo ->
          reverseAnnotationMap.putIfAbsent(hpo, new HashSet<LoincId>())
          reverseAnnotationMap.get(hpo).add(it.getKey())
        }
      }
    return reverseAnnotationMap;
  }


  Map<LoincId, LoincEntry> loincEntryMap() {
    return LoincTableCoreParser.load(loincCorePath)
  }
}

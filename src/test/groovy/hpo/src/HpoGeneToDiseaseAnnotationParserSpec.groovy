package hpo.src


import hpo.api.io.HpoGeneToDiseaseAnnotationParser
import hpo.api.models.HpoGeneDiseaseAnnotation
import org.grails.io.support.ClassPathResource
import spock.lang.Specification

class HpoGeneToDiseaseAnnotationParserSpec extends Specification {

  def setup() {

  }

  def cleanup() {
  }

  void "test that transitive phenotype to genes parses correctly"() {
    final File file = new ClassPathResource("genes_to_diseases-test.txt").file
    List<HpoGeneDiseaseAnnotation> geneToDiseaseAnnotations = []
    HpoGeneToDiseaseAnnotationParser geneToDiseaseParser = new HpoGeneToDiseaseAnnotationParser(file)
    while (geneToDiseaseParser.hasNext()) {
      geneToDiseaseAnnotations.add(geneToDiseaseParser.next())
    }
    expect:
    geneToDiseaseAnnotations*.geneSymbol == expected

    where:
    expected                                                                   | desc
    ['A2M', 'AARS']                                                            | 'expected genes'
  }
}

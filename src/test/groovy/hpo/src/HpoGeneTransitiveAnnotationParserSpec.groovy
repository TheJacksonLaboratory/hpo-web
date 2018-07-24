package hpo.src

import org.grails.io.support.ClassPathResource
import org.monarchinitiative.phenol.formats.hpo.HpoGeneAnnotation
import spock.lang.Specification
import hpo.api.io.HpoGeneTransitiveAnnotationParser;
class HpoGeneTransitiveAnnotationParserSpec extends Specification {

  def setup() {

  }

  def cleanup() {
  }

  void "test that transitive phenotype to genes parses correctly"() {
    final File file = new ClassPathResource("phenotype_to_genes-test.txt").file
    List<HpoGeneAnnotation> geneTransitiveAnnotations = []
    HpoGeneTransitiveAnnotationParser geneTransitiveParser = new HpoGeneTransitiveAnnotationParser(file)
    while (geneTransitiveParser.hasNext()) {
      geneTransitiveAnnotations.add(geneTransitiveParser.next())
    }
    expect:
    geneTransitiveAnnotations*.entrezGeneSymbol == expected

    where:
    expected                                                                   | desc
    ['CDKN1A', 'CDKN1B', 'CDKN2B', 'CDKN2C', 'PIEZO2', 'MEN1']                 | 'expected genes'
  }
}

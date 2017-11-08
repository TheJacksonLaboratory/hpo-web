package hpo.api.gene

import com.github.phenomics.ontolib.formats.hpo.HpoGeneAnnotation
import com.github.phenomics.ontolib.ontology.data.ImmutableTermId
import grails.testing.gorm.DomainUnitTest
import spock.lang.Specification

class DbGeneUnitSpec extends Specification implements DomainUnitTest<DbGene> {

  void "test gene constructor"() {
    given:
    Integer entrezGeneId = 7175
    String  entrezGeneSymbol = "TP53"

    when:
    DbGene dbGene = new DbGene(entrezGeneId,entrezGeneSymbol)

    then:
    verifyAll {
      dbGene.entrezGeneId  == entrezGeneId
      dbGene.entrezGeneSymbol == entrezGeneSymbol
    }
  }
}

package hpo.api.unit.gene

import com.github.phenomics.ontolib.formats.hpo.HpoGeneAnnotation
import com.github.phenomics.ontolib.ontology.data.ImmutableTermId
import grails.testing.gorm.DomainUnitTest
import hpo.api.gene.DbGene
import spock.lang.Specification

class DbGeneUnitSpec extends Specification implements DomainUnitTest<DbGene> {

  void "test gene constructor"() {
    given:
  HpoGeneAnnotation geneAnnotation = new HpoGeneAnnotation(7175,"TP53",null,null)

    when:
    DbGene dbGene = new DbGene(geneAnnotation)

    then:
    verifyAll {
      dbGene.entrezGeneId  == geneAnnotation.entrezGeneId
      dbGene.entrezGeneSymbol == geneAnnotation.entrezGeneSymbol
    }
  }
}

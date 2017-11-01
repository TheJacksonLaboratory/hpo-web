package hpo.api.gene

import com.github.phenomics.ontolib.formats.hpo.HpoGeneAnnotation
import com.github.phenomics.ontolib.ontology.data.ImmutableTermId
import grails.testing.gorm.DomainUnitTest
import spock.lang.Specification

class DbGeneUnitSpec extends Specification implements DomainUnitTest<DbGene> {

  void "test gene constructor"() {
    given:
    HpoGeneAnnotation geneAnnotation = new HpoGeneAnnotation(
      7175,
      "TP53",
      "Bladder carcinoma",
      ImmutableTermId.constructWithPrefix( "HP:0002862")
    )

    when:
    DbGene dbGene = new DbGene(geneAnnotation)

    then:
    verifyAll {
      dbGene.geneId  == geneAnnotation.getEntrezGeneId()
      dbGene.geneSymbol == geneAnnotation.getEntrezGeneSymbol()
      dbGene.name == geneAnnotation.getTermName()
      dbGene.ontologyId == geneAnnotation.getTermId().getIdWithPrefix()
    }
  }
}

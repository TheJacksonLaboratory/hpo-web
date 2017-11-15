package hpo.api

import com.github.phenomics.ontolib.formats.hpo.HpoDisease
import com.github.phenomics.ontolib.formats.hpo.HpoDiseaseAnnotation
import com.github.phenomics.ontolib.formats.hpo.HpoTerm
import com.github.phenomics.ontolib.ontology.data.ImmutableTermId
import com.github.phenomics.ontolib.ontology.data.Term
import grails.testing.gorm.DataTest
import grails.testing.services.ServiceUnitTest
import hpo.api.HpoDiseaseDetailsService
import hpo.api.disease.DbDisease
import hpo.api.gene.DbGene
import hpo.api.term.DbTerm
import hpo.api.util.HpoDiseaseFactory
import spock.lang.Shared
import spock.lang.Specification
import spock.lang.Unroll

@Unroll
class HpoDiseaseDetailsServiceSpec extends Specification implements ServiceUnitTest<HpoDiseaseDetailsService>, DataTest {

  def setup() {
    mockDomains DbGene, DbTerm, DbDisease
  }

  void "test find associated genes given disease using #desc"() {
    setup:
    DbDisease dbDisease = buildMockDisease()
    List<Map> genes = [["entrezGeneId": 79719, "entrezGeneSymbol":"AAGAB"], ["entrezGeneId": 7373, "entrezGeneSymbol":"COL14A1"]]
    genes.each{
      dbDisease.addToDbGenes(new DbGene(entrezGeneSymbol: it.entrezGeneSymbol, entrezGeneId: it.entrezGeneId))
    }
    dbDisease.save()

    when: "we query for a disease"
    Map resultMap = service.searchDisease(query)

    then:
    resultMap.geneAssoc*.entrezGeneSymbol.containsAll(expected)

    where:
    query           | expected              | desc
    null            | []                    | 'nothing'
    "ORPHA:79501"   | ["AAGAB","COL14A1"]   | 'disease by id'

  }
  void "test find associated terms given disease using #desc"() {
    setup:
    DbDisease dbDisease = buildMockDisease()
    List<Term> terms = buildMockTerms()
    terms.each{
      dbDisease.addToDbTerms(new DbTerm(it))
    }
    dbDisease.save()

    when: "we query for a disease"
    Map resultMap = service.searchDisease(query)

    then:
    resultMap.termAssoc*.ontologyId.containsAll(expected)

    where:
    query           | expected                   | desc
    null            | []                         | 'nothing'
    "ORPHA:79501"   | ["HPO:10406","HPO:1337"]   | 'disease by id'

  }
  private static DbDisease buildMockDisease(){
    new DbDisease(db:"ORPHA", dbId: "79501", diseaseName: "keratoderma type 1", diseaseId: "ORPHA:79501")
  }
  private static List<Term> buildMockTerms(){
    [
      new HpoTerm(
        ImmutableTermId.constructWithPrefix("HPO:10406"),
        [],
        'Term 1' ,
        'Descriptive definition',
        'Informative commment',
        [],
        [],
        false,
        'someUser',
        new Date(),
        []
      ),
      new HpoTerm(
        ImmutableTermId.constructWithPrefix("HPO:1337"),
        [],
        'Term 2' ,
        'Descriptive definition',
        'Informative commment',
        [],
        [],
        false,
        'someUser',
        new Date(),
        []
      )
    ]
  }
}

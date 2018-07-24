package hpo.api

import grails.testing.gorm.DataTest
import grails.testing.services.ServiceUnitTest
import hpo.api.disease.DbDisease
import hpo.api.gene.DbGene
import hpo.api.term.DbTerm
import hpo.api.util.HpoOntologyFactory
import org.monarchinitiative.phenol.formats.hpo.HpoOntology
import org.monarchinitiative.phenol.ontology.data.Term
import org.monarchinitiative.phenol.ontology.data.TermId
import spock.lang.Specification
import spock.lang.Unroll

@Unroll
class HpoDiseaseDetailsServiceUnitSpec extends Specification implements ServiceUnitTest<HpoDiseaseDetailsService>, DataTest {

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
    HpoOntology hpoOntology = new HpoOntologyFactory().getInstance()
    service.hpoOntology = hpoOntology
    DbDisease dbDisease = buildMockDisease()
    List<Term> terms = buildMockTerms(["HP:0001597","HP:0000982"])
    terms.each{
      dbDisease.addToDbTerms(new DbTerm(it))
    }
    dbDisease.save()

    when: "we query for a disease"
    Map resultMap = service.searchDisease(query)

    then:
    resultMap.termAssoc*.ontologyId.containsAll(expected)

    where:
    query           | expected                      | desc
    null            | []                            | 'nothing'
    "ORPHA:79501"   | ["HP:0001597","HP:0000982"]   | 'disease by id'
    "XXXXXXXXXXX"   | []                            | 'invalid by id'

  }

  void "test find category-terms map given disease using #desc"() {
    setup:

    HpoOntology hpoOntology = new HpoOntologyFactory().getInstance()
    service.hpoOntology = hpoOntology
    DbDisease dbDisease1 = buildMockDisease()

    List<Term> terms = buildMockTerms(["HP:0001597","HP:0000982"])
    terms.each{
      dbDisease1.addToDbTerms(new DbTerm(it))
    }
    dbDisease1.save()

    when: "we query for a disease"
    Map resultMap = service.searchDisease(query)

    then:
    resultMap.catTerms == expected

    where:
    query           | expected                                                  | desc
    null            | [[:]]                                                     | 'nothing'
    "ORPHA:79501"   | [[catLabel:'Skin, Hair, and Nails', terms:[null, null]]]  | 'disease by id'
    "XXXXXXXXXXX"   | [[:]]                                                     | 'invalid by id'

  }

  private static DbDisease buildMockDisease(){
    new DbDisease(db:"ORPHA", dbId: "79501", diseaseName: "keratoderma type 1", diseaseId: "ORPHA:79501")
  }

  private static Term buildMockTerm(String id){
    return new Term(
      TermId.constructWithPrefix(id),
      [],
      'Test Term' ,
      'Descriptive definition',
      [],
      'Informative commment',
      [],
      [],
      false,
      'someUser',
      new Date(),
      []
    )
  }
  private static List<Term> buildMockTerms(List<String> ids){
    List<Term> terms = []
    ids.each{
      terms.add(buildMockTerm(it))
    }
   return terms
  }
}

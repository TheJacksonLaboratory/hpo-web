package hpo.api

import grails.testing.gorm.DataTest
import grails.testing.services.ServiceUnitTest
import hpo.api.annotation.DbAnnotation
import hpo.api.disease.DbDisease
import hpo.api.gene.DbGene
import hpo.api.model.AnnotationResult
import hpo.api.term.DbTerm
import hpo.api.util.HpoAssociationFactory
import hpo.api.util.OntologyFactory
import org.monarchinitiative.phenol.annotations.formats.hpo.HpoDisease
import org.monarchinitiative.phenol.ontology.data.Ontology
import org.monarchinitiative.phenol.ontology.data.Term
import org.monarchinitiative.phenol.ontology.data.TermId
import spock.lang.Specification
import spock.lang.Unroll

@Unroll
class HpoDiseaseDetailsServiceUnitSpec extends Specification implements ServiceUnitTest<HpoDiseaseDetailsService>, DataTest {

  def setup() {
    mockDomains DbGene, DbTerm, DbDisease, DbAnnotation
    service.hpoAssociationFactory = Stub(HpoAssociationFactory) {
      findDisease(_) >> new HpoDisease(
        "",
        null,
        [], [], [], [], [])
    }
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
    Ontology hpoOntology = new OntologyFactory().getHpoOntology()
    service.hpoOntology = hpoOntology
    DbDisease dbDisease = buildMockDisease()
    List<Term> terms = buildMockTerms(["HP:0001597","HP:0000982"])
    terms.each{
      new DbAnnotation(new DbTerm(it), dbDisease, "NA", "NA", "NA").save()
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

    Ontology hpoOntology = new OntologyFactory().getHpoOntology()
    service.hpoOntology = hpoOntology
    DbDisease dbDisease1 = buildMockDisease()

    List<Term> terms = buildMockTerms(["HP:0001597","HP:0000982"])
    List<AnnotationResult> annotationResultList = []
    terms.each {
      new DbAnnotation(new DbTerm(it), dbDisease1, "NA", "NA", "NA").save()
    }
    dbDisease1.save()

    when: "we query for a disease"
    Map resultMap = service.searchDisease(query)

    then:
    resultMap.catTerms.collect{it -> it.catLabel} == expectedLabels
    resultMap.catTerms.size() == expectedTermLength

    where:
    query           | expectedLabels            | expectedTermLength      | desc
    null            | []                      | 0                    | 'nothing'
    "ORPHA:79501"   | ['Limbs', 'Skin, Hair, and Nails' ] | 2                       | 'disease by id'
    "XXXXXXXXXXX"   | []                       | 0                    | 'invalid by id'

  }

  private static DbDisease buildMockDisease(){
    new DbDisease(db:"ORPHA", dbId: "79501", diseaseName: "keratoderma type 1", diseaseId: "ORPHA:79501")
  }

  private static Term buildMockTerm(String id){
    return new Term.Builder()
      .id(TermId.of(id))
      .name('Test Term')
      .altTermIds([])
      .definition('Descriptive definition')
      .databaseXrefs([])
      .comment('informative comment')
      .createdBy('someUser').build()

  }

  private static List<Term> buildMockTerms(List<String> ids){
    List<Term> terms = []
    ids.each{
      terms.add(buildMockTerm(it))
    }
   return terms
  }
}

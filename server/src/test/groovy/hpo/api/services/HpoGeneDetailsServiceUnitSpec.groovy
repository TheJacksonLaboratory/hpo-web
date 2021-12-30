package hpo.api.services

import org.monarchinitiative.phenol.ontology.data.Term

import grails.testing.gorm.DataTest
import grails.testing.services.ServiceUnitTest
import hpo.api.HpoGeneDetailsService
import hpo.api.disease.DbDisease
import hpo.api.gene.DbGene
import hpo.api.term.DbTerm
import org.monarchinitiative.phenol.ontology.data.TermId
import spock.lang.Specification
import spock.lang.Unroll

@Unroll
class HpoGeneDetailsServiceUnitSpec extends Specification implements ServiceUnitTest<HpoGeneDetailsService>, DataTest{

    def setup() {
      mockDomains DbGene, DbTerm, DbDisease
    }

    void "test find associated diseases given gene using #desc"() {
      setup:
      DbGene dbGene = buildMockGene(7157,"TP53")
      List<Map> diseases = [
        ["db": "OMIM", "dbId": "2020", "diseaseId":"OMIM:2020", "diseaseName":"Congenial Cataract"],
        ["db": "ORPHA", "dbId": "6942", "diseaseId":"ORPHA:6942", "diseaseName":"Atrial Septal Defect"]
      ]
      diseases.each{
        dbGene.addToDbDiseases(new DbDisease(it))
      }
      dbGene.save()

      when: "we query for a gene"
      Map resultMap = service.searchGene(query)

      then:
      resultMap.diseaseAssoc*.diseaseId.containsAll(expected)

      where:
        query | expected                     | desc
        null  | []                           | 'nothing'
        7157  | ["ORPHA:6942","OMIM:2020"]   | 'gene by id'

    }
    void "test find associated terms given gene using #desc"() {
      setup:
      DbGene dbGene = buildMockGene(7157,"TP53")
      List<Term> terms = buildMockTerms()
      terms.each{
        dbGene.addToDbTerms(new DbTerm(it))
      }
      dbGene.save()

      when: "we query for a gene"
      Map resultMap = service.searchGene(query)

      then:
      resultMap.termAssoc*.ontologyId.containsAll(expected)

      where:
      query | expected                     | desc
      null  | []                           | 'nothing'
      7157  | ["HPO:10406","HPO:1337"]     | 'gene by id'

    }
    private static DbGene buildMockGene(Integer id, String symbol){
      new DbGene(["entrezGeneId":id,"entrezGeneSymbol":symbol])
    }
    private static List<Term> buildMockTerms(){
    [
      new Term.Builder()
        .id(TermId.of("HPO:10406"))
        .name('Term 1')
        .altTermIds([])
        .definition('Descriptive definition')
        .databaseXrefs([])
        .comment('informative comment')
        .createdBy('someUser').build()
      ,

      new Term.Builder()
        .id(TermId.of("HPO:1337"))
        .name('Term 2')
        .altTermIds([])
        .definition('Descriptive definition')
        .databaseXrefs([])
        .comment('informative comment')
        .createdBy('someUser').build()
    ]
  }
}

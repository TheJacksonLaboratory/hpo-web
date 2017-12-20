package hpo.api

import com.github.phenomics.ontolib.formats.hpo.HpoOntology
import com.github.phenomics.ontolib.formats.hpo.HpoTerm
import com.github.phenomics.ontolib.ontology.data.ImmutableTermId
import com.github.phenomics.ontolib.ontology.data.Term
import grails.testing.gorm.DataTest
import grails.testing.services.ServiceUnitTest
import hpo.api.disease.DbDisease
import hpo.api.gene.DbGene
import hpo.api.models.TermEnum
import hpo.api.term.DbTerm
import hpo.api.util.HpoOntologyFactory
import spock.lang.Shared
import spock.lang.Specification
import spock.lang.Unroll
import hpo.api.models.TermEnum.*;
@Unroll
class HpoTermServiceUnitSpec extends Specification implements ServiceUnitTest<HpoTermService>, DataTest{

    @Shared
    HpoOntology hpoOntology
    def setupSpec(){
        hpoOntology = new HpoOntologyFactory().getInstance()
        mockDomains DbTerm, DbGene, DbDisease
    }
    def setup() {
        service.hpoOntology = hpoOntology
    }
    void 'test find associated genes given term using #desc'(){
      setup:
      Term term = buildMockTerm("HP:0002862")
      DbTerm dbTerm = new DbTerm(term).save()
      List<Map> genes = [["entrezGeneId": 7157, "entrezGeneSymbol":"TP53"], ["entrezGeneId": 3265, "entrezGeneSymbol":"HRAS"]]
      genes.each{
        dbTerm.addToDbGenes(new DbGene(entrezGeneSymbol: it.entrezGeneSymbol, entrezGeneId: it.entrezGeneId))
      }
      dbTerm.save()
      when: "we query for a term"
      List<DbGene> genesResult = service.searchGenesByTerm(query)

      then:
      genesResult*.entrezGeneId == expected
      where:
      query         |  expected      | desc
      ''            |  []            | 'nothing'
      'HP:0002862'  |  [7157, 3265]  | 'exact id'

    }
    void 'test find associated diseases given term using #desc'(){
      setup:
      Term term = buildMockTerm("HP:0002862")
      DbTerm dbTerm = new DbTerm(term).save()
      List<Map> diseases = [
        ["db": "OMIM", "dbId": "7","diseaseName":"Bladder Carcinoma", "diseaseId": "OMIM:7"],
        ["db": "ORPHA", "dbId": "227","diseaseName":"Bladder Failure", "diseaseId": "ORPHA:227"]]
      diseases.each{
        dbTerm.addToDbDiseases(new DbDisease(db: it.db, dbId:it.dbId, diseaseName: it.diseaseName, diseaseId: it.diseaseId))
      }
      dbTerm.save()
      when: "we query for a term"
      List<DbDisease> diseaseResult = service.searchDiseasesByTerm(query)

      then:
      diseaseResult*.diseaseId == expected
      where:
      query         |  expected                 | desc
      ''            |  []                       | 'nothing'
      'HP:0002862'  |  ["OMIM:7", "ORPHA:227"]  | 'exact id'
    }

    void 'test find term details given term using #desc'(){
      setup:
      Term term = buildMockTerm("HP:0002862")
      DbTerm dbTerm = new DbTerm(term).save()
      dbTerm.save()
      when: "we query for a term"
      Map termResponse = service.searchTerm(query)

      then:
      termResponse?.TERM?.getId()?.getIdWithPrefix() == expected
      where:
      query         |  expected                 | desc
      ''            |  null                    | 'nothing'
      'HP:0002862'  |  'HP:0002862'             | 'exact id'
    }
    private static Term buildMockTerm(String id){
      Term term = new HpoTerm(
        ImmutableTermId.constructWithPrefix(id),
        [],
        'Bladder carcinoma' ,
        'Descriptive definition',
        'Informative commment',
        [],
        [],
        false,
        'someUser',
        new Date(),
        []
      )
    }
}


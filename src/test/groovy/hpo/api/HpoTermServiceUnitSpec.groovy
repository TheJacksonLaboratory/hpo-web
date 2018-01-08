package hpo.api

import com.github.phenomics.ontolib.formats.hpo.HpoOntology
import com.github.phenomics.ontolib.formats.hpo.HpoTerm
import com.github.phenomics.ontolib.ontology.data.ImmutableTermId
import com.github.phenomics.ontolib.ontology.data.Term
import grails.testing.gorm.DataTest
import grails.testing.services.ServiceUnitTest
import hpo.api.db.utils.SqlUtilsService
import hpo.api.disease.DbDisease
import hpo.api.gene.DbGene
import hpo.api.term.DbTerm
import hpo.api.util.HpoOntologyFactory
import spock.lang.Shared
import spock.lang.Specification
import spock.lang.Unroll

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
      SqlUtilsService sqlUtilsService = Mock()
      service.sqlUtilsService = sqlUtilsService

      Term term1 = buildMockTerm("HP:0002862")
      Term term2 = buildMockTerm("HP:0002863")

      DbTerm dbTerm1 = new DbTerm(term1).save()
      DbTerm dbTerm2 = new DbTerm(term2).save()

      List<Map> genes = [["id": 1, "entrezGeneId": 7157, "entrezGeneSymbol":"TP53"], ["id": 2, "entrezGeneId": 3265, "entrezGeneSymbol":"HRAS"]]
      genes.each{
        dbTerm1.addToDbGenes(new DbGene(entrezGeneSymbol: it.entrezGeneSymbol, entrezGeneId: it.entrezGeneId))
      }
      dbTerm1.save()

      when: "we query for a term"
      List<DbGene> genesResult = service.searchGenesByTerm(query)

      then:
      (0..1) * sqlUtilsService.executeQuery(_,_) >> mockQueryResponse
      genesResult*.entrezGeneId == expected

      where:
      query         |  expected      | mockQueryResponse                   | desc
      ''            |  []            | []                                  |'nothing'
      'HP:0002862'  |  [3265, 7157]  | [[db_gene_id : 1],[db_gene_id : 2]] |'exact id'
      'HP:0002863'  |  []            | []                                  |'No gene associations'


    }
    void 'test find associated diseases given term using #desc'(){
      setup:
      SqlUtilsService sqlUtilsService = Mock()
      service.sqlUtilsService = sqlUtilsService
      Term term1 = buildMockTerm("HP:0002862")
      Term term2 = buildMockTerm("HP:0002863")
      DbTerm dbTerm1 = new DbTerm(term1).save()
      DbTerm dbTerm2 = new DbTerm(term2).save()
      List<Map> diseases = [
        ["id": 1, "db": "OMIM", "dbId": "7","diseaseName":"Bladder Carcinoma", "diseaseId": "OMIM:7"],
        ["id": 2, "db": "ORPHA", "dbId": "227","diseaseName":"Bladder Failure", "diseaseId": "ORPHA:227"]]
      diseases.each{
        dbTerm1.addToDbDiseases(new DbDisease(db: it.db, dbId:it.dbId, diseaseName: it.diseaseName, diseaseId: it.diseaseId))
      }
      dbTerm1.save()
      when: "we query for a term"
      List<DbDisease> diseaseResult = service.searchDiseasesByTerm(query)

      then:
      (0..1) * sqlUtilsService.executeQuery(_,_) >> mockQueryResponse
      diseaseResult*.diseaseId == expected
      where:
      query         |  expected                 | mockQueryResponse                        | desc
      ''            |  []                       | []                                       |'nothing'
      'HP:0002862'  |  ["OMIM:7", "ORPHA:227"]  | [[db_disease_id : 1],[db_disease_id : 2]]|'exact id'
      'HP:0002863'  |  []                       | []                                       |'No disease associations'

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


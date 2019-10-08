package hpo.api

import grails.testing.gorm.DataTest
import grails.testing.services.ServiceUnitTest
import hpo.api.db.utils.SqlUtilsService
import hpo.api.disease.DbDisease
import hpo.api.gene.DbGene
import hpo.api.term.DbTerm
import hpo.api.annotation.DbAnnotation
import hpo.api.util.HpoOntologyFactory
import hpo.api.util.HpoUtilities
import org.monarchinitiative.phenol.formats.hpo.HpoOntology
import org.monarchinitiative.phenol.ontology.data.Term
import org.monarchinitiative.phenol.ontology.data.TermId
import spock.lang.Shared
import spock.lang.Specification
import spock.lang.Unroll

@Unroll
class HpoTermServiceUnitSpec extends Specification implements ServiceUnitTest<HpoTermService>, DataTest{


    @Shared
    HpoOntology hpoOntology
    @Shared
    HpoUtilities hpoUtilities

    def setupSpec(){
        hpoOntology = new HpoOntologyFactory().getInstance()
        hpoUtilities = new HpoUtilities(hpoOntology)
        mockDomains DbTerm, DbGene, DbDisease, DbAnnotation
    }
    def setup() {
        service.hpoOntology = hpoOntology
        service.hpoUtilities = hpoUtilities
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
      Map<String, Object> genesResult = service.searchGenesByTerm(query, 0, 20)

      then:
      (0..1) * sqlUtilsService.executeQuery(_,_) >> mockQueryResponse
      genesResult.genes*.entrezGeneId == expected

      where:
      query         |  expected      | mockQueryResponse                     | desc
      ''            |  []            | []                                    |'nothing'
      'HP:0002862'  |  [3265, 7157]  | [[db_gene_id : 1], [db_gene_id : 2]]  |'exact id'
      'HP:0002863'  |  []            | []                                    |'No gene associations'


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
        new DbAnnotation(dbTerm1, new DbDisease(db: it.db, dbId:it.dbId, diseaseName: it.diseaseName, diseaseId: it.diseaseId), "", "").save()
      }
      dbTerm1.save()

      when: "we query for a term"
      Map<String, Object> diseaseResult = service.searchDiseasesByTerm(query, 0, 20 )

      then:
      (0..1) * sqlUtilsService.executeQuery(_,_) >> mockQueryResponse
      diseaseResult.diseases*.diseaseId == expected
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
      termResponse?.TERM?.getId()?.toString() == expected
      where:
      query         |  expected                 | desc
      ''            |  null                    | 'nothing'
      'HP:0002862'  |  'HP:0002862'             | 'exact id'
    }

    private static Term buildMockTerm(String id){
      return new Term.Builder()
        .id(TermId.of(id))
        .name('Bladder carcinoma')
        .altTermIds([])
        .definition('Descriptive definition')
        .databaseXrefs([])
        .comment('informative comment')
        .createdBy('someUser').build()
    }


  void 'test service paging for associated genes with #desc'(){
    setup:
    SqlUtilsService sqlUtilsService = Mock()
    service.sqlUtilsService = sqlUtilsService

    Term term1 = buildMockTerm("HP:0002862")

    DbTerm dbTerm1 = new DbTerm(term1).save()

    List<Map> genes = [["id": 1, "entrezGeneId": 7157, "entrezGeneSymbol":"TP53"],
                       ["id": 2, "entrezGeneId": 3265, "entrezGeneSymbol":"HRAS"],
                       ["id": 3, "entrezGeneId": 1232, "entrezGeneSymbol":"ABCD"],
                       ["id": 4, "entrezGeneId": 2342, "entrezGeneSymbol":"EFFF"],
                       ["id": 5, "entrezGeneId": 4564, "entrezGeneSymbol":"DDFD"]]
    genes.each{
      dbTerm1.addToDbGenes(new DbGene(entrezGeneSymbol: it.entrezGeneSymbol, entrezGeneId: it.entrezGeneId))
    }
    dbTerm1.save()

    when: "we query for a term"
    Map<String, Object> serviceResult = service.searchGenesByTerm(queryTerm, offset, max)

    then:
    (0..1) * sqlUtilsService.executeQuery(_,_) >> mockQueryMethodResponse
    serviceResult.genes*.entrezGeneId == rGenes
    serviceResult.geneCount == rCount
    serviceResult.offset == rOffset
    serviceResult.max == rMax

    where:
    queryTerm     | offset | max | rGenes                         |  rCount | rOffset | rMax | desc                         | mockQueryMethodResponse
    ''            | 0      | 20  | []                             |  0      | 0       | 20   |'nothing and default paging'  | []
    'HP:0002862'  | 0      | 20  | [1232, 4564, 2342, 3265, 7157] |  5      | 0       | 20   |'exact id and default paging' | [[db_gene_id: 1], [db_gene_id: 2], [db_gene_id: 3], [db_gene_id: 4], [db_gene_id: 5]]
    'HP:0002862'  | 0      | 2   | [1232, 4564]                   |  5      | 0       | 2    |'exact id and max 2'          | [[db_gene_id: 1], [db_gene_id: 2], [db_gene_id: 3], [db_gene_id: 4], [db_gene_id: 5]]
    'HP:0002862'  | 2      | 2   | [2342, 3265]                   |  5      | 2       | 2    |'exact id and max 2 offset 2' | [[db_gene_id: 1], [db_gene_id: 2], [db_gene_id: 3], [db_gene_id: 4], [db_gene_id: 5]]
    'HP:0002862'  | 4      | 2   | [7157]                         |  5      | 4       | 2    |'exact id and max 2 offset 4' | [[db_gene_id: 1], [db_gene_id: 2], [db_gene_id: 3], [db_gene_id: 4], [db_gene_id: 5]]
    'HP:0002862'  | 0      | -1  | [1232, 4564, 2342, 3265, 7157] |  5      | 0       | -1   |'exact id and max -1 for all' | [[db_gene_id: 1], [db_gene_id: 2], [db_gene_id: 3], [db_gene_id: 4], [db_gene_id: 5]]
    'HP:0002862'  | 2      | -1  | [2342, 3265, 7157]             |  5      | 2       | -1   |'exact id and max -1 offset 2'| [[db_gene_id: 1], [db_gene_id: 2], [db_gene_id: 3], [db_gene_id: 4], [db_gene_id: 5]]

  }

  void 'test service paging for associated diseases with #desc'(){
    setup:
    SqlUtilsService sqlUtilsService = Mock()
    service.sqlUtilsService = sqlUtilsService
    Term term1 = buildMockTerm("HP:0002862")
    DbTerm dbTerm1 = new DbTerm(term1).save()

    List<Map> diseases = [
      ["id": 1, "db": "OMIM", "dbId": "1","diseaseName":"Bladder Carcinoma", "diseaseId": "OM:1"],
      ["id": 2, "db": "OMIM", "dbId": "2","diseaseName":"Bladder Failure", "diseaseId": "OM:2"],
      ["id": 3, "db": "OMIM", "dbId": "3","diseaseName":"Bladder Carcinoma", "diseaseId": "OM:3"],
      ["id": 4, "db": "OMIM", "dbId": "4","diseaseName":"Bladder Carcinoma", "diseaseId": "OM:4"],
      ["id": 5, "db": "OMIM", "dbId": "5","diseaseName":"Bladder Carcinoma", "diseaseId": "OM:5"]]
    diseases.each{
      new DbAnnotation(dbTerm1, new DbDisease(db: it.db, dbId:it.dbId, diseaseName: it.diseaseName, diseaseId: it.diseaseId), "", "").save()
    }

    when: "we query for a term"
    Map<String, Object> serviceResult = service.searchDiseasesByTerm(queryTerm, offset, max )

    then:
    (0..1) * sqlUtilsService.executeQuery(_,_) >> mockQueryMethodResponse
    serviceResult.diseases*.diseaseId == rDiseases
    serviceResult.diseaseCount == rCount
    serviceResult.offset == rOffset
    serviceResult.max == rMax

    where:
    queryTerm     | offset | max | rDiseases                                |  rCount | rOffset | rMax | desc                         | mockQueryMethodResponse
    ''            | 0      | 20  | []                                       |  0      | 0       | 20   |'nothing and default paging'  | []
    'HP:0002862'  | 0      | 20  | ["OM:1", "OM:3", "OM:4", "OM:5", "OM:2"] |  5      | 0       | 20   |'exact id and default paging' | [[db_disease_id: 1], [db_disease_id: 2], [db_disease_id: 3], [db_disease_id: 4], [db_disease_id: 5]]
    'HP:0002862'  | 0      | 2   | ["OM:1", "OM:3"]                         |  5      | 0       | 2    |'exact id and max 2'          | [[db_disease_id: 1], [db_disease_id: 2], [db_disease_id: 3], [db_disease_id: 4], [db_disease_id: 5]]
    'HP:0002862'  | 2      | 2   | ["OM:4", "OM:5"]                         |  5      | 2       | 2    |'exact id and max 2 offset 2' | [[db_disease_id: 1], [db_disease_id: 2], [db_disease_id: 3], [db_disease_id: 4], [db_disease_id: 5]]
    'HP:0002862'  | 4      | 2   | ["OM:2"]                                 |  5      | 4       | 2    |'exact id and max 2 offset 4' | [[db_disease_id: 1], [db_disease_id: 2], [db_disease_id: 3], [db_disease_id: 4], [db_disease_id: 5]]
    'HP:0002862'  | 0      | -1  | ["OM:1", "OM:3", "OM:4", "OM:5", "OM:2"] |  5      | 0       | -1   |'exact id and max -1 for all' | [[db_disease_id: 1], [db_disease_id: 2], [db_disease_id: 3], [db_disease_id: 4], [db_disease_id: 5]]
    'HP:0002862'  | 2      | -1  | ["OM:4", "OM:5", "OM:2"]                 |  5      | 2       | -1   |'exact id and max -1 offset 2'| [[db_disease_id: 1], [db_disease_id: 2], [db_disease_id: 3], [db_disease_id: 4], [db_disease_id: 5]]

  }

}


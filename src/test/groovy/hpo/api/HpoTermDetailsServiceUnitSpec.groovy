package hpo.api

import com.github.phenomics.ontolib.formats.hpo.HpoOntology
import com.github.phenomics.ontolib.formats.hpo.HpoTerm
import com.github.phenomics.ontolib.ontology.data.ImmutableTermId
import com.github.phenomics.ontolib.ontology.data.Term
import grails.testing.gorm.DataTest
import grails.testing.services.ServiceUnitTest
import hpo.api.HpoTermDetailsService
import hpo.api.disease.DbDisease
import hpo.api.gene.DbGene
import hpo.api.term.DbTerm
import hpo.api.util.HpoOntologyFactory
import spock.lang.Shared
import spock.lang.Specification
import spock.lang.Unroll

@Unroll
class HpoTermDetailsServiceUnitSpec extends Specification implements ServiceUnitTest<HpoTermDetailsService>, DataTest{

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
      Term term = new HpoTerm(
        ImmutableTermId.constructWithPrefix("HP:0002862"),
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
      DbTerm dbTerm = new DbTerm(term).save()
      List<Map> genes = [["entrezGeneId": 7157, "entrezGeneSymbol":"TP53"], ["entrezGeneId": 3265, "entrezGeneSymbol":"HRAS"]]
      genes.each{
        dbTerm.addToDbGenes(new DbGene(entrezGeneSymbol: it.entrezGeneSymbol, entrezGeneId: it.entrezGeneId))
      }
      dbTerm.save()
      when: "we query for a term"
      Map resultMap = service.searchTerm(query)

      then:
      resultMap.geneAssoc*.entrezGeneId == expected
      where:
      query         |  expected      | desc
      ''            |  []            | 'nothing'
      'HP:0002862'  |  [7157, 3265]  | 'exact id'

    }
  void 'test find associated diseases given term using #desc'(){
    setup:
    Term term = new HpoTerm(
      ImmutableTermId.constructWithPrefix("HP:0002862"),
      [],
      'Bladder Swelling' ,
      'Descriptive definition',
      'Informative commment',
      [],
      [],
      false,
      'someUser',
      new Date(),
      []
    )
    DbTerm dbTerm = new DbTerm(term).save()
    List<Map> diseases = [
      ["db": "OMIM", "dbId": "7","diseaseName":"Bladder Carcinoma", "diseaseId": "OMIM:7"],
      ["db": "ORPHA", "dbId": "227","diseaseName":"Bladder Failure", "diseaseId": "ORPHA:227"]]
    diseases.each{
      dbTerm.addToDbDisease(new DbDisease(db: it.db, dbId:it.dbId, diseaseName: it.diseaseName, diseaseId: it.diseaseId))
    }
    dbTerm.save()
    when: "we query for a term"
    Map resultMap = service.searchTerm(query)

    then:
    resultMap.diseaseAssoc*.diseaseId == expected
    where:
    query         |  expected                 | desc
    ''            |  []                       | 'nothing'
    'HP:0002862'  |  ["OMIM:7", "ORPHA:227"]  | 'exact id'

  }
}


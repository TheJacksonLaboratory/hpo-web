package hpo.api.integration

import grails.testing.mixin.integration.Integration
import hpo.api.gene.DbGene
import spock.lang.*
@Integration
class DbGeneIntegrationSpec extends Specification {

  void setup(){

  }
  void "test find genes given id"(){
    def c = DbGene.createCriteria()
    List<DbGene> geneList = c.list(){
      like('entrezGeneId', query)
    }
    expect: "fix me"
    geneList*.entrezGeneSymbol == expected

    where:
    query         | expected
    7157          | ["TP53"]
    2879          | ["GPX4"]
  }
  void "test find genes given symbol"(){
    def c = DbGene.createCriteria()
    List<DbGene> geneList = c.list(){
      like('entrezGeneSymbol', "%$query%")
    }
    expect: "fix me"
    geneList*.entrezGeneId == expected

    where:
    query         | expected
    "LBR"         | [3930]
    "RPS19"       | [6223]
  }

  void "test find directly related genes to term"(){
    def c = DbGene.createCriteria()
    List<DbGene> geneList = c.list(){
        dbTerms{
          'in'('ontologyId',query)
        }
    }
    expect: "fix me"
    geneList*.entrezGeneSymbol == expected

    where:
    query         | expected
    'HP:0002862'  | ['ATP7A', 'HRAS']
    'HP:0004408'  | ['PTCH2', 'ATP7A', 'SUFU', 'PTCH1', 'REV3L', 'KIF7', 'SOX9', 'PLXND1', 'HYLS1']
  }
}

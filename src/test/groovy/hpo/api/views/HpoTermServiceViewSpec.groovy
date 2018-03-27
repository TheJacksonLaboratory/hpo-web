package hpo.api.views

import com.github.phenomics.ontolib.formats.hpo.HpoOntology
import com.github.phenomics.ontolib.formats.hpo.HpoTerm
import com.github.phenomics.ontolib.ontology.data.ImmutableTermId
import com.github.phenomics.ontolib.ontology.data.Term
import grails.plugin.json.view.test.*
import grails.testing.gorm.DataTest
import hpo.api.disease.DbDisease
import hpo.api.gene.DbGene
import hpo.api.term.DbTerm
import hpo.api.term.DbTermRelationship
import hpo.api.util.HpoOntologyFactory
import spock.lang.Shared
import spock.lang.Specification

class HpoTermServiceViewSpec extends Specification implements JsonViewTest,DataTest {

  def setupSpec(){
    mockDomains DbTerm, DbGene, DbDisease
  }
  void "test searchTerm template for term details service"(){
    setup:
    //Build a Term Object
    Term term = buildMockTerm("HP:0009725")
    //Create DbTerm and its relationship
    DbTerm dbTerm = new DbTerm(term).save()
    DbTerm termParent = new DbTerm(ontologyId: "HP:0010786", name: "Urinary tract neoplasm")
    DbTerm termChild = new DbTerm(ontologyId: "HP:0002862", name: "Bladder carcinoma")
    new DbTermRelationship(termParent: termParent, termChild: dbTerm).save()
    new DbTermRelationship(termParent: dbTerm, termChild: termChild).save()

    when:"search term gson is rendered"
    Map serviceMap = [TERM:term,DBTERM:dbTerm]
    mappingContext.addPersistentEntity(DbTerm)
    def result = render(view: "/hpoTermDetails/searchTerm", model:[result:serviceMap]).json

    then:"The json is correct"
    result.details.id == expectedTermId
    result.relations.parents.ontologyId == expectedParents
    result.relations.children.ontologyId == expectedChildren

    where:
    expectedTermId | expectedParents | expectedChildren
    "HP:0009725"   | ["HP:0010786"]  | ["HP:0002862"]
  }
  void "test searchGenes template for term details service"(){
    setup:
    // Build List of DbGene Objects
    List<DbGene> geneList = []
    geneList.add(buildMockGene("TP53", 7157))
    geneList.add(buildMockGene("BRAF",1337))


    when:"search genes by term gson is rendered"
    mappingContext.addPersistentEntity(DbGene)
    def result = render(view: "/hpoGeneDetails/searchGenesByTerm", model:[resultMap:[genes:geneList , geneCount:2, offset:0, max:20]]).json

    then:"The json is correct"
    result.genes.entrezGeneSymbol == expectedSymbols

    where:
    expectedSymbols = ["TP53","BRAF"]
  }
  void "test searchDiseases template for term details service"(){
    setup:
    // Build List of DbDisease Objects
    List<DbDisease> diseaseList = []
    List<Map> diseases = [
      ["db": "OMIM", "dbId": "7","diseaseName":"Bladder Carcinoma", "diseaseId": "OMIM:7"],
      ["db": "ORPHA", "dbId": "227","diseaseName":"Bladder Failure", "diseaseId": "ORPHA:227"]]
    diseases.each{
      diseaseList.add(new DbDisease(db: it.db, dbId:it.dbId, diseaseName: it.diseaseName, diseaseId: it.diseaseId))
    }

    when:"search disease by term gson is rendered"
    mappingContext.addPersistentEntity(DbDisease)
    def result = render(view: "/hpoDiseaseDetails/searchDiseasesByTerm", model:[resultMap:[diseases:diseaseList, diseaseCount:2, offset:0, max:20 ]]).json

    then:"The json is correct"
    result.diseases.diseaseId == expectedDiseaseIds

    where:
    expectedDiseaseIds = ["OMIM:7","ORPHA:227"]
  }
  private static Term buildMockTerm(String id){
    Term term = new HpoTerm(
      ImmutableTermId.constructWithPrefix(id),
      [],
      'Bladder neoplasm' ,
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
  private static DbGene buildMockGene(String symbol, Integer id){
    DbGene dbGene = new DbGene(entrezGeneSymbol:symbol, entrezGeneId:id)
  }
}

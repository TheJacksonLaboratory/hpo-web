package hpo.api

import grails.testing.gorm.DataTest
import grails.testing.services.ServiceUnitTest
import hpo.api.db.utils.SqlUtilsService
import hpo.api.disease.DbDisease
import hpo.api.gene.DbGene
import hpo.api.term.DbTerm
import org.apache.commons.lang.StringUtils
import spock.lang.Shared
import spock.lang.Specification
import spock.lang.Unroll

@Unroll
class HpoSearchServiceSpec extends Specification implements ServiceUnitTest<HpoSearchService>, DataTest {


    def setupSpec() {
      mockDomain DbTerm
      mockDomain DbDisease
      mockDomain DbGene
    }

    /*void "test searchAll terms #desc"() {

        setup:
        new DbTerm(name: 'Test Term 1', ontologyId: 'HP:1234XX', numberOfChildren: 10).save()

        when:
        final Map resultMap = service.searchAll(query)

        then:
        DbTerm.findByName('Test Term 1').ontologyId == 'HP:1234XX'
        resultMap.terms.data*.name == expected

        where:
        query         | expected        | desc
        null          | []              | 'null'
        ' '           | []              | 'blank'
        '   '         | []              | 'blank'
        '   \n'       | []              | 'blank'
        'test'        | ['Test Term 1'] | 'partial'
        'term'        | ['Test Term 1'] | 'partial'
        '1'           | ['Test Term 1'] | 'partial'
        'term test'   | ['Test Term 1'] | 'un-ordered terms'
        '1 term test' | ['Test Term 1'] | 'un-ordered terms'
        'test term 1' | ['Test Term 1'] | 'ignore case'
        'TEST TERM'   | ['Test Term 1'] | 'ignore case'
        'Test Term 1' | ['Test Term 1'] | 'exact match'
        'HP:1234XX'   | ['Test Term 1'] | 'ontology id match'

    }*/

    void "test trim and split #desc"(){
      when:
      final List<String> resultList = service.trimAndSplit(query)

      then:
      resultList == expected

      where:
      query   | expected    | desc
      ''      | null        | "blank"
      ' '     | null        | "one space"
      ' \n'   | null        | "blank newline"
      'TP53'  | ['TP53']      | "proper string"
      'TP53 ' | ['TP53']      | "proper string with space"
      'cat eyes' | ['cat','eyes'] | "two words no space"
      ' cat eyes ' | ['cat', 'eyes'] | "two words leading and trailing space"
    }

    void "test searchTerm prepared statement builder #desc"(){
        when:
        def termMap = [:]
        final String statement = service.buildSearchTermsAndSynonymsPS(terms, termMap, params)

        then:
        statement == expectedStatement
        termMap == expectedNamedParametersMap

        where:
        terms  << [[" "] ,["abnorm"], ["little", "test"]]
        params << [
                    [max: 10, offset: 0, sortPS : 'number_of_children', order: 'desc'],
                    [max: -1, offset: 0, sortPS : 'number_of_children', order: 'desc'],
                    [max: 10, offset: 1, sortPS: 'number_of_children', order: 'desc']
                  ]
        expectedStatement << [

                              "SELECT * FROM ( SELECT t.ontology_id, t.name, t.id, t.number_of_children FROM " +
                                "db_term t LEFT JOIN db_term_synonym s ON t.id = s.db_term_id WHERE " +
                                  "s.synonym LIKE :term0 UNION SELECT t.ontology_id, t.name, t.id, t.number_of_children " +
                                  "FROM db_term t WHERE t.name LIKE :term0 ) AS result_table ORDER BY " +
                                  "number_of_children desc, name desc LIMIT 10",

                              "SELECT * FROM ( SELECT t.ontology_id, t.name, t.id, t.number_of_children FROM " +
                                "db_term t LEFT JOIN db_term_synonym s ON t.id = s.db_term_id WHERE " +
                                  "s.synonym LIKE :term0 UNION SELECT t.ontology_id, t.name, t.id, t.number_of_children " +
                                  "FROM db_term t WHERE t.name LIKE :term0 ) AS result_table ORDER BY " +
                                  "number_of_children desc, name desc",

                              "SELECT * FROM ( SELECT t.ontology_id, t.name, t.id, t.number_of_children " +
                                  "FROM db_term t LEFT JOIN db_term_synonym s ON t.id = s.db_term_id " +
                                  "WHERE s.synonym LIKE :term0 AND s.synonym LIKE :term1 " +
                                  "UNION SELECT t.ontology_id, t.name, t.id, t.number_of_children " +
                                  "FROM db_term t WHERE t.name LIKE :term0 AND t.name LIKE :term1 ) " +
                                  "AS result_table ORDER BY number_of_children desc, name desc LIMIT 10"
                            ]


        expectedNamedParametersMap << [[term0: "% %"], [term0:"%abnorm%"], [term0: "%little%", term1: "%test%"]]
        desc << ["test space query limit 10", "one term with no limit", "two-term with limit 10"]
    }
    void "test searchAll terms sort by number of descendants #desc"() {
        //
        when:
        new DbTerm(name: 'Abnormality of the upper limb bone', ontologyId: 'HP:000222333444XX', numberOfChildren: 10).save()
        new DbTerm(name: 'Abnormality of the limb bone', ontologyId: 'HP:000222333XX', numberOfChildren: 20).save()
        new DbTerm(name: 'Abnormality of limbs', ontologyId: 'HP:000222XX', numberOfChildren: 30).save()
        new DbTerm(name: 'Abnormality of the eye', ontologyId: 'HP:000111XX', numberOfChildren: 40).save()
        new DbTerm(name: 'Abnormality', ontologyId: 'HP:000XX', numberOfChildren: 50).save()

        final Map resultMap = service.searchAll(query)

        then:
        resultMap.terms.data*.name == expected

        where:
        query                   | expected                                                                                                                                 | desc
        'HP:000'                | ['Abnormality', 'Abnormality of the eye', 'Abnormality of limbs', 'Abnormality of the limb bone', 'Abnormality of the upper limb bone']  | 'search sort 6'
        'HP:000222'             | ['Abnormality of limbs', 'Abnormality of the limb bone', 'Abnormality of the upper limb bone']                                           | 'search sort 7'
        'HP:000222333'          | ['Abnormality of the limb bone', 'Abnormality of the upper limb bone']                                                                   | 'search sort 8'
    }




    void "test searchAll diseases #desc"() {

      setup:
      new DbDisease(db: 'DECIPHER', dbId: '1', diseaseName: 'Cat eye syndrome', diseaseId: 'DECIPHER:1').save()
      new DbDisease(db: 'DECIPHER', dbId: '2', diseaseName: 'Eye syndrome', diseaseId: 'DECIPHER:2').save()
      new DbDisease(db: 'DECIPHER', dbId: '3', diseaseName: 'A syndrome', diseaseId: 'DECIPHER:3').save()

      when:
      query = service.trimAndSplit(query)
      final Map resultMap = service.searchDiseasesAll(query, 0, 10)

      then:
      resultMap.data*.diseaseName == expected

      where:
      query               | expected                                            | desc
      'eye'               | ['Cat eye syndrome', 'Eye syndrome']               | 'partial 1'
      'cat'               | ['Cat eye syndrome']                               | 'partial 2'
      'syndrome'          | ['A syndrome', 'Cat eye syndrome', 'Eye syndrome'] | 'partial & sort asc by disease name'
      'syndrome eye cat'  | ['Cat eye syndrome']                               | 'un-ordered search terms'
      'CAT EYE'           | ['Cat eye syndrome']                               | 'ignore case'
      'Cat eye syndrome'  | ['Cat eye syndrome']                               | 'exact match'

    }

    void "test searchAll genes #desc"() {

      setup:
        new DbGene(entrezGeneId: 1, entrezGeneSymbol: 'BRAF').save()
        new DbGene(entrezGeneId: 2, entrezGeneSymbol: 'BRAT1').save()
        new DbGene(entrezGeneId: 3, entrezGeneSymbol: 'BRCA2').save()
        new DbGene(entrezGeneId: 4, entrezGeneSymbol: 'BRCA1').save()

      when:
        query = service.trimAndSplit(query)
        final Map resultMap = service.searchGenesAll(query, 0, 10)

      then:
      resultMap.data*.entrezGeneSymbol == expected

      where:
      query    | expected                            | desc
      'BRA'    | ['BRAF', 'BRAT1']                   | 'partial 1'
      'BR'     | ['BRAF', 'BRAT1', 'BRCA1', 'BRCA2'] | 'sort asc by entrezGeneSymbol'
      'brca'   | ['BRCA1', 'BRCA2']                  | 'ignore case'
      'BRAF'   | ['BRAF']                            | 'exact match'

    }
}

package hpo.api.term

import com.github.phenomics.ontolib.formats.hpo.HpoTerm
import com.github.phenomics.ontolib.ontology.data.ImmutableTermId
import com.github.phenomics.ontolib.ontology.data.Term
import grails.testing.gorm.DomainUnitTest
import spock.lang.Specification

/**
 * Created by djd on 10/23/17.
 */
class DbTermUnitSpec extends Specification implements DomainUnitTest<DbTerm> {


    void "test term constructor"() {
        given:
        Term term = new HpoTerm(
                ImmutableTermId.constructWithPrefix("HP:0000006"),
                [],
                'A term name',
                'Descriptive definition',
                'Informative commment',
                [],
                [],
                false,
                'someUser',
                new Date(),
                []
        )

        when:
        DbTerm dbTerm = new DbTerm(term)

        then:
        verifyAll {
            dbTerm.ontologyId == term.id.idWithPrefix
            dbTerm.name == term.name
            dbTerm.isObsolete == term.isObsolete()
            dbTerm.definition == term.definition
            dbTerm.comment == term.comment
        }

    }
}

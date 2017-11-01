package hpo.api.disease

import com.github.phenomics.ontolib.formats.hpo.HpoDiseaseAnnotation
import com.github.phenomics.ontolib.ontology.data.ImmutableTermId
import grails.testing.gorm.DomainUnitTest
import spock.lang.Specification

class DbDiseaseUnitSpec extends Specification implements DomainUnitTest<DbDisease> {

  void setup(){
  }
  void "test disease constructor"() {
    given:
    HpoDiseaseAnnotation disease = new HpoDiseaseAnnotation(
      "ORPHA",
      "284400",
      "Small cell carcinoma of the bladder",
      null,
      ImmutableTermId.constructWithPrefix("HP:0000010"),
      "ORPHA:284400",
      "TAS",
      null,
      "HP:0040283",
      null,
      "O",
      null,
      new Date(),
      "orphadata"
    )

    when:
    DbDisease dbDisease = new DbDisease(disease)

    then:
    verifyAll {
      dbDisease.db  == disease.getDb()
      dbDisease.dbId == disease.getDbObjectId()
      dbDisease.dbName == disease.getDbName()
      dbDisease.qualifier == disease.getQualifier()
      dbDisease.hpoId == disease.getHpoId().getIdWithPrefix()
      dbDisease.diseaseId == disease.getDbReference()
      dbDisease.evidenceDescription == disease.getEvidenceDescription()
      dbDisease.onsetModifier == disease.getOnsetModifier()
      dbDisease.frequencyModifier == disease.getFrequencyModifier()
      dbDisease.withA == disease.getWith()
      dbDisease.aspect == disease.getAspect()
      dbDisease.synonym == disease.getSynonym()
      dbDisease.date == disease.getDate()
      dbDisease.assignedBy == disease.getAssignedBy()
    }
  }
}

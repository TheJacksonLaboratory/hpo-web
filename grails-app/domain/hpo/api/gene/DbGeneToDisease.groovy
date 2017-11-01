package hpo.api.gene

import hpo.api.models.HpoGeneDiseaseAnnotation

class DbGeneToDisease {
  Integer geneId;
  String geneSymbol;
  String diseaseId;


  static constraints = {
    diseaseId()
    geneSymbol()
    geneId()
  }

  DbGeneToDisease(){}

  DbGeneToDisease(HpoGeneDiseaseAnnotation geneMapping) {
    geneId = geneMapping.geneId
    geneSymbol = geneMapping.geneSymbol
    diseaseId = geneMapping.diseaseId
  }
}

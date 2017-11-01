package hpo.api.gene

import hpo.api.models.HpoGeneDiseaseAnnotation

class DbGeneToDisease {
  String diseaseId;
  String geneSymbol;
  Integer geneId;
  static constraints = {
    diseaseId()
    geneSymbol()
    geneId()
  }

  DbGeneToDisease(){}

  DbGeneToDisease(HpoGeneDiseaseAnnotation geneMapping){
    diseaseId = geneMapping.diseaseId
    geneSymbol = geneMapping.geneSymbol
    geneId = geneMapping.geneId
  }
}

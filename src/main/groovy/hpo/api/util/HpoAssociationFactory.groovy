package hpo.api.util

import org.grails.io.support.ClassPathResource
import org.monarchinitiative.phenol.formats.hpo.HpoDisease
import org.monarchinitiative.phenol.formats.hpo.HpoOntology
import org.monarchinitiative.phenol.io.assoc.HpoAssociationParser
import org.monarchinitiative.phenol.io.obo.hpo.HpoDiseaseAnnotationParser
import org.monarchinitiative.phenol.ontology.data.TermId

class HpoAssociationFactory {

  private String geneInfoPath
  private String diseaseToGenePath
  private File diseaseFilePath
  private HpoAssociationParser assocParser
  private Map<TermId, HpoDisease> diseaseMap

  HpoAssociationFactory(HpoOntology hpoOntology){
    this.geneInfoPath = new ClassPathResource('Homo_sapiens.gene_info.gz').file
    this.diseaseToGenePath = new ClassPathResource('mim2gene_medgen.txt').file
    this.diseaseFilePath =  new ClassPathResource('phenotype.hpoa').file
    HpoDiseaseAnnotationParser diseaseAnnotationParser = new HpoDiseaseAnnotationParser(this.diseaseFilePath, hpoOntology)
    this.diseaseMap =  diseaseAnnotationParser.parse()
    this.assocParser = new HpoAssociationParser(this.geneInfoPath, this.diseaseToGenePath, hpoOntology)
    this.assocParser.parse();
    this.assocParser.setTermToGene(diseaseAnnotationParser.getTermToDiseaseMap())
  }

  HpoAssociationParser getInstance(){
    return this.assocParser;
  }

}

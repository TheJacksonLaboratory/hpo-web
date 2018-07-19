package hpo.api.util

import com.google.common.collect.Multimap
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
  private Multimap<TermId, TermId> termToDisease

  HpoAssociationFactory(HpoOntology hpoOntology){
    this.geneInfoPath = new ClassPathResource('Homo_sapiens.gene_info.gz').file
    this.diseaseToGenePath = new ClassPathResource('mim2gene_medgen.txt').file
    this.diseaseFilePath =  new ClassPathResource('phenotype.hpoa').file
    HpoDiseaseAnnotationParser diseaseAnnotationParser = new HpoDiseaseAnnotationParser(this.diseaseFilePath, hpoOntology)
    this.diseaseMap =  diseaseAnnotationParser.parse()
    this.termToDisease = diseaseAnnotationParser.getTermToDiseaseMap()
    this.assocParser = new HpoAssociationParser(this.geneInfoPath, this.diseaseToGenePath, hpoOntology)
    this.assocParser.parse()
    this.assocParser.setTermToGene(termToDisease)
  }

  HpoAssociationParser getInstance(){
    return this.assocParser;
  }

  Map<TermId, HpoDisease> getDiseaseMap(){
    return this.diseaseMap;
  }
  Multimap<TermId, TermId> getTermToDisease(){
    return this.termToDisease;
  }
}

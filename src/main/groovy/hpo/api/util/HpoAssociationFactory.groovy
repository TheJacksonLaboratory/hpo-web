package hpo.api.util

import com.google.common.collect.ArrayListMultimap
import com.google.common.collect.Multimap
import org.grails.io.support.ClassPathResource
import org.monarchinitiative.phenol.annotations.assoc.HpoAssociationParser
import org.monarchinitiative.phenol.annotations.formats.hpo.HpoDisease
import org.monarchinitiative.phenol.annotations.obo.hpo.HpoDiseaseAnnotationParser
import org.monarchinitiative.phenol.ontology.data.Ontology
import org.monarchinitiative.phenol.ontology.data.TermId

class HpoAssociationFactory {

  private File geneInfoPath
  private File omimToGenePath;
  private File orphaToGenePath;
  private File diseaseFilePath
  private HpoAssociationParser assocParser
  private Map<TermId, HpoDisease> diseaseMap
  private Multimap<TermId, TermId> termToDisease

  HpoAssociationFactory(Ontology hpoOntology){
    this.geneInfoPath = new ClassPathResource('Homo_sapiens.gene_info.gz').file
    this.omimToGenePath = new ClassPathResource('mim2gene_medgen.txt').file
    this.diseaseFilePath =  new ClassPathResource('phenotype.hpoa').file
    this.orphaToGenePath = new ClassPathResource('orphanet_disease2gene.xml').file
    this.diseaseMap =  HpoDiseaseAnnotationParser.loadDiseaseMap(this.diseaseFilePath.toString(), hpoOntology)
    this.assocParser = new HpoAssociationParser(this.geneInfoPath, this.omimToGenePath, this.orphaToGenePath, this.diseaseFilePath, hpoOntology)
    this.termToDisease = buildTermToDisease()
    this.assocParser.setTermToGene(termToDisease)
  }


  Multimap<TermId, TermId> buildTermToDisease(){
    Multimap<TermId, TermId> termToDisease = ArrayListMultimap.create()
    this.diseaseMap.each { k, v ->
      v.getPhenotypicAbnormalityTermIdList().each { termId ->
        termToDisease.put(termId, k)
      }

      v.getModesOfInheritance().each { termId ->
        termToDisease.put(termId, k)
      }
    }
    return termToDisease
  }

  HpoAssociationParser getInstance(){
    return this.assocParser
  }

  Map<TermId, HpoDisease> getDiseaseMap(){
    return this.diseaseMap
  }

  Multimap<TermId, TermId> getTermToDisease(){
    return this.termToDisease
  }
}

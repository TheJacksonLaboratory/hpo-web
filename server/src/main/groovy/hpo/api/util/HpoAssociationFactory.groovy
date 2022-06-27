package hpo.api.util

import org.grails.io.support.ClassPathResource
import org.monarchinitiative.phenol.annotations.assoc.GeneInfoGeneType
import org.monarchinitiative.phenol.annotations.formats.hpo.HpoAssociationData
import org.monarchinitiative.phenol.annotations.formats.hpo.HpoDiseases
import org.monarchinitiative.phenol.annotations.io.hpo.HpoDiseaseLoaderOptions
import org.monarchinitiative.phenol.annotations.io.hpo.HpoDiseaseLoaders
import org.monarchinitiative.phenol.ontology.data.Ontology

class HpoAssociationFactory {

  private HpoAssociationData hpoAssociationData
  private HpoDiseases hpoDiseases

  HpoAssociationFactory(Ontology hpoOntology){
    final geneInfoPath = new ClassPathResource('Homo_sapiens.gene_info.gz').file.toPath()
    final omimToGenePath = new ClassPathResource('mim2gene_medgen.txt').file.toPath()
    final hpoFilePath =  new ClassPathResource('phenotype.hpoa').file.toPath()
    final orphaToGenePath = new ClassPathResource('orphanet_disease2gene.xml').file.toPath()
    this.hpoDiseases = HpoDiseaseLoaders.aggregated(hpoOntology, HpoDiseaseLoaderOptions.defaultOptions()).load(hpoFilePath)
    this.hpoAssociationData = HpoAssociationData.builder(hpoOntology).orphaToGenePath(orphaToGenePath)
      .hpoDiseases(hpoDiseases).homoSapiensGeneInfo(geneInfoPath, GeneInfoGeneType.DEFAULT).mim2GeneMedgen(omimToGenePath).build()
  }

  HpoAssociationData hpoAssociationData(){
    return this.hpoAssociationData;
  }

  HpoDiseases hpoDiseases(){
    return this.hpoDiseases
  }
}

package hpo.api.util

import org.grails.io.support.ClassPathResource
import org.monarchinitiative.phenol.annotations.formats.hpo.HpoAssociationData
import org.monarchinitiative.phenol.annotations.io.hpo.HpoaDiseaseData
import org.monarchinitiative.phenol.annotations.io.hpo.HpoaDiseaseDataContainer
import org.monarchinitiative.phenol.annotations.io.hpo.HpoaDiseaseDataLoader
import org.monarchinitiative.phenol.ontology.data.Ontology

class HpoAssociationFactory {

  private HpoAssociationData hpoAssociationData
  private HpoaDiseaseDataContainer hpoaDiseases

  HpoAssociationFactory(Ontology hpoOntology){
    final hgncPath = new ClassPathResource('hgnc_complete_set.txt').file.toPath()
    final omimToGenePath = new ClassPathResource('mim2gene_medgen').file.toPath()
    final hpoaFilePath =  new ClassPathResource('phenotype.hpoa').file.toPath()
    final orphaToGenePath = new ClassPathResource('en_product6.xml').file.toPath()
    this.hpoaDiseases = HpoaDiseaseDataLoader.of(["OMIM", "ORPHA"] as Set<String>).loadDiseaseData(hpoaFilePath)
    this.hpoAssociationData = HpoAssociationData.builder(hpoOntology).orphaToGenePath(orphaToGenePath)
      .hpoDiseases(hpoaDiseases).mim2GeneMedgen(omimToGenePath).hgncCompleteSetArchive(hgncPath).build()
  }

  HpoAssociationData hpoAssociationData(){
    return this.hpoAssociationData
  }

  List<HpoaDiseaseData> hpoDiseases(){
    return this.hpoaDiseases.diseaseData()
  }

}

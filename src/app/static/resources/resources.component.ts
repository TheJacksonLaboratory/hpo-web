import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css']
})
export class ResourcesComponent implements OnInit {
  pageTitle: String;
  pageIntro: String;
  consortiaData: Array<String>;
  toolsData: Array<String>;
  constructor() { 
    this.pageTitle = "Resources";
    this.pageIntro = " ";
    this.consortiaData = this.getConsortiaData();
    this.toolsData = this.getToolsData();

  }
  ngOnInit() {
  }
  
  getConsortiaData(){
    return [
      "Monarch Initiative",
      "NIH Undiagnosed disease program (UDP)",
      "Orphanet",
      "FORGE (Genome Canada)",
      "CARE for RARE",
      "Mouse Genome Informatics (MGI)",
      "Genomics England",
      "ECARUCA",
      "DECIPHER (Wellcome Trust)",
      "Wellcome Trust DDD",
      "GWAS Central",
      "International Rare Diseases Research Consortium (IRDiRC)",
      "International Collaboration for Clinical Genomics (ICCG)",
      "NCBI Genetic Testing Registry",
      "RIKEN",
      "NCBI ClinVar",
      "MedSeq",
      "Sequence Ontology/GVF",
      "Gen2Phen",
      "RD-Connect",
      "Gene2MP"
    ]
  }
  getToolsData(){
    return [
      "Phenomizer",
      "BOQA",
      "Exomiser",
      "PhenoTips",
      "PhenomeCentral",
      "MORPHIN (Model Organisms Projected on a Human Integrated Gene Network)",
      "PhenoDigm",
      "Uberpheno",
      "Phevor",
      "Face2Gene",
      "WebGestalt",
      "Superfamily Structural classification of protein",
      "ToppGene",
      "PhenoVar",
      "Phen-Gen",
      "Cartagenia BENCH",
      "eXtasy",
      "KnoSYS100",
      "GREAT",
      "PhenomeNet",
      "HeTOP",
      "Skeletome KB",
      "Bio-LarK",
      "GEPADO – Software Solutions for Genetics - GmbH",
      "OMIM Explorer"
    ]
  }

}

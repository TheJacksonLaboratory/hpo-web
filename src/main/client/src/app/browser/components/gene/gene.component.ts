import { Component, OnInit } from '@angular/core';
import { GeneEntrezService } from '../../services/gene/gene-entrez.service';
import { Gene } from './gene';
import { EntrezGene } from './gene';
import { ActivatedRoute } from '@angular/router';
import * as xml2js from 'xml2js';

@Component({
  selector: 'app-gene',
  templateUrl: './gene.component.html',
  styleUrls: ['./gene.component.css']
})
export class GeneComponent implements OnInit {
  geneTitle: string;
  geneInfo: object;
  entrezGene: EntrezGene =new EntrezGene();
  gene: Gene;
  query: string;

  constructor(private route: ActivatedRoute, private geneEntrezService: GeneEntrezService) {
    this.route.params.subscribe( params => this.query = params.id);
    this.entrezGene.otheraliases = '';
  }

  ngOnInit() {
    this.geneEntrezService.searchGeneInfo(this.query)
      .then((data) => {
        this.entrezGene = data.result[this.query];
        this.entrezGene.aliases = this.entrezGene.otheraliases.split(",");
        //this.entrezGene["otheraliases"] = this.entrezGene["otheraliases"].split(",");
        /*xml2js.parseString( data, function (err, result) {
          rootObj = result["Entrezgene-Set"].Entrezgene[0];
          console.log(rootObj.Entrezgene_gene[0]["Gene-ref"][0]);
          geneI = rootObj.Entrezgene_summary;
          console.log(geneI);
          geneTitle = rootObj.Entrezgene_gene[0]["Gene-ref"][0]["Gene-ref_locus"][0];
          geneLoc = rootObj.Entrezgene_gene[0]["Gene-ref"][0]["Gene-ref_maploc"][0];

       });*/
      }, (error) => {
        console.log(error);
    });
  }

}

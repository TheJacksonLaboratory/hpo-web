import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource  } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator} from '@angular/material/paginator';
import { Disease, Gene, Term, TermCategory } from '../../models/models';
import { DiseaseService } from '../../services/disease/disease.service';
import { DialogService } from '../../../shared/dialog-excel-download/dialog.service';

@Component({
  selector: 'app-disease',
  templateUrl: './disease.component.html',
  styleUrls: ['./disease.component.css']
})
export class DiseaseComponent {
  query: string;
  disease: Disease = {'db': '', 'dbObjectId': '0', 'dbName': '', 'dbReference': ''};
  termAssoc: Term[] = [];
  geneAssoc: Gene[] = [];
  termColumns = ['ontologyId', 'name', 'onset', 'frequency', 'sources' ];
  hasTerms = false;
  geneColumns = ['entrezGeneId', 'entrezGeneSymbol'];
  termDataSource: MatTableDataSource<Term>;
  geneDataSource: MatTableDataSource<Gene>;
  isLoading  = true;
  catTermSources: TermCategory[] = [];
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('genePaginator', { static: true }) genePaginator: MatPaginator;

  constructor(private route: ActivatedRoute, private diseaseService: DiseaseService, public dialogService: DialogService,
              private router: Router) {
    this.route.params.subscribe( (params) => {
      this.query = params.id;
      this.refreshData();
    });
  }

  refreshData() {
    this.diseaseService.searchDisease(this.query)
      .subscribe((data) => {
        this.disease  = data.disease;
        this.geneAssoc = data.geneAssoc;
        this.catTermSources = [];
        this.setCatTermsDBSource (data.catTermsMap);
        this.geneDataSource = new MatTableDataSource(this.geneAssoc);

        this.geneDataSource.paginator = this.genePaginator;
        this.diseaseService.searchMonarch(this.query)
          .subscribe((mData) => {
            this.disease.description = mData.description;
          });
        this.isLoading = false;
      }, (error) => {
        const errorString = 'Could not find requested disease id.';
        this.router.navigate(['/error'], {
          state: {
            description: errorString
          }});
        console.log(error);
      });

  }
  /**
   * Sets DB sources for Category-Term map data
   */
  setCatTermsDBSource(catTermsMap) {
    catTermsMap.map( term => {
      const catLabel = term.catLabel;
      const annotationCount = term.terms.length;
      if (term.terms.length > 0) {
        this.hasTerms = true;
      }
      const catTermSource = term.terms.map( fterm => {
        fterm.frequency = fterm.frequency === 'UNKNOWN' ? '-' : fterm.frequency;
        fterm.onset = fterm.onset === 'UNKNOWN' ? '-' : fterm.onset;
        const source = fterm.sources.split(',');
        fterm.sources = source[0] === 'UNKNOWN' ? [this.query] : source;
        return fterm;
      });
      const termSource = new MatTableDataSource(catTermSource);
      this.catTermSources.push({catLabel, annotationCount,  termSource});
    });
    // sort by custom list
    const sort_categories = ['Inheritance', 'Growth', 'Head and neck', 'Ear', 'Eye', 'Cardiovascular', 'Respiratory System',
      'Thoracic cavity', 'Breast', 'Digestive System', 'Endocrine', 'Genitourinary system', 'Immunology',
      'Blood and blood-forming tissues', 'Skeletal system', 'Musculature', 'Limbs', 'Connective tissue',
      'Skin, Hair, and Nails', 'Nervous System', 'Voice', 'Prenatal and Birth', 'Constitutional Symptom',
      'Neoplasm', 'Metabolism/Laboratory abnormality', 'Cellular phenotype' ];

    this.catTermSources.sort( function(a, b) {
      return sort_categories.indexOf(a.catLabel) - sort_categories.indexOf(b.catLabel);
    });
  }

  isPubmed(source: string) {
    return source.startsWith('PMID:');
  }

  getPubmedUrl(source: string) {
    return 'https://www.ncbi.nlm.nih.gov/pubmed/' + source.split(':')[1];
  }

  getExternalDiseaseUrl(source: string) {
    const sourceParts = source.split(':');
    if (sourceParts[0].startsWith('OMIM')) {
      return 'https://omim.org/entry/' + sourceParts[1];
    } else if(sourceParts[0].startsWith('ORPHA')) {
      return 'https://www.orpha.net/consor/cgi-bin/OC_Exp.php?Lng=EN&Expert=' + sourceParts[1];
    }
  }

  isSourceOrpha(source: string) {
    const sourceParts = source.split(':');
    if (sourceParts[0].startsWith('ORPHA')) {
      return true;
    }
  }

  isSourceOmim(source: string){
    const sourceParts = source.split(':');
    if (sourceParts[0].startsWith('OMIM')) {
      return true;
    }
  }

  applyGeneFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.geneDataSource.filter = filterValue;
  }

  downloadDialog() {
    const counts = {
      genes: this.geneAssoc.length,
      terms: this.termAssoc.length
    };
    this.dialogService.openDownloadDialog(this.disease.diseaseId, 'disease', counts);
  }
}

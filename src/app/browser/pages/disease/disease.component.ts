import {Component, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import { Disease, SimpleTerm, Term, TermCategory } from '../../models/models';
import { AnnotationService } from '../../services/annotation/annotation.service';
import {DialogService} from '../../../shared/dialog-excel-download/dialog.service';

@Component({
  selector: 'app-disease',
  templateUrl: './disease.component.html',
  styleUrls: ['./disease.component.css']
})
export class DiseaseComponent {
  query: string;
  disease: Disease;
  termAssoc: Term[] = [];
  termColumns = ['id', 'name', 'metadata.onset', 'metadata.frequency', 'metadata.sources'];
  hasTerms = false;
  geneColumns = ['id', 'name'];
  termDataSource: MatTableDataSource<Term>;
  geneDataSource: MatTableDataSource<SimpleTerm>;
  isLoading = true;
  catTermSources: TermCategory[] = [];
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('genePaginator', {static: true}) genePaginator: MatPaginator;

  constructor(private route: ActivatedRoute,
              public dialogService: DialogService, public annotationService: AnnotationService,
              private router: Router) {
    this.route.params.subscribe((params) => {
      this.query = params.id;
      this.refreshData();
    });
  }

  refreshData() {
    this.annotationService.fromDisease(this.query)
      .subscribe((data) => {
        this.disease = data.disease;
        this.catTermSources = [];
        this.setCatTermsDBSource(data.categories);
        this.geneDataSource = new MatTableDataSource(data.genes);
        this.geneDataSource.paginator = this.genePaginator;
        this.isLoading = false;
      }, (error) => {
        const errorString = 'Could not find requested disease id.';
        this.router.navigate(['/error'], {
          state: {
            description: errorString
          }
        });
        console.log(error);
      });

  }

  /**
   * Sets DB sources for Category-Term map data
   */
  setCatTermsDBSource(catTermsMap) {
    Object.keys(catTermsMap).map(key => {
      const values = catTermsMap[key];
      if (values.length > 0) {
        this.hasTerms = true;
      }
      const catTermSource = values.map(fterm => {
        fterm.metadata.frequency = fterm.metadata.frequency === null ? '-' : fterm.metadata.frequency;
        fterm.metadata.onset = fterm.metadata.onset === null ? '-' : fterm.metadata.onset;
        const source = fterm.metadata.sources;
        fterm.metadata.sources = source.length === 0 ? [this.query] : source;
        return fterm;
      });
      const termSource = new MatTableDataSource(catTermSource);
      this.catTermSources.push({catLabel: key, annotationCount: values.length, termSource});
    });

    const sort_categories = ['Inheritance', 'Growth', 'Head and neck', 'Ear', 'Eye', 'Cardiovascular', 'Respiratory System',
      'Thoracic cavity', 'Breast', 'Digestive System', 'Endocrine', 'Genitourinary system', 'Immunology',
      'Blood and blood-forming tissues', 'Skeletal system', 'Musculature', 'Limbs', 'Connective tissue',
      'Skin, Hair, and Nails', 'Nervous System', 'Voice', 'Prenatal and Birth', 'Constitutional Symptom',
      'Neoplasm', 'Metabolism/Laboratory abnormality', 'Cellular phenotype'];

    this.catTermSources.sort(function (a, b) {
      return sort_categories.indexOf(a.catLabel) - sort_categories.indexOf(b.catLabel);
    });
  }

  getExternalTermIdUrlFromId(termId?: string) {
    if(!termId){
      return '';
    }
    const sourceParts = termId.split(':');
    if (this.isTermIdExpected(termId, "OMIM")) {
      return `https://omim.org/entry/${sourceParts[1]}`;
    } else if (this.isTermIdExpected(termId, "ORPHA")) {
      return `https://www.orpha.net/consor/cgi-bin/OC_Exp.php?Lng=EN&Expert=${sourceParts[1]}`
    } else if (this.isTermIdExpected(termId, "MONDO")){
      return `https://monarchinitiative.org/disease/${termId}`;
    } else if(this.isTermIdExpected(termId, "PMID")){
      return `https://www.ncbi.nlm.nih.gov/pubmed/${sourceParts[1]}`;
    }
  }

  isTermIdExpected(diseaseId: string, expected: string) {
    return diseaseId != "" && diseaseId != null && expected != "" && expected != null
      ? diseaseId.toUpperCase().includes(expected) : false;
  }

  getDiseaseDatabaseName(diseaseId){
    return diseaseId != "" && diseaseId != null ? diseaseId.split(':')[0] : '';
  }

  applyGeneFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.geneDataSource.filter = filterValue;
  }

  downloadDialog() {
    const counts = {
      genes: this.geneDataSource.data.length,
      terms: this.termAssoc.length
    };
    this.dialogService.openDownloadDialog(this.disease.id, counts);
  }

  reportIssue() {
    if (this.disease.id.toUpperCase().includes("ORPHA")) {
      window.open("https://www.orpha.net/consor/cgi-bin/Directory_Contact.php?lng=EN", "_blank");
    } else
      window.open("https://github.com/obophenotype/human-phenotype-ontology/issues", "_blank");
  }
}

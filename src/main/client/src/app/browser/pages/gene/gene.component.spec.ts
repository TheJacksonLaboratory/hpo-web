/*import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneComponent } from './gene.component';
import { MatCardModule} from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { GeneService} from "../../services/gene/gene.service";
import { MatTableModule } from '@angular/material';
import { MatSortModule } from '@angular/material';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of'

describe('GeneComponent', () => {
  let component: GeneComponent;
  let fixture: ComponentFixture<GeneComponent>;

  let searchGeneResponse =
    {
    "gene":
      {
        "entrezGeneId": 7157, "entrezGeneSymbol": "TP53"
      },
    "termAssoc":
      [
        {"ontologyId": "HP:0000505", "name": "Visual impairment"},
        {"ontologyId": "HP:0002756", "name": "Pathologic fracture"},
        {"ontologyId": "HP:0009919", "name": "Retinoblastoma"}
      ],
    "diseaseAssoc": [
      {"diseaseId": "OMIM:151623", "diseaseName": "#151623 LI-FRAUMENI SYNDROME 1", "dbId": "151623", "db": "OMIM"},
      {"diseaseId": "OMIM:202300", "diseaseName": "ADRENOCORTICAL CARCINOMA, HEREDITARY", "dbId": "202300", "db": "OMIM"},
      {"diseaseId": "ORPHA:2807", "diseaseName": "Papilloma of choroid plexus", "dbId": "2807", "db": "ORPHA"}
    ]
    };

  let searchGeneInfoResponse = {
    "result": {
    "7157":
      {
        "uid": "7157",
        "name": "TP53",
        "description": "tumor protein p53",
        "status": "",
        "currentid": "",
        "chromosome": "17",
        "geneticsource": "genomic",
        "maplocation": "17p13.1",
        "otheraliases": "BCC7, LFS1, P53, TRP53",
        "nomenclaturesymbol": "TP53",
        "nomenclaturename": "tumor protein p53",
        "nomenclaturestatus": "Official",
      }
    }
  };

  let geneServiceStub = {
    searchGene: jasmine.createSpy('searchGene').and.returnValue(Observable.of(searchGeneResponse)),
    searchGeneInfo: jasmine.createSpy('searchGeneInfo').and.returnValue(Observable.of(searchGeneInfoResponse)),
    searchUniprot: jasmine.createSpy('searchUniprot').and.returnValue(Observable.of("something"))
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatCardModule, MatTableModule,MatSortModule],
      declarations: [ GeneComponent ],
      providers: [
        {provide: GeneService, useValue:geneServiceStub}
      ],

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneComponent);
    component = fixture.componentInstance;
    component.query = "7157";
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
*/

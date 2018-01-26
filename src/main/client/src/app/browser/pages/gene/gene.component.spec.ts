import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneComponent } from './gene.component';
import { MatCardModule} from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { GeneService} from "../../services/gene/gene.service";
import { MatTableModule } from '@angular/material';

describe('GeneComponent', () => {
  let component: GeneComponent;
  let fixture: ComponentFixture<GeneComponent>;
  let geneServiceStub = {
    searchGene: jasmine.createSpy('searchGene').and.returnValue(Promise.resolve("something")),
    searchGeneInfo: jasmine.createSpy('searchGeneInfo').and.returnValue(Promise.resolve("something")),
    searchUniprot: jasmine.createSpy('searchUniprot').and.returnValue(Promise.resolve("something"))
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatCardModule, MatTableModule],
      declarations: [ GeneComponent ],
      providers: [{provide: GeneService, useValue:geneServiceStub}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

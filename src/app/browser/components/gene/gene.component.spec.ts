import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneComponent } from './gene.component';
import { MatCardModule} from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { GeneEntrezService} from "../../services/gene/gene-entrez.service";

describe('GeneComponent', () => {
  let component: GeneComponent;
  let fixture: ComponentFixture<GeneComponent>;
  let geneServiceStub = {
    searchGeneInfo: jasmine.createSpy('searchGeneInfo').and.returnValue(Promise.resolve("something")),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatCardModule],
      declarations: [ GeneComponent ],
      providers: [{provide: GeneEntrezService,  useValue: geneServiceStub }]
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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchbarComponent } from './searchbar.component';
import { Phenotype } from '../Phenotypes';

describe('SearchbarComponent', () => {
  let component: SearchbarComponent;
  let fixture: ComponentFixture<SearchbarComponent>;

  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchbarComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  var testPhenotype: [{"id":"","phenotype":"Open angle glaucoma","diseases":[""]}]
  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should filter data',() => {
    component.pheno = testPhenotype
    component.query = "g"
    component.filter()
  });
});

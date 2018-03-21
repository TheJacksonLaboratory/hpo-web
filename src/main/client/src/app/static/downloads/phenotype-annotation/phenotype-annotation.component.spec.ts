import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhenotypeAnnotationComponent } from './phenotype-annotation.component';

describe('PhenotypeAnnotationComponent', () => {
  let component: PhenotypeAnnotationComponent;
  let fixture: ComponentFixture<PhenotypeAnnotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhenotypeAnnotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhenotypeAnnotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

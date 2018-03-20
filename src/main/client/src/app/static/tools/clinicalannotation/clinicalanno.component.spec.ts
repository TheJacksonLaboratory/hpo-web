import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalAnnotationComponent } from './clinicalanno.component';

describe('ClinicalannoComponent', () => {
  let component: ClinicalAnnotationComponent;
  let fixture: ComponentFixture<ClinicalAnnotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClinicalAnnotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicalAnnotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

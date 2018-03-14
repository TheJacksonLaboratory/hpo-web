import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalannoComponent } from './clinicalanno.component';

describe('ClinicalannoComponent', () => {
  let component: ClinicalannoComponent;
  let fixture: ComponentFixture<ClinicalannoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClinicalannoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicalannoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

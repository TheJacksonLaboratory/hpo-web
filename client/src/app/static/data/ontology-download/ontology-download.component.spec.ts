import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {OntologyDownloadComponent} from './ontology-download.component';

describe('OntologyComponent', () => {
  let component: OntologyDownloadComponent;
  let fixture: ComponentFixture<OntologyDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OntologyDownloadComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OntologyDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

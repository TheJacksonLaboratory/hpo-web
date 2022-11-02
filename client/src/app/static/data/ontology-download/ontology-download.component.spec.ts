import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OntologyDownloadComponent} from './ontology-download.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OntologyComponent', () => {
  let component: OntologyDownloadComponent;
  let fixture: ComponentFixture<OntologyDownloadComponent>;

  beforeEach(( ) => {
    TestBed.configureTestingModule({
      declarations: [OntologyDownloadComponent],
      imports: [HttpClientTestingModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OntologyDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

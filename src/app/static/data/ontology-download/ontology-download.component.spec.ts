import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OntologyDownloadComponent } from './ontology-download.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('OntologyComponent', () => {
  let component: OntologyDownloadComponent;
  let fixture: ComponentFixture<OntologyDownloadComponent>;

  beforeEach(( ) => {
    TestBed.configureTestingModule({
    imports: [OntologyDownloadComponent],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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

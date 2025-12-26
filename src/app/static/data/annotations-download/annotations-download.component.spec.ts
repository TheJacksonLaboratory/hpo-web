import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AnnotationsDownloadComponent } from './annotations-download.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { GlobalMaterialModules } from '../../../shared/modules/global.module';
describe('AnnotationsComponent', () => {
  let component: AnnotationsDownloadComponent;
  let fixture: ComponentFixture<AnnotationsDownloadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [],
    imports: [AnnotationsDownloadComponent, GlobalMaterialModules],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotationsDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SearchComponent} from './search.component';
import {GlobalMaterialModules} from '../../modules/global.module';
import {RouterTestingModule} from '@angular/router/testing';
import {HighlightPipe} from '../../pipes/highlight.pipe';
import {SearchService} from '../service/search.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('NewsearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    declarations: [SearchComponent, HighlightPipe],
    imports: [GlobalMaterialModules, RouterTestingModule,
        NoopAnimationsModule, FormsModule],
    providers: [SearchService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

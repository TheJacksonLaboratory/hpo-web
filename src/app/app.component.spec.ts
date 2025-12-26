import { TestBed, waitForAsync } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SearchService } from './shared/search/service/search.service';
import { NewsService } from './shared/news/news.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
        AppComponent,
        NoopAnimationsModule],
    providers: [SearchService, NewsService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting(), provideRouter([]),
    provideLocationMocks()]
}).compileComponents();
  }));

  it('should create the app', waitForAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('it should check that search url environment variable is set', () => {

    //Check an example of one of the evironment variables
    const searchUrl = environment.ONTOLOGY_API_HP_SEARCH;
    expect(searchUrl).toContain('hp/search');
  });
});

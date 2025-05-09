import { TestBed, waitForAsync } from '@angular/core/testing';
import {NavbarComponent} from './shared/navbar/navbar.component';
import {FooterComponent} from './shared/footer/footer.component';
import {AppComponent} from './app.component';
import {RouterTestingModule} from '@angular/router/testing';
import {environment} from '../environments/environment';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {GlobalMaterialModules} from './shared/modules/global.module';
import {FormsModule} from '@angular/forms';
import {ExtrasModule} from './shared/modules/extras.module';
import {SearchService} from './shared/search/service/search.service';
import {NewsService} from './shared/news/news.service';
import {SearchModule} from './shared/search/search.module';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';


describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        FooterComponent
    ],
    imports: [RouterTestingModule,
        GlobalMaterialModules,
        FormsModule,
        ExtrasModule,
        SearchModule,
        NoopAnimationsModule],
    providers: [SearchService, NewsService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
  }));

  it('should create the app', waitForAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('it should check that search url environment variable is set', () => {

    //Check an example of one of the evironment variables
    let searchUrl = environment.ONTOLOGY_API_HP_SEARCH;
    expect(searchUrl).toContain('hp/search');
  });
});

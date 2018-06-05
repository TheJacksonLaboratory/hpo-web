import { TestBed, async } from '@angular/core/testing';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '../environments/environment';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { GlobalMaterialModules } from "./shared/modules/global.module";
import { FormsModule } from "@angular/forms";
import { ExtrasModule } from "./shared/modules/extras.module";
import { SearchService } from "./shared/search/service/search.service";
import { NewsService } from "./shared/news/news.service";
import { SearchModule } from "./shared/search/search.module";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";


describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule,
        GlobalMaterialModules,
        HttpClientTestingModule,
        FormsModule,
        ExtrasModule,
        SearchModule,
        NoopAnimationsModule
      ],
      declarations: [
        AppComponent,
        NavbarComponent,
        FooterComponent
      ],
      providers: [ SearchService, NewsService ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('it should check that search url environment variable is set', () =>{

    //Check an example of one of the evironment variables
     let searchUrl  =  environment.HPO_API_SEARCH_URL;
     expect(searchUrl).toContain('hpo/search');
  });
});

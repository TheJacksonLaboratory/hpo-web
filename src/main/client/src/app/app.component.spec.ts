import { TestBed, async } from '@angular/core/testing';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatMenuModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatIconModule } from '@angular/material';
import { environment} from '../environments/environment';
import {HttpClientModule} from "@angular/common/http";

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule, MatButtonModule, MatMenuModule, MatIconModule,HttpClientModule],
      declarations: [
        AppComponent,
        NavbarComponent,
        FooterComponent
      ]
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

import { ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {NavbarComponent} from './navbar.component';
import {GlobalMaterialModules} from "../modules/global.module";
import {SearchModule} from "../search/search.module";
import {FormsModule} from "@angular/forms";
import {ExtrasModule} from "../modules/extras.module";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [NavbarComponent],
    imports: [GlobalMaterialModules,
        FormsModule,
        ExtrasModule,
        SearchModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting(), provideRouter([])]
})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { HomeComponent } from './home.component';
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { SearchModule } from "../../shared/search/search.module";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { NewsService } from "../../shared/news/news.service";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { GlobalMaterialModules } from '../../shared/modules/global.module';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [HomeComponent],
    imports: [GlobalMaterialModules,
        NoopAnimationsModule,
        SearchModule],
    providers: [NewsService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

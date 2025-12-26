import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ProfileSearchComponent } from './profile-search.component';
import { SearchService } from "../../../shared/search/service/search.service";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('ProfileSearchComponent', () => {
  let component: ProfileSearchComponent;
  let fixture: ComponentFixture<ProfileSearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [ProfileSearchComponent, NoopAnimationsModule],
    providers: [SearchService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting(), provideRouter([])]
})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

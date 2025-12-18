import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ProfileSearchComponent } from './profile-search.component';
import { SearchService } from "../../../shared/search/service/search.service";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { GlobalMaterialModules } from "../../../shared/modules/global.module";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
describe('ProfileSearchComponent', () => {
  let component: ProfileSearchComponent;
  let fixture: ComponentFixture<ProfileSearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [ProfileSearchComponent],
    imports: [GlobalMaterialModules, NoopAnimationsModule, ReactiveFormsModule],
    providers: [SearchService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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

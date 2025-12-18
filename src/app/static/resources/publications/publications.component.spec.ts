import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PublicationsComponent } from './publications.component';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalMaterialModules } from '../../../shared/modules/global.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('PublicationsComponent', () => {
  let component: PublicationsComponent;
  let fixture: ComponentFixture<PublicationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [PublicationsComponent],
    imports: [MatTableModule, FormsModule,
        ReactiveFormsModule, GlobalMaterialModules, NoopAnimationsModule],
    providers: [provideHttpClient(withInterceptorsFromDi())]
})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

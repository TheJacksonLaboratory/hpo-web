import { of as observableOf } from 'rxjs';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NewsComponent } from './news.component';
import { NewsService } from '../../shared/news/news.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('NewsComponent', () => {
  let component: NewsComponent;
  let fixture: ComponentFixture<NewsComponent>;

  beforeEach(waitForAsync(() => {
    // Mock window.matchMedia to prevent 'addEventListener not a function' errors
    window.matchMedia = window.matchMedia || function() {
      return {
        matches: false,
        media: '',
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
        onchange: null,
        dispatchEvent: jest.fn(),
      };
    };
    TestBed.configureTestingModule({
    imports: [NewsComponent, NoopAnimationsModule],
    providers: [NewsService, { provide: ActivatedRoute, useValue: { params: observableOf('') } },
        provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting(), LayoutModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

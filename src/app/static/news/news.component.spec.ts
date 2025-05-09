import {of as observableOf} from 'rxjs';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NewsComponent} from './news.component';
import {NewsService} from '../../shared/news/news.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {ActivatedRoute} from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('NewsComponent', () => {
  let component: NewsComponent;
  let fixture: ComponentFixture<NewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    declarations: [NewsComponent],
    imports: [],
    providers: [NewsService, { provide: ActivatedRoute, useValue: { params: observableOf('') } }, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
      .compileComponents();
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

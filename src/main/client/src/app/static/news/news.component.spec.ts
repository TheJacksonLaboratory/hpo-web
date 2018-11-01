import {of as observableOf, Observable} from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NewsComponent } from './news.component';
import { NewsService } from '../../shared/news/news.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('NewsComponent', () => {
  let component: NewsComponent;
  let fixture: ComponentFixture<NewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ NewsComponent ],
      providers: [ NewsService, { provide: ActivatedRoute, useValue: {params: observableOf('')}} ]
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

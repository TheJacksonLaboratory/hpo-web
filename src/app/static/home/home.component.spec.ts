import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatLegacyCardModule as MatCardModule} from '@angular/material/legacy-card';
import {HomeComponent} from './home.component';
import {MatIconModule} from "@angular/material/icon";
import {MatLegacyListModule as MatListModule} from "@angular/material/legacy-list";
import {SearchModule} from "../../shared/search/search.module";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {NewsService} from "../../shared/news/news.service";
import {RouterTestingModule} from "@angular/router/testing";

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [MatCardModule,
        MatIconModule,
        MatListModule,
        NoopAnimationsModule,
        SearchModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [NewsService]
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

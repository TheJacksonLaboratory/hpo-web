import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TermService } from '../../services/term/term.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SearchComponent } from './search.component';
import { MatCardModule} from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { SortPipe } from '../../pipes/sort-pipe';
import { SearchService} from '../../services/search/search.service';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';

describe('SearchHpoComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let mockTermService;
  let searchServiceStub = {
    searchAll: jasmine.createSpy('queryHPO').and.returnValue(Observable.of("something")),
  };
  beforeEach(async(() => {
    mockTermService = {}
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule, NoopAnimationsModule, MatCardModule],
      declarations: [ SearchComponent, SortPipe ],
      providers: [{provide:SearchService, useValue:searchServiceStub}, {provide: TermService, useValue: mockTermService }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

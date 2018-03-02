import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TermService } from '../../../browse/services/term/term.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SearchOutputComponent } from './search.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SortPipe } from '../../pipes/sort-pipe';
import { HighlightPipe} from "../../pipes/highlight.pipe";
import { SearchService} from '../service/search.service';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';
import { MatCardModule} from '@angular/material/card';
import { MatIconModule} from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from "@angular/material";

describe('SearchComponent', () => {
  let component: SearchOutputComponent;
  let fixture: ComponentFixture<SearchOutputComponent>;
  let mockTermService;
  let searchServiceStub = {
    searchAll: jasmine.createSpy('queryHPO').and.returnValue(Observable.of("something")),
  };
  beforeEach(async(() => {
    mockTermService = {};
    TestBed.configureTestingModule({
      imports: [RouterTestingModule,
        FormsModule,
        NoopAnimationsModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressBarModule
      ],
      declarations: [ SearchOutputComponent, SortPipe, HighlightPipe ],
      providers: [{provide:SearchService, useValue:searchServiceStub}, {provide: TermService, useValue: mockTermService }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

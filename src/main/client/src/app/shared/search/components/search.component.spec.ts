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
    searchAll: jasmine.createSpy('queryHPO').and
      .returnValue(
        Observable.of(
          {
            terms: [{name: "Abnormality of the Bladder", ontologyId: "HPO:00723843", id: "00723843"}],
            diseases:[{dbRef: "ORPHA: 9222001", dbName: "Bladder Carcinoma"}],
            genes: [{entrezGeneSymbol: "TP53", entrezGeneId: 7157}]
          }
      )),
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
      providers: [{provide:SearchService, useValue:searchServiceStub}]
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

  it('should test checkEmpty Function', () =>{
     let testData_empty = [];
     let testData_items = ["item 1"];
     expect(component.checkEmpty(testData_empty)).toBeFalsy();
     expect(component.checkEmpty(testData_items)).toBeTruthy();
  });

  it( 'should engage and set query when searchString input',() => {
    spyOn(component,"engageSearch");
    component.searchString = "bladder";
    fixture.detectChanges();
    expect(component.query).toEqual("bladder");
    expect(component.engageSearch).toHaveBeenCalled();
  });

  it('should call queryHPO and set response items', () => {
    component.queryHPO("bladder");
    fixture.detectChanges();
    expect(component.terms.length).toEqual(1);


  })
});

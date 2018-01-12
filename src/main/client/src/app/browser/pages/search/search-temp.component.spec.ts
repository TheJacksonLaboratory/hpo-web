import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from './search.component';
import { TermService } from '../../services/term/term.service';
import { MatIconModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { SortPipe } from '../../pipes/sort-pipe';
import { SearchService} from "../../services/search/search.service";


describe('SearchbarComponent', () => {
  let component;
  let fixture;
  let termService;
  let spy;
  const testTerm = {"id": "HPO00test", "name": "testingname"};
  let searchServiceStub = {
    searchAll: jasmine.createSpy('searchAll').and.returnValue(Promise.resolve("something")),
  };

  let termServiceStub = {
    searchTerm: jasmine.createSpy('searchTerm').and.returnValue(Promise.resolve(testTerm)),
  };


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchComponent, SortPipe ],
      providers: [{provide:SearchService, useValue:searchServiceStub}, {provide:TermService, useValue:termServiceStub}],
      imports: [RouterTestingModule, FormsModule, MatIconModule],
    });

  fixture = TestBed.createComponent(SearchComponent);
  component = fixture.componentInstance;
  termService = TestBed.get(TermService);

  /*termService = fixture.debugElement.injector.get(TermService);

  spy = spyOn(termService, 'searchTerm')
            .and.returnValue(Promise.resolve(testTerm))*/

  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should test q = "tes" and should return data',() => {
    component.query = 'tes';
    component.filter();
    fixture.detectChanges();
    component.searchActive.subscribe(t => {expect(t).toBe(true, 'Event Emitted')});
    //expect(spy.calls.any()).toBe(true, 'getQuote called');
    termService.searchTerm().then((data) => { expect(data.id).toEqual("HPO00test", 'Data Returned/Matched')});
  });
});

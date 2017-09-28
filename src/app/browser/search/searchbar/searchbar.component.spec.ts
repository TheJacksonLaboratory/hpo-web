import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { SearchbarComponent } from './searchbar.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TermService } from '../../services/term-service';
import { Phenotype } from '../Phenotypes';

describe('SearchbarComponent', () => {
  let component;
  let fixture;
  let termService;
  let spy;
  const testTerm = {"id": "HPO00test", "name": "testingname"};

  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchbarComponent ],
      providers: [TermService],
      imports: [FormsModule, MaterialModule, HttpModule, NoopAnimationsModule]
    });

  fixture = TestBed.createComponent(SearchbarComponent);
  component = fixture.componentInstance;
  termService = fixture.debugElement.injector.get(TermService);

  spy = spyOn(termService, 'searchTerms')
            .and.returnValue(Promise.resolve(testTerm))

  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should test q = "tes" and should return data',() => {
    var result: Phenotype;
    component.query = "tes";
    component.filter();
    fixture.detectChanges();
    component.searchActive.subscribe(t => {expect(t).toBe(true, 'Event Emitted')});
    expect(spy.calls.any()).toBe(true, 'getQuote called');
    termService.searchTerms().then((data) => { expect(data.id).toEqual("HPO00test", 'Data Returned/Matched') });    
    ;
  });
});

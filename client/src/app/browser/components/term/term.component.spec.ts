import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TermComponent } from './term.component';
import { MatMenuModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatIconModule } from '@angular/material';
import { MatToolbarModule} from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { TermService} from "../../services/term/term.service";

describe('TermComponent', () => {
  let component: TermComponent;
  let fixture: ComponentFixture<TermComponent>;
  let testTerm = {"id": "HPO00test", "name": "testingname"};
  let termServiceStub = {
    searchTerm: jasmine.createSpy('searchTerm').and.returnValue(Promise.resolve(testTerm))
  };


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatButtonModule, MatMenuModule, MatIconModule, MatToolbarModule],
      declarations: [ TermComponent ],
      providers: [{provide:TermService, useValue:termServiceStub}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

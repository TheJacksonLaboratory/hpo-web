import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from '@angular/material';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { TermService } from '../services/term-service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MainSearchComponent } from './search.component';
import { SearchbarComponent } from './searchbar/searchbar.component'

describe('SearchHpoComponent', () => {
  let component: MainSearchComponent;
  let fixture: ComponentFixture<MainSearchComponent>;
  let mockTermService;
  beforeEach(async(() => {
    mockTermService = {}
    TestBed.configureTestingModule({
      declarations: [ MainSearchComponent, SearchbarComponent  ],
      imports: [MaterialModule, FormsModule, HttpModule, NoopAnimationsModule ],
      providers: [{provide: TermService, useValue: mockTermService }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

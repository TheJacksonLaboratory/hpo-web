import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchComponent} from './pages/search/search.component';
import { BrowserComponent } from './browser.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconModule } from '@angular/material';
import { SortPipe } from './pipes/sort-pipe';
import { FormsModule } from '@angular/forms';
import { SearchService} from './services/search/search.service';


describe('BrowserComponent', () => {
  let component: BrowserComponent;
  let fixture: ComponentFixture<BrowserComponent>;
  let mockSearchService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule, MatIconModule],
      declarations: [ BrowserComponent, SearchComponent, SortPipe ],
      providers: [{provide: SearchService, useValue: mockSearchService}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

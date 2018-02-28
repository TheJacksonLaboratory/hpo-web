import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchComponent} from './pages/search/search.component';
import { BrowserComponent } from './browser.component';
import { RouterTestingModule } from '@angular/router/testing';

import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule} from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { SortPipe } from './pipes/sort-pipe';
import { HighlightPipe} from "./pipes/highlight.pipe";
import { FormsModule } from '@angular/forms';
import { SearchService} from './services/search/search.service';
import { NoopAnimationsModule } from "@angular/platform-browser/animations";


describe('BrowserComponent', () => {
  let component: BrowserComponent;
  let fixture: ComponentFixture<BrowserComponent>;
  let mockSearchService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule,
        FormsModule,
        MatIconModule,
        MatCardModule,
        MatProgressBarModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule
      ],
      declarations: [ BrowserComponent, SearchComponent, SortPipe, HighlightPipe ],
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

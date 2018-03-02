import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchbarComponent } from './searchbar.component';
import { GlobalMaterialModules} from "../../../global.module";
import { FormsModule} from "@angular/forms";
import { SearchOutputComponent } from "../search.component";
import { RouterModule } from "@angular/router";
import { HighlightPipe } from "../../../pipes/highlight.pipe";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

describe('SearchbarComponent', () => {
  let component: SearchbarComponent;
  let fixture: ComponentFixture<SearchbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchbarComponent, SearchOutputComponent, HighlightPipe ],
      imports: [GlobalMaterialModules , FormsModule, RouterModule, NoopAnimationsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

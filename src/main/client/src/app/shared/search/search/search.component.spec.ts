import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchComponent } from './search.component';
import { GlobalMaterialModules } from '../../modules/global.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HighlightPipe } from '../../pipes/highlight.pipe';
import { SearchService } from '../service/search.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

describe('NewsearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[ GlobalMaterialModules, RouterTestingModule,
        HttpClientTestingModule, NoopAnimationsModule, FormsModule  ],
      declarations: [ SearchComponent,  HighlightPipe ],
      providers: [ SearchService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

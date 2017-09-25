import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchHpoComponent } from './search-hpo.component';

describe('SearchHpoComponent', () => {
  let component: SearchHpoComponent;
  let fixture: ComponentFixture<SearchHpoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchHpoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchHpoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

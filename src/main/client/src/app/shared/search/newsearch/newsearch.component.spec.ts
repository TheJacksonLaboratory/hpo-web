import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsearchComponent } from './newsearch.component';

describe('NewsearchComponent', () => {
  let component: NewsearchComponent;
  let fixture: ComponentFixture<NewsearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

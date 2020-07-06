import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntersectingComponent } from './intersecting.component';

describe('IntersectingComponent', () => {
  let component: IntersectingComponent;
  let fixture: ComponentFixture<IntersectingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntersectingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntersectingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

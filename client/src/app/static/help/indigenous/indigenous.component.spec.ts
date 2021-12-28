import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {IndigenousComponent} from './indigenous.component';

describe('IndigenousComponent', () => {
  let component: IndigenousComponent;
  let fixture: ComponentFixture<IndigenousComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IndigenousComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndigenousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IndigenousComponent } from './indigenous.component';

describe('IndigenousComponent', () => {
  let component: IndigenousComponent;
  let fixture: ComponentFixture<IndigenousComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IndigenousComponent]
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

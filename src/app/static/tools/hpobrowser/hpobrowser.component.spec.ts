import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HpobrowserComponent } from './hpobrowser.component';

describe('HpobrowserComponent', () => {
  let component: HpobrowserComponent;
  let fixture: ComponentFixture<HpobrowserComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HpobrowserComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HpobrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HpOwlComponent } from './hp-owl.component';

describe('HpOwlComponent', () => {
  let component: HpOwlComponent;
  let fixture: ComponentFixture<HpOwlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HpOwlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HpOwlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

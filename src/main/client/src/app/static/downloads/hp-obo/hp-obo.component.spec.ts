import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HpOboComponent } from './hp-obo.component';

describe('HpOboComponent', () => {
  let component: HpOboComponent;
  let fixture: ComponentFixture<HpOboComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HpOboComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HpOboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LoincComponent} from './loinc.component';

describe('LoincComponent', () => {
  let component: LoincComponent;
  let fixture: ComponentFixture<LoincComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoincComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoincComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

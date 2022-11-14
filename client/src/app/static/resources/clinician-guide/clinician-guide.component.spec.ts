import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ClinicianGuideComponent} from './clinician-guide.component';

describe('ClinicianGuideComponent', () => {
  let component: ClinicianGuideComponent;
  let fixture: ComponentFixture<ClinicianGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClinicianGuideComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicianGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

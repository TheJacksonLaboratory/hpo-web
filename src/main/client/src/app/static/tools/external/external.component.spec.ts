import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalHPOComponent } from './external.component';

describe('ExternalHPOComponent', () => {
  let component: ExternalHPOComponent;
  let fixture: ComponentFixture<ExternalHPOComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalHPOComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalHPOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

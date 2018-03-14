import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalhpoComponent } from './externalhpo.component';

describe('ExternalhpoComponent', () => {
  let component: ExternalhpoComponent;
  let fixture: ComponentFixture<ExternalhpoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalhpoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalhpoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

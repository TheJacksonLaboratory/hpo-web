import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternaltoolsComponent } from './internaltools.component';

describe('InternaltoolsComponent', () => {
  let component: InternaltoolsComponent;
  let fixture: ComponentFixture<InternaltoolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternaltoolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternaltoolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

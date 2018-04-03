import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherToolsComponent } from './other.component';

describe('InternalToolsComponent', () => {
  let component: OtherToolsComponent;
  let fixture: ComponentFixture<OtherToolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherToolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

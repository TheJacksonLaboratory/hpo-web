import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalToolsComponent } from './internaltools.component';

describe('InternalToolsComponent', () => {
  let component: InternalToolsComponent;
  let fixture: ComponentFixture<InternalToolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalToolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalToolsComponent } from './external.component';

describe('ExternalToolsComponent', () => {
  let component: ExternalToolsComponent;
  let fixture: ComponentFixture<ExternalToolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalToolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

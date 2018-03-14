import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhenogramvizComponent } from './phenogramviz.component';

describe('PhenogramvizComponent', () => {
  let component: PhenogramvizComponent;
  let fixture: ComponentFixture<PhenogramvizComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhenogramvizComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhenogramvizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

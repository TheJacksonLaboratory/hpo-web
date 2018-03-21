import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhenomizerComponent } from './phenomizer.component';

describe('PhenomizerComponent', () => {
  let component: PhenomizerComponent;
  let fixture: ComponentFixture<PhenomizerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhenomizerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhenomizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

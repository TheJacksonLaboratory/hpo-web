import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GenomiserComponent} from './genomiser.component';

describe('GenomiserComponent', () => {
  let component: GenomiserComponent;
  let fixture: ComponentFixture<GenomiserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GenomiserComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenomiserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GenomiserComponent } from './genomiser.component';

describe('GenomiserComponent', () => {
  let component: GenomiserComponent;
  let fixture: ComponentFixture<GenomiserComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [GenomiserComponent]
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

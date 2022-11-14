import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhenopacketComponent } from './phenopacket.component';

describe('PhenopacketComponent', () => {
  let component: PhenopacketComponent;
  let fixture: ComponentFixture<PhenopacketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhenopacketComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhenopacketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

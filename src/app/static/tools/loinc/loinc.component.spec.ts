import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LoincComponent } from './loinc.component';

describe('LoincComponent', () => {
  let component: LoincComponent;
  let fixture: ComponentFixture<LoincComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [LoincComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoincComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

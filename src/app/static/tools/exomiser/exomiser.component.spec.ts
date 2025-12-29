import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ExomiserComponent } from './exomiser.component';

describe('ExomiserComponent', () => {
  let component: ExomiserComponent;
  let fixture: ComponentFixture<ExomiserComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ExomiserComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExomiserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

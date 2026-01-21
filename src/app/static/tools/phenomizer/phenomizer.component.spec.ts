import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PhenomizerComponent } from './phenomizer.component';

describe('PhenomizerComponent', () => {
  let component: PhenomizerComponent;
  let fixture: ComponentFixture<PhenomizerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PhenomizerComponent]
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

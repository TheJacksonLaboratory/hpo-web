import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LaypersonComponent } from './layperson.component';

describe('LaypersonComponent', () => {
  let component: LaypersonComponent;
  let fixture: ComponentFixture<LaypersonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [LaypersonComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaypersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

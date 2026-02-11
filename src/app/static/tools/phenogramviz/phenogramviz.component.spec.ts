import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PhenogramVizComponent } from './phenogramviz.component';

describe('PhenogramVizComponent', () => {
  let component: PhenogramVizComponent;
  let fixture: ComponentFixture<PhenogramVizComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PhenogramVizComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhenogramVizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

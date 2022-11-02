import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AnnotationFormatComponent} from './annotation-format.component';

describe('AnnotationComponent', () => {
  let component: AnnotationFormatComponent;
  let fixture: ComponentFixture<AnnotationFormatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnnotationFormatComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotationFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

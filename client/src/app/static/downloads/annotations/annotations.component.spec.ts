import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AnnotationsDownloadComponent} from './annotations.component';

describe('AnnotationsComponent', () => {
  let component: AnnotationsDownloadComponent;
  let fixture: ComponentFixture<AnnotationsDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnnotationsDownloadComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotationsDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

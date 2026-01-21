import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TranslationComponent } from './translation.component';

describe('MappingComponent', () => {
  let component: TranslationComponent;
  let fixture: ComponentFixture<TranslationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

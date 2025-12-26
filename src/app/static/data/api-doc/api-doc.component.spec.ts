import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiDocComponent } from './api-doc.component';
import { GlobalMaterialModules } from '../../../shared/modules/global.module';

describe('ApiDocComponent', () => {
  let component: ApiDocComponent;
  let fixture: ComponentFixture<ApiDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ApiDocComponent, GlobalMaterialModules]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApiDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

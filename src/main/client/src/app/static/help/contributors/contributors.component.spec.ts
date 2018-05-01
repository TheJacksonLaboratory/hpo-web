import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorsComponent } from './contributors.component';
import { GlobalMaterialModules } from "../../../shared/modules/global.module";
import { ContributorsService } from "../../../shared/contributors/contributors.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe('ContributorsComponent', () => {
  let component: ContributorsComponent;
  let fixture: ComponentFixture<ContributorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [ContributorsService],
      declarations: [ ContributorsComponent ],
      imports:[GlobalMaterialModules, HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContributorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

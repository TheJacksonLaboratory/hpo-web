import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TeamComponent} from './team.component';
import {GlobalMaterialModules} from "../../../shared/modules/global.module";
import {TeamService} from "../../../shared/team/team.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('ContributorsComponent', () => {
  let component: TeamComponent;
  let fixture: ComponentFixture<TeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [TeamService],
      declarations: [TeamComponent],
      imports: [GlobalMaterialModules, HttpClientTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

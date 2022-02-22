import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProfileSearchComponent} from './profile-search.component';
import {SearchService} from "../../../shared/search/service/search.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {TermService} from "../../services/term/term.service";
import {GlobalMaterialModules} from "../../../shared/modules/global.module";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";

describe('ProfileSearchComponent', () => {
  let component: ProfileSearchComponent;
  let fixture: ComponentFixture<ProfileSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileSearchComponent],
      providers: [SearchService, TermService],
      imports: [HttpClientTestingModule, GlobalMaterialModules, NoopAnimationsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

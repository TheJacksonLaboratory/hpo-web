import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntersectingComponent } from './intersecting.component';
import {SearchService} from "../../../shared/search/service/search.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {TermService} from "../../services/term/term.service";
import {GlobalMaterialModules} from "../../../shared/modules/global.module";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";

describe('IntersectingComponent', () => {
  let component: IntersectingComponent;
  let fixture: ComponentFixture<IntersectingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntersectingComponent ],
      providers: [ SearchService, TermService ],
      imports: [ HttpClientTestingModule, GlobalMaterialModules, NoopAnimationsModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntersectingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

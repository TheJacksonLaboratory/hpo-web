import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { GlobalMaterialModules } from "../modules/global.module";
import { SearchService } from "../search/service/search.service";
import { FormsModule } from "@angular/forms";
import { RouterTestingModule} from "@angular/router/testing";
import { ExtrasModule } from "../modules/extras.module";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        GlobalMaterialModules,
        FormsModule,
        RouterTestingModule,
        ExtrasModule,
        HttpClientTestingModule

      ],
      declarations: [ NavbarComponent ],
      providers:[ SearchService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

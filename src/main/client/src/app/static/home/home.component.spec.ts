import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule} from '@angular/material';
import { HomeComponent } from './home.component';
import { MatIconModule} from "@angular/material/icon";
import { MatListModule} from "@angular/material/list";
import { SearchModule} from "../../shared/search/search.module";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      imports: [MatCardModule,
        MatIconModule,
        MatListModule,
        NoopAnimationsModule,
        SearchModule,
        HttpClientTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

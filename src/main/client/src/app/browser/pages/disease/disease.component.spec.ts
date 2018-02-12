/*import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DiseaseComponent } from './disease.component';
import { MatCardModule} from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { DiseaseService} from '../../services/disease/disease.service';
import { MatTableModule } from '@angular/material';
import { MatSortModule} from "@angular/material";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';

describe('DiseaseComponent', () => {
  let component: DiseaseComponent;
  let fixture: ComponentFixture<DiseaseComponent>;
  let diseaseServiceStub = {
    searchDisease: jasmine.createSpy('searchDisease').and.returnValue(Observable.of("something")),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatCardModule, MatTableModule,MatSortModule],
      declarations: [ DiseaseComponent ],
      providers: [{provide: DiseaseService,  useValue: diseaseServiceStub }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiseaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});*/

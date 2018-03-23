import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import { SearchbarComponent } from './searchbar.component';
import { GlobalMaterialModules} from "../../../modules/global.module";
import { ExtrasModule } from "../../../modules/extras.module";
import { FormsModule} from "@angular/forms";
import { SearchOutputComponent } from "../search.component";
import { RouterModule } from "@angular/router";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

describe('SearchbarComponent', () => {
  let component: SearchbarComponent;
  let fixture: ComponentFixture<SearchbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchbarComponent, SearchOutputComponent],
      imports: [GlobalMaterialModules , FormsModule, RouterModule, NoopAnimationsModule, ExtrasModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it( 'should emit an event when input with query', ()=>{
    let element = fixture.nativeElement.querySelector("input");
    spyOn(component.queryEmit, 'emit');
    element.value = 'bladder';
    element.dispatchEvent(new Event("input"));
    element.dispatchEvent(new Event("keyup"));
    expect(component.queryEmit.emit).toHaveBeenCalledWith("bladder");
  });
});

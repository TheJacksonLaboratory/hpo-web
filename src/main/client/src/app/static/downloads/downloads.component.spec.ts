import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DownloadsComponent } from './downloads.component';
import { MatMenuModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatIconModule } from '@angular/material';
import { MatToolbarModule } from '@angular/material';
import { MatTabsModule } from "@angular/material/tabs";
import { RouterTestingModule } from '@angular/router/testing';

describe('DownloadsComponent', () => {
  let component: DownloadsComponent;
  let fixture: ComponentFixture<DownloadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadsComponent ],
      imports: [RouterTestingModule,
        NoopAnimationsModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        MatToolbarModule,
        MatTabsModule
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

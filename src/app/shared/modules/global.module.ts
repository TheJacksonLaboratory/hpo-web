import {NgModule} from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatListModule} from '@angular/material/list';
import {MatSortModule} from '@angular/material/sort';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDividerModule} from '@angular/material/divider';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDialogModule} from '@angular/material/dialog';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatStepperModule} from "@angular/material/stepper";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatChipsModule} from "@angular/material/chips";
import {FlexLayoutModule} from "@angular/flex-layout";


@NgModule({
  imports: [MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatInputModule,
    MatCardModule,
    MatProgressBarModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    MatListModule,
    MatExpansionModule,
    MatSelectModule,
    MatDividerModule,
    MatSidenavModule,
    MatDialogModule,
    MatStepperModule,
    MatAutocompleteModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatBadgeModule,
    FlexLayoutModule
  ],
  exports: [MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatProgressBarModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    MatListModule,
    MatExpansionModule,
    MatSelectModule,
    MatDividerModule,
    MatSidenavModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatStepperModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatBadgeModule,
    FlexLayoutModule
  ],
})
export class GlobalMaterialModules {
}

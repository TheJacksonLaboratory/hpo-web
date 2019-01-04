import { NgModule } from '@angular/core';

// Material Modules
import {MatDialogModule, MatMenuModule} from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatIconModule } from '@angular/material';
import { MatToolbarModule} from '@angular/material';
import { MatInputModule } from '@angular/material';
import { MatCardModule } from '@angular/material';
import { MatProgressBarModule } from '@angular/material';
import { MatTabsModule } from '@angular/material';
import { MatTableModule } from '@angular/material';
import { MatPaginatorModule } from '@angular/material';
import { MatSortModule } from '@angular/material';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material';
import { MatListModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';

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
    MatDialogModule
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
    MatDialogModule
  ],
})
export class GlobalMaterialModules { }

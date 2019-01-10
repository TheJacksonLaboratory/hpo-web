import { NgModule } from '@angular/core';

// Material Modules
import { MatDialogModule, MatMenuModule, MatButtonModule, MatIconModule,
  MatToolbarModule, MatInputModule, MatCardModule, MatProgressBarModule,
  MatTabsModule, MatTableModule, MatPaginatorModule, MatSortModule, MatTooltipModule,
  MatExpansionModule, MatListModule, MatSelectModule, MatDividerModule, MatSidenavModule } from '@angular/material';

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

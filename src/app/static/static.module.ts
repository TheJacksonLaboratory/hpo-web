// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaticRoutingModule } from './static-routing.module';
// Angular Bootstrap Modules
import { MdTabsModule } from '@angular/material';
import { MdExpansionModule } from '@angular/material';
import { MdTableModule } from '@angular/material';
// Components
import { HomeComponent } from './home/home.component';
import { ResourcesComponent } from './resources/resources.component';
import { DownloadsComponent } from './downloads/downloads.component';
import { DocumentationComponent } from './documentation/documentation.component';

@NgModule({
  imports: [
    CommonModule,
    StaticRoutingModule,
    MdTabsModule,
    MdExpansionModule,
    MdTableModule
  ],
  declarations: [ HomeComponent, ResourcesComponent, DownloadsComponent, DocumentationComponent ]
})
export class StaticModule { }

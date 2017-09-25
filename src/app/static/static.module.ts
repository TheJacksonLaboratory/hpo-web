// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaticRoutingModule } from './static-routing.module';
// Angular Bootstrap Modules
import { TabsModule } from 'ngx-bootstrap/tabs';

// Components
import { HomeComponent } from './home/home.component';
import { ResourcesComponent } from './resources/resources.component';

@NgModule({
  imports: [
    CommonModule,
    StaticRoutingModule,
    TabsModule.forRoot(),
  ],
  declarations: [ HomeComponent, ResourcesComponent ]
})
export class StaticModule { }

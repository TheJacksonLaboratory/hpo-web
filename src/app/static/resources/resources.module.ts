import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalMaterialModules } from '../../shared/modules/global.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResourcesRoutingModule } from './resources-routing.module';
import { FaqComponent } from './faq/faq.component';
import { PublicationsService } from './publications/publications.service';
import { PublicationsComponent } from './publications/publications.component';


@NgModule({
  imports: [
    CommonModule,
    ResourcesRoutingModule,
    GlobalMaterialModules,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    FaqComponent, PublicationsComponent
  ],
  providers: [PublicationsService]
})
export class ResourcesModule {
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GlobalMaterialModules } from '../modules/global.module';
import { HighlightPipe } from '../pipes/highlight.pipe';
import { SearchService } from './service/search.service';
import { SearchComponent } from './search/search.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    GlobalMaterialModules,
    RouterModule,
    HighlightPipe,
    SearchComponent
  ],
  declarations: [],
  providers: [SearchService],
  exports: [SearchComponent]
})
export class SearchModule {
}

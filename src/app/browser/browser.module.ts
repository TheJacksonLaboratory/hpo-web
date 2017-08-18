import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainSearch } from './main-search/main-search.component';
import { SearchbarComponent } from './main-search/searchbar/searchbar.component'
import { FormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [MainSearch,SearchbarComponent]
})
export class BrowserHPOModule { }

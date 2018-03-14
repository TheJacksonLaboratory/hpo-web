// Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RoutingModule } from './app-routing.module';
import { HttpClientModule} from '@angular/common/http';
// Service
import { SearchService } from "./shared/search/service/search.service";
// Global Material Modules
import { ExtrasModule } from "./shared/modules/extras.module";

//Custom Shared Components
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NoPageFoundComponent } from './error/no-page-found.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    NoPageFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RoutingModule,
    HttpClientModule,
    ExtrasModule
  ],
  providers: [SearchService],
  bootstrap: [AppComponent]
})
export class AppModule { }

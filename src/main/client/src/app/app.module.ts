// Modules
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RoutingModule } from './app-routing.module';
import { HttpClientModule} from '@angular/common/http';

// Global Material Modules
import {GlobalMaterialModules} from "./shared/global.module";

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
    GlobalMaterialModules
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoutingModule } from './app-routing.module';

//Custom Modules
import { BrowserHPOModule } from './browser/browser.module'

//Custom Shared Components
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RoutingModule,
    BrowserHPOModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

// Modules
import { NgModule } from '@angular/core';
import { MAT_TABS_CONFIG } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RoutingModule } from './app-routing.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
// Service
import { SearchService } from './shared/search/service/search.service';
// Global Material Modules
import { GlobalMaterialModules } from './shared/modules/global.module';

// Custom Shared Components
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NoPageFoundComponent } from './error/no-page-found.component';
import { SearchModule } from './shared/search/search.module';
import { NewsService } from './shared/news/news.service';
import { SafeHtmlPipe } from './shared/pipes/sanitize.pipe';
import { FloatingFeedbackComponent } from './shared/floating-feedback/floating-feedback.component';

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        FooterComponent,
        NoPageFoundComponent,
        FloatingFeedbackComponent
    ],
    bootstrap: [AppComponent],
    imports: [BrowserModule,
        BrowserAnimationsModule,
        GlobalMaterialModules,
        SafeHtmlPipe,
        RoutingModule,
        SearchModule],
    providers: [SearchService, NewsService,
        { provide: MAT_TABS_CONFIG, useValue: { animationDuration: '0ms' } },
        provideHttpClient(withInterceptorsFromDi())]
})
export class AppModule {
}

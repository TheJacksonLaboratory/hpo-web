import { Component } from '@angular/core';
import { NewsService } from './shared/news/news.service';
import { environment } from '../environments/environment';

declare let ga: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  ga = null;
  gaTrackId = '';
  mobileNavSection = 'home';
  parentSections = [];
  constructor() {

    // Avoid google analytics for dev and testing unless explicitly indicated
    if (environment.production && window.location.host === 'hpo.jax.org') {
      this.gaTrackId = environment.HPO_GOOGLE_ANALYTICS_TRACKING_ID;

    } else if (!environment.production && environment.HPO_ENABLE_GA_TEST) {
      this.gaTrackId = environment.HPO_GOOGLE_ANALYTICS_TEST_TRACKING_ID;
    }

    // console.log("loaded trackId :" + this.gaTrackId);

    if (this.gaTrackId.length > 0) {
      ga('create', this.gaTrackId, 'auto');

      // Only require the plugins you've imported above.
      ga('require', 'eventTracker');
      ga('require', 'outboundLinkTracker');
      ga('require', 'urlChangeTracker');
      ga('require', 'cleanUrlTracker');

      ga('send', 'pageview');
    }
  }

  backNavigate() {
    this.mobileNavSection = this.parentSections.pop();
  }

  mobileNavigate(dest: string) {
      this.parentSections.push(this.mobileNavSection);
      this.mobileNavSection = dest;
  }

}

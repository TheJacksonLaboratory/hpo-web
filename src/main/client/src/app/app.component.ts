import { Component } from '@angular/core';
import {NewsService} from "./shared/news/news.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private newsService: NewsService){
    newsService.setAllNews();
  }
}

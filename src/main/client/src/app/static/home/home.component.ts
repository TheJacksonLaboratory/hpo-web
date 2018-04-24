import {Component, OnInit} from '@angular/core';
import { NewsService} from "../../shared/news/news.service";
import { News } from "../../browse/models/models";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  clearSearch: boolean = false;
  searchString: string;
  teaserNews: News[];
  constructor(private newsService: NewsService) { }

  ngOnInit() {
   this.teaserNews = this.newsService.getTeaserNews();
  }
  setOverlay(event: Event){
    if(this.searchString && this.checkSourceClass(event.srcElement.className)){
      this.clearSearch = true;
    }else{
      this.clearSearch = false;
    }
  }

  checkSourceClass(cls: string): boolean {
    if(cls.includes("container") || cls.includes("row") || cls.includes("home-search")){
      return true;
    }
  }
}

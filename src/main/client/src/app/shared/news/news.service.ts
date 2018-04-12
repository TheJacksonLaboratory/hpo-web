import { Injectable } from '@angular/core';
import { News } from "../../browse/models/models";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';

@Injectable()
export class NewsService {
  private allNews: any;
  constructor() {
    this.setAllNews();
  }

  getNewsByDate(date: string): Observable<News[]> {
    if(this.allNews && this.allNews[date]){
      return Observable.of(this.allNews[date])
    }else{
      return null;
    }
  }

  getUniqueDates(): Observable<Array<string>>{
    if(this.allNews){
      return Observable.of(this._getDates())
    }else{
      return null;
    }
  }
  /* Return all dates */
  private _getDates(): Array<string> {
    return Object.keys(this.allNews)
  }

  /*getMostRecent(): Observable<Array<string>>{
    if(this.allNews){

    }

  }*/

  setAllNews(): void {
    let fakeObj = {
      "April 2018": [
        {
          title: "Paper on novel annotation model",
          date: "April 9, 2018",
          body: "For the interested reader - there is a new paper suggesting an extended annotation model, " +
          "which can help HPO-based similarity calculations. <br><br> It is available via <a href=\"https://academic.oup.com/database/article/doi/10.1093/database/bay026/4953405\" target=\"__blank\" >Database (Oxford)</a>"


        },
        {
          title: "Nature Genetics Paper on layperson vocabulary",
          date: "April 9, 2018",
          body: "In clinical settings, phenotypic abnormalities are often defined using specialized medical " +
          "terminology, which can be difficult for patients to understand. This so-called terminology-gap can impede" +
          " participation of patients and families in research projects concerned with the phenotype or natural history " +
          "of diseases, and can even make it difficult for patients to understand data from their own medical charts.<br><br>" +
          "The HPO Project and the Monarch Initiative have therefore “translated” the terms of the HPO into “plain language”. " +
          "For instance, the term for <i>Macrocephaly</i> can be translated as <i>Large skull</i>. <br><br> " +
          "This joint project with the Monarch-Initiative, HPO, PCORI, Sanford Medical, and a lot of other contributors on adding layperson synonyms to HPO has now been published in <a href=\"https://www.nature.com/articles/s41588-018-0096-x\">Nature Genetics</a>."

        }
      ],
      "March 2018": [
        {
          title: "March 2018 release",
          date: "March 9, 2018",
          body: "We published the March 2018 release of HPO and annotation data. Thanks to all contributors. " +
          "Please continue to give us feedback and suggestions. <br><br> Thanks, <br><br> The HPO Team"
        }
      ],
      "Feburary 2018": [
        {
          title: "HPO mailing list for news announcements",
          date: "February 14, 2018",
          body: "The HPO team has set up a mailing list, as we feel we can’t reach everybody with posts to our website " +
          "and/or twitter. Please join the mailing list at " +
          "<a href=\"https://groups.io/g/human-phenotype-ontology\">https://groups.io/g/human-phenotype-ontology</a> to get the latest news and discussions via mail. <br><br> Thanks, <br><br> The HPO Team"
        }
      ]
    };

    this.allNews = fakeObj
  }
}

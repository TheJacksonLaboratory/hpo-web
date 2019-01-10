import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  openPanel: number;
  panelHash =  {
    1: 'hpo-relation',
    2: 'content-change',
    3: 'collaboration',
    4: 'ontology',
    5: 'annotation-use',
    6: 'genes-phenotypes',
    7: 'frequencies',
    8: 'association-rules'
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.navigateToQuestion(+params['id']);
    });
  }

  /***
   * Opens the designated question denoted
   * by /:id & then scrolls to it.
   * @param {number} q
   */
  navigateToQuestion(q: number) {
    if (Object.keys(this.panelHash).includes(q.toString())) {
      this.openPanel = q;
      const element = document.getElementById(this.panelHash[q]);
      element.scrollIntoView();
    }
  }
}

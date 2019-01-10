import { DomSanitizer } from '@angular/platform-browser'
import { TestBed, inject } from '@angular/core/testing';

import { HighlightPipe } from './highlight.pipe';

describe('Highlight pipe test', () => {
  let pipe: HighlightPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ {
        provide: DomSanitizer,
        useValue: {
          bypassSecurityTrustHtml: v => v
        }
      }, HighlightPipe
      ]
    });
  });

  beforeEach(inject([HighlightPipe], p => {
    pipe = p;
  }));

  const testData = [
    {
      targetString: {name: 'small skull'},
      query: 'small skull',
      expected: '<span><strong>small</strong> <strong>skull</strong></span>'
    },
    {
      targetString: {name: 'small skull anantomy'},
      query: 'small skull',
      expected: '<span><strong>small</strong> <strong>skull</strong> anantomy</span>'
    },
    {
      targetString: {name: 'small anantomy skull'},
      query: 'small skull',
      expected: '<span><strong>small</strong> anantomy <strong>skull</strong></span>'
    },
    {
      targetString: {name: 'small anantomy skull'},
      query: 'small skull s',
      expected: '<span><strong>small</strong> anantomy <strong>skull</strong></span>'
    }

  ];

  it('highlights terms in the text', () => {
    for(let idx in testData){
      let result = pipe.transform(testData[idx]["targetString"], testData[idx]["query"]);
      expect(testData[idx].expected).toEqual(result);
    }
  });
});

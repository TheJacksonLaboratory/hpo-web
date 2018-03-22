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

  it('highlights search term in the text', () => {
    let result = pipe.transform({name:'search text'}, 'text');
    expect(result).toBe('search <span class="search-highlight">text</span>')
  });

  it('should return same text', () => {
    let result = pipe.transform({name:'search text'}, '');
    expect(result).toBe('search text', 'search text')
  });
});

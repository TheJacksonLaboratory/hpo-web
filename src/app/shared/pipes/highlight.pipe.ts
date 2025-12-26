import { Pipe, PipeTransform } from '@angular/core';


/*
  Highlight pipe custom to HPO. Find regex matches and @ and # to beginning and end
  Then. When researching for the next term. Avoid matches with @ and #.

  At the end we want to bold the terms that are contained with @ and #
    replace @ with <strong> & # with </strong>
 */
@Pipe({ name: 'highlight', standalone: true })
export class HighlightPipe implements PipeTransform {
  transform(targetString: any, query: string): string {
    let response = targetString['name'];
    if (response && query) {
      const subHighlight = query.trim().split(' ');
      for (const x in subHighlight) {
        if (subHighlight[x].length > 1) {
          let replace = '';
          // (?<!@)" + subHighlight[x] + "(?!\#)" WORKS IN CHROME 62+ but not natively in other browsers
          // lookahead -> lookbehind not suitable for production yet.
          // Limited implementation to favor ending strings
          const regex = new RegExp(subHighlight[x] + '(?!\#)', 'gi');
          const match = response.match(regex);
          if (match && match.length > 1) {
            replace = '@' + match[0] + '#';
          } else {
            replace = '@' + match + '#';
          }
          response = response.replace(regex, replace);
        }
      }
      response = response.replace(/@/g, '<strong>');
      response = response.replace(/#/g, '</strong>');
      return '<span>' + response + '</span>';
    }
  }
}

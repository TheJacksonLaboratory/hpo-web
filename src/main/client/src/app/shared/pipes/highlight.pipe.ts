import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'highlight' })
export class HighlightPipe implements PipeTransform {
  transform(targetString: any, query: string): string {
    let response = targetString["name"];
    if (targetString && query) {
      let subHighlight = query.trim().split(" ");
      for(let x in subHighlight){
          let replace = "";
          const regex = new RegExp("(?<!<[^>]*)" + subHighlight[x], 'gi');
          let match = response.match(regex);
          if (match) {
            replace = '<strong>' + match + '</strong>';
            response = response.replace(regex, replace);
          }
      }
      return response;
    }
  }
}

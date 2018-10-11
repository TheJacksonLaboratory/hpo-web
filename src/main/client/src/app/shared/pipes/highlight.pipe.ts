import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'highlight' })
export class HighlightPipe implements PipeTransform {
  transform(targetString: any, query: string): string {
    let response = targetString["name"];
    if (targetString && query) {
      let subHighlight = query.trim().split(" ");
      for(let x in subHighlight){
        if(subHighlight[x].length > 1){
          let replace = "";
          const regex = new RegExp("(?<!<[^>]*|@)" + subHighlight[x] + "(?!#)", 'gi');
          let match = response.match(regex);
          if (match && match.length > 1) {
            replace = '@' + match[0] + '#';
          }else{
            replace = '@' + match + '#';
          }
          response = response.replace(regex, replace);
        }
      }
      response = response.replace(/@/g, "<strong>");
      response = response.replace(/#/g, "</strong>");
      return response;
    }
  }
}

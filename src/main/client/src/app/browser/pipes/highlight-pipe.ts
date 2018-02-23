import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'highlight' })
export class HighlightPipe implements PipeTransform {
  transform(result: any, query: string): string {
    let outHtml: string = "";
    if (result && query) {
      const regex = new RegExp(query, 'gi');
      return  result.name.replace(regex, (match) => `<span class="search-highlight">${match}</span>`);
    }
  }
}

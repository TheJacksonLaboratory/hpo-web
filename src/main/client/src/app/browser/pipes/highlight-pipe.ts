import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'highlight' })
export class HighlightPipe implements PipeTransform {
  transform(result: any, query: string): string {
    let outHtml: string = "";
    if (result && query) {
      const regex = new RegExp(query, 'gi');
      result.name = result.name.replace(regex, (match) => `<span class="search-highlight">${match}</span>`);
      outHtml = `<span class="result">
                 ${result.id} ${result.name}
                 </span>
                `;
      if(result.count && result.count != 0){
       outHtml = `<span class="result">
                 ${result.id} ${result.name}
                 </span>
                 <span matTooltip="# of Descendants" matTooltipPosition="left" class="badge search-badge">${result.count}</span>
                `;
      }

      return outHtml;
    }
  }
}

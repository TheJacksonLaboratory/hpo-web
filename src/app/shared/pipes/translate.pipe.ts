import { Pipe, PipeTransform } from '@angular/core';
import { Language, Translation } from '../../browser/models/models';

@Pipe({name: 'translate'})
export class TranslatePipe implements PipeTransform {

  constructor() {
  }

  transform(original: string, t: Translation[], language: string, target: string): string {
    if (!t){
      return original;
    }
    for (let i = 0; i < t.length; i++) {
      if (t[i].language == language) {
        const translated =  t[i][target];
        return translated === "" ? original : translated;
      }
    }
    return original;
  }
}

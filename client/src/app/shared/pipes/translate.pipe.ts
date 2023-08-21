import { Pipe, PipeTransform } from '@angular/core';
import { Language, Translation } from '../../browser/models/models';

@Pipe({name: 'translate'})
export class TranslatePipe implements PipeTransform {

  constructor() {
  }

  transform(original: string, t: Translation[], language: string): string {
    if (language === "en") {
      return original;
    }
    for (var i = 0; i < t.length; i++) {
      if (t[i].language == language) {
        return t[i].name;
      }
    }
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Language } from '../../models/models';

@Injectable()
export class LanguageService {
  default = {language: "en", language_long: "English"};
  languageSubject = new BehaviorSubject<Language>(this.default);
  active$ = this.languageSubject.asObservable();
  constructor() {
  }

  change(language: Language): void {
    this.languageSubject.next(language);
  }
}

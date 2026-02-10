import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Language } from '../../models/models';
@Injectable({ providedIn: 'root' })
export class LanguageService {
  default: Language = { language: "en", language_long: "English" };
  languageSubject = new BehaviorSubject<Language>(this.default);
  active$ = this.languageSubject.asObservable();
  languageLookup = {
    "en": "English",
    "nl": "Dutch",
    "fr": "French",
    'tr': "Turkish",
    "nna": "Nyangumarta",
    "cs": "Czech",
    "zh": "Chinese",
    "tw": "Twi",
    "dtp": "Kadazan Dusun",
    "ja": "Japanese",
    "es": "Spanish",
    "de": "German",
    "it": "Italian",
    "pt": "Portuguese"
  };
  constructor() {
  }

  change(language: Language): void {
    this.languageSubject.next(language);
  }

}

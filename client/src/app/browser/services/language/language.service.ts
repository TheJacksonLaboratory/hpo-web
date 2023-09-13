import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Language } from '../../models/models';
@Injectable({providedIn: 'root'})
export class LanguageService {
  default: Language = {language: "en", language_long: "English"};
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
    "es": "Spanish"
  };
  constructor(private httpClient: HttpClient) {
    // this.httpClient.get('assets/languages.txt', {responseType: 'text'})
    //   .pipe(
    //     map(data => this.processLanguages(data))
    //   ).subscribe((languages) => {
    //     this.languageLookup = languages;
    // });
  }

  change(language: Language): void {
    this.languageSubject.next(language);
  }

  // private processLanguages(data: string){
  //   let languages = {};
  //   const section =  data.split("%");
  //   section.map((lang) => {
  //     let sub = "";
  //     if(lang.includes("Type: language")){
  //       const lines = lang.split("\n");
  //       for(let i = 0; i < lines.length; i++){
  //         if (lines[i].includes("Subtag:")) {
  //           sub = lines[i].split("Subtag:")[1].trim();
  //         } else if (lines[i].includes("Description:")) {
  //           languages[sub] = lines[i].split("Description:")[1].trim();
  //           break;
  //         }
  //       }
  //     }
  //   });
  //   return languages;
  // }

  init(){
    return;
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Language, Term, Translation } from '../../models/models';
import * as isoLanguage from '@cospired/i18n-iso-languages';

@Injectable()
export class OntologyService {

  constructor(private httpClient: HttpClient) {
    isoLanguage.registerLocale(require('@cospired/i18n-iso-languages/langs/en.json'));
  }

  translations(id: string): Observable<Translation[]>  {
    return this.httpClient.get<Term>(environment.ONTOLOGY_API_HP_TERMS + id)
    .pipe(
      map((data) => {
      data.translations.map((language) => {
        language.language = language.language.toLocaleLowerCase()
        language.language_long = isoLanguage.getName(language.language, "en");
      });
      data.translations.sort((a: Language, b: Language) => a.language_long.localeCompare(b.language_long));
      return data.translations;
    }));
  }

  parents(id: string): Observable<Term[]> {
    return this.httpClient.get<Term[]>(environment.ONTOLOGY_API_HP_TERMS + id +'/parents').pipe(
      map((terms) => {
        return terms.map((t) => {
          t.translations.map((language) => {
            language.language = language.language.toLocaleLowerCase()
            language.language_long = isoLanguage.getName(language.language, "en");
          });
          t.translations.sort((a: Language, b: Language) => a.language_long.localeCompare(b.language_long));
          return t;
        });
      }));
  }

  children(id: string): Observable<Term[]> {
    return this.httpClient.get<Term[]>(environment.ONTOLOGY_API_HP_TERMS + id +'/children').pipe(
      map((terms) => {
        return terms.map((t) => {
          t.translations.map((language) => {
            language.language = language.language.toLocaleLowerCase()
            language.language_long = isoLanguage.getName(language.language, "en");
          });
          t.translations.sort((a: Language, b: Language) => a.language_long.localeCompare(b.language_long));
          return t;
        });
      }));
  }
}

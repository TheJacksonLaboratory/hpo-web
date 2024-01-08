import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Language, Term } from '../../models/models';
import { LanguageService } from '../language/language.service';

@Injectable({providedIn: 'root'})
export class OntologyService {

  constructor(private httpClient: HttpClient, private languageService: LanguageService) {}

  search(query: string, limit: number): Observable<Term>{
    return this.httpClient.get<Term>(`${environment.ONTOLOGY_API_HP_SEARCH}?q=${query}&limit=${limit}`);
  }

  term(id: string): Observable<Term>  {
    return this.httpClient.get<Term>(environment.ONTOLOGY_API_HP_TERMS + id)
    .pipe(
      map((data) => {
      data.translations?.map((language) => {
        language.language = language.language.toLocaleLowerCase()
        language.language_long = this.languageService.languageLookup[language.language];
      });
      data.translations?.sort((a: Language, b: Language) => a.language_long.localeCompare(b.language_long));
      return data;
    }));
  }

  parents(id: string): Observable<Term[]> {
    return this.httpClient.get<Term[]>(environment.ONTOLOGY_API_HP_TERMS + id +'/parents').pipe(
      map((terms) => {
        return terms.map((t) => {
          t.translations?.map((language) => {
            language.language = language.language.toLocaleLowerCase()
            language.language_long = this.languageService.languageLookup[language.language];
          });
          t.translations?.sort((a: Language, b: Language) => a.language_long.localeCompare(b.language_long));
          return t;
        });
      }));
  }

  children(id: string): Observable<Term[]> {
    return this.httpClient.get<Term[]>(environment.ONTOLOGY_API_HP_TERMS + id +'/children').pipe(
      map((terms) => {
        return terms.map((t) => {
          t.translations?.map((language) => {
            language.language = language.language.toLocaleLowerCase()
            language.language_long = this.languageService.languageLookup[language.language];
          });
          t.translations?.sort((a: Language, b: Language) => a.language_long.localeCompare(b.language_long));
          return t;
        });
      }));
  }
}

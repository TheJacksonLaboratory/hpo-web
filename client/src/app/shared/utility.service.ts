import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }

  openExternalUrl(url: string) {
    window.open(url, '_blank').focus();
  }
}

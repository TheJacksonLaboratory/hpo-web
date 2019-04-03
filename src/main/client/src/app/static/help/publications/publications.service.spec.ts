import { TestBed } from '@angular/core/testing';

import { PublicationsService } from './publications.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MatTableModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

describe('PublicationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientTestingModule],
    providers: [PublicationsService]}));

  it('should be created', () => {
    const service: PublicationsService = TestBed.get(PublicationsService);
    expect(service).toBeTruthy();
  });
});

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Term } from '../../models/models';

@Injectable()
export class DownloadService {

    constructor(private httpClient: HttpClient) {}

    download(id: string, association: string): Observable<Term> {
        return this.httpClient.get<Term>(environment.ONTOLOGY_NETWORK_ANNOTATION_API + id);
    }
}

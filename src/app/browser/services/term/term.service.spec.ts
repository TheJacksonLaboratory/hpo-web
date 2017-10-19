import {Injectable, ReflectiveInjector} from '@angular/core';
import {async, fakeAsync, tick} from '@angular/core/testing';
import {BaseRequestOptions, ConnectionBackend, Http, RequestOptions} from '@angular/http';
import {Response, ResponseOptions} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';
import { TermService } from './term.service';


describe('Mock-TermService', () => {
    beforeEach(() => {
        this.injector = ReflectiveInjector.resolveAndCreate([
            {provide: ConnectionBackend, useClass: MockBackend},
            {provide: RequestOptions, useClass: BaseRequestOptions},
            Http,
            TermService
        ]);
        this.termService = this.injector.get(TermService);
        this.backend = this.injector.get(ConnectionBackend) as MockBackend;
        this.backend.connections.subscribe((connection: any) => this.lastConnection = connection);
    });

    it('searchTerms() should return some terms', fakeAsync(() => {
        let result: String[];
        this.termService.searchTerm().then((terms: String[]) => result = terms);
        this.lastConnection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify({})
        })))
    }))
})

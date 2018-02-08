import {TermService} from './term.service';
import {TestBed, inject} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {environment} from "../../../../environments/environment";

describe('TermServiceSpec', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TermService]})
  });
  let query = "HPO:00005";

  it('should handle searchTerm service method ', inject([
    HttpTestingController, TermService
  ], (httpMock, termService: TermService) => {
    // call our service, and once the results come in
    // expect them to have the proper data (filled in
    // using the mock below)
    termService.searchTerm(query).subscribe(termResponse => {
        expect(termResponse).toBeDefined();
        expect(termResponse.relations.termCount).toBe(2);
        expect(termResponse.details.id).toEqual("HP:0009725");
      });

    // look up our request and access it
    const request = httpMock.expectOne(environment.HPO_API_TERM_SEARCH_URL + '/' + query);
    // verify it is a GET
    expect(request.request.method).toEqual('GET');
    // Now, provide the answer to the caller above,
    // flushing the data down the pipe to the caller and
    // triggering the test's subscribe method
    request.flush(
      {
        "details":{
          "name":"Bladder neoplasm","id":"HP:0009725","altTermIds":[],
          "definition":"The presence of a neoplasm of the urinary bladder.","comment":null,
          "synonyms":["Bladder cancer","Bladder tumor"],"isObsolete":false,
          "xrefs":["MSH:D001749","SNOMEDCT_US:126885006","UMLS:C0005695"]
        },
        "relations":{
          "termCount":2,
          "parents":[{"name":"Urinary tract neoplasm","id":7417,"childrenCount":24,"ontologyId":"HP:0010786"}],
          "children":[{"name":"Bladder carcinoma","id":2323,"childrenCount":1,"ontologyId":"HP:0002862"}]
        }
      }
    );

    // make sure it actually got processed...
    httpMock.verify();
  }));

  it('should handle searchGenesByTerm service method', inject([
    HttpTestingController, TermService
  ], (httpMock, termService: TermService) => {
    // call our service, and once the results come in
    // expect them to have the proper data (filled in
    // using the mock below)
    termService.searchGenesByTerm(query).subscribe(termGenes => {
      expect(termGenes).toBeDefined();
      expect(termGenes.genes.length).toBe(2);
      expect(termGenes.genes[0].entrezGeneId).toEqual(79719);
      expect(termGenes.genes[1].entrezGeneId).toEqual(207);
    });

    // look up our request and access it
    const request = httpMock.expectOne(environment.HPO_API_TERM_SEARCH_URL + query + '/genes');
    // verify it is a GET
    expect(request.request.method).toEqual('GET');
    // Now, provide the answer to the caller above,
    // flushing the data down the pipe to the caller and
    // triggering the test's subscribe method
    request.flush({
      "genes": [{
        "entrezGeneId": 79719, "entrezGeneSymbol": "AAGAB",
        "dbDiseases": [
          {
            "id": 899, "diseaseId": "OMIM:148600",
            "diseaseName": "KERATOSIS PALMOPLANTARIS PAPULOSA", "dbId": "148600", "db": "OMIM"
          },
          {
            "id": 9684, "diseaseId": "ORPHA:79501",
            "diseaseName": "Punctate palmoplantar keratoderma type 1", "dbId": "79501", "db": "ORPHA"
          }]
        },
        {
          "entrezGeneId": 207, "entrezGeneSymbol": "AKT1",
          "dbDiseases": [
            {"id": 1217, "diseaseId": "OMIM:167000",
            "diseaseName": "#167000 OVARIAN CANCEROVARIAN CANCER, EPITHELIAL, INCLUDED", "dbId": "167000", "db": "OMIM"},
            {"id": 8053, "diseaseId": "ORPHA:201", "diseaseName": "Cowden syndrome", "dbId": "201", "db": "ORPHA"},
            {"id": 284, "diseaseId": "OMIM:114500", "diseaseName": "COLORECTAL CANCER", "dbId": "114500", "db": "OMIM"}]
          }]
         });
          // make sure it actually got processed...
          httpMock.verify()
  }));

  it('should handle searchDiseasesByTerm service method', inject([
    HttpTestingController, TermService
  ], (httpMock, termService: TermService) => {
    // call our service, and once the results come in
    // expect them to have the proper data (filled in
    // using the mock below)
    termService.searchDiseasesByTerm(query).subscribe(termDiseases => {
      expect(termDiseases).toBeDefined();
      expect(termDiseases.diseases.length).toBe(2);
      expect(termDiseases.diseases[0].diseaseId).toEqual("OMIM:218040");
      expect(termDiseases.diseases[1].diseaseId).toEqual("OMIM:304150");
    });

    // look up our request and access it
    const request = httpMock.expectOne(environment.HPO_API_TERM_SEARCH_URL + query + '/diseases');
    // verify it is a GET
    expect(request.request.method).toEqual('GET');
    // Now, provide the answer to the caller above,
    // flushing the data down the pipe to the caller and
    // triggering the test's subscribe method
    request.flush({
      "diseases":[
        {"diseaseId":"OMIM:218040",
          "dbGenes":[{"id":1732,"entrezGeneId":3265,"entrezGeneSymbol":"HRAS"}],
          "diseaseName":"#218040 COSTELLO SYNDROME","dbId":"218040","db":"OMIM"
        },
        {"diseaseId":"OMIM:304150","dbGenes":[{"id":269,"entrezGeneId":538,"entrezGeneSymbol":"ATP7A"}],
          "diseaseName":"#304150 OCCIPITAL HORN SYNDROME","dbId":"304150","db":"OMIM"
        }
      ]
    });
    // make sure it actually got processed...
    httpMock.verify()
  }));



});

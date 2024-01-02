// import {DiseaseService} from './disease.service';
// import {inject, TestBed} from '@angular/core/testing';
// import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
// import {environment} from '../../../../environments/environment';
//
// describe('DiseaseServiceSpec', () => {
//
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule],
//       providers: [DiseaseService]
//     });
//   });
//
//   const query = '7157';
//
//   it('should handle a searchGene service method ', inject([
//     HttpTestingController, DiseaseService
//   ], (httpMock, diseaseService: DiseaseService) => {
//     // call our service, and once the results come in
//     // expect them to have the proper data (filled in
//     // using the mock below)
//     diseaseService.searchDisease(query).subscribe(diseaseResponse => {
//       expect(diseaseResponse).toBeDefined();
//       expect(diseaseResponse.disease.diseaseId).toBe('OMIM:202300');
//       expect(diseaseResponse.termAssoc.length).toEqual(2);
//       expect(diseaseResponse.geneAssoc.length).toEqual(1);
//     });
//
//     // look up our request and access it
//     const request = httpMock.expectOne(environment.HPO_API_DISEASE_SEARCH_URL + query);
//     // verify it is a GET
//     expect(request.request.method).toEqual('GET');
//
//     request.flush(
//       {
//         'disease': {
//           'diseaseId': 'OMIM:202300',
//           'diseaseName': 'ADRENOCORTICAL CARCINOMA, HEREDITARY',
//           'dbId': '202300',
//           'db': 'OMIM'
//         },
//         'termAssoc': [
//           {'ontologyId': 'HP:0006744', 'name': 'Adrenocortical carcinoma'},
//           {'ontologyId': 'HP:0000007', 'name': 'Autosomal recessive inheritance'}
//         ],
//         'geneAssoc': [
//           {'entrezGeneId': 7157, 'entrezGeneSymbol': 'TP53'}
//         ]
//       });
//     httpMock.verify();
//   }));
// });

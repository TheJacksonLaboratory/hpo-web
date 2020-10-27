import {GeneService} from './gene.service';
import {TestBed, inject} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {environment} from '../../../../environments/environment';

describe('GeneServiceSpec', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GeneService]
    });
  });
  const query = '7157';

  it('should handle a searchGene service method ', inject([
    HttpTestingController, GeneService
  ], (httpMock, geneService: GeneService) => {
    // call our service, and once the results come in
    // expect them to have the proper data (filled in
    // using the mock below)
    geneService.searchGene(query).subscribe(geneResponse => {
      expect(geneResponse).toBeDefined();
      expect(geneResponse.gene.entrezGeneId).toBe(7157);
      expect(geneResponse.termAssoc.length).toEqual(3);
      expect(geneResponse.diseaseAssoc.length).toEqual(3);
    });

    // look up our request and access it
    const request = httpMock.expectOne(environment.HPO_API_GENE_SEARCH_URL + query);
    // verify it is a GET
    expect(request.request.method).toEqual('GET');

    request.flush(
{
      'gene':
        {
          'entrezGeneId': 7157, 'entrezGeneSymbol': 'TP53'
        },
      'termAssoc':
        [
          {'ontologyId': 'HP:0000505', 'name': 'Visual impairment'},
          {'ontologyId': 'HP:0002756', 'name': 'Pathologic fracture'},
          {'ontologyId': 'HP:0009919', 'name': 'Retinoblastoma'}
        ],
      'diseaseAssoc': [
        {'diseaseId': 'OMIM:151623', 'diseaseName': '#151623 LI-FRAUMENI SYNDROME 1', 'dbId': '151623', 'db': 'OMIM'},
        {'diseaseId': 'OMIM:202300', 'diseaseName': 'ADRENOCORTICAL CARCINOMA, HEREDITARY', 'dbId': '202300', 'db': 'OMIM'},
        {'diseaseId': 'ORPHA:2807', 'diseaseName': 'Papilloma of choroid plexus', 'dbId': '2807', 'db': 'ORPHA'}
      ]
      });
    httpMock.verify();
  }));

  it('should handle a searchGeneInfo service method ', inject([
    HttpTestingController, GeneService
  ], (httpMock, geneService: GeneService) => {
    // call our service, and once the results come in
    // expect them to have the proper data (filled in
    // using the mock below)
    geneService.searchGeneInfo(query).subscribe(geneResponse => {
      expect(geneResponse).toBeDefined();
      expect(geneResponse.result[query].description).toEqual('tumor protein p53');
      expect(geneResponse.result[query].name).toEqual('TP53');
      expect(geneResponse.result[query].chromosome).toEqual('17');
    });

    // look up our request and access it
    const request = httpMock.expectOne(environment.HPO_ENTREZ_SEARCH_URL + '?db=gene&id=' + query + '&retmode=json');
    // verify it is a GET
    expect(request.request.method).toEqual('GET');
    // Now, provide the answer to the caller above,
    // flushing the data down the pipe to the caller and
    // triggering the test's subscribe method
    request.flush(
      {
      'result': {
          '7157':
            {
              'uid': '7157',
              'name': 'TP53',
              'description': 'tumor protein p53',
              'status': '',
              'currentid': '',
              'chromosome': '17',
              'geneticsource': 'genomic',
              'maplocation': '17p13.1',
              'otheraliases': 'BCC7, LFS1, P53, TRP53',
              'nomenclaturesymbol': 'TP53',
              'nomenclaturename': 'tumor protein p53',
              'nomenclaturestatus': 'Official',
          }
      }
    });
    // make sure it actually got processed...
    httpMock.verify();
  }));
});

import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { EntityType, Language } from '../../models/models';
import { LanguageService } from '../../services/language/language.service';
import { SessionHistoryService } from '../../services/session-history/session-history.service';
import { EntityPageComponent } from './entity-page.component';
import { EntityDataResolverService } from './entity-data.resolvers';
import { GenePageViewModel } from './entity-page.types';

describe('EntityPageComponent', () => {
  const english = { language: 'en' } as Language;
  const geneViewModel: GenePageViewModel = {
    kind: EntityType.GENE,
    id: 'NCBIGene:5725',
    title: 'PTBP1',
    downloadCounts: { diseases: 0, terms: 0 },
    gene: { uid: '5725', name: 'PTBP1', maplocation: '19p13.3', summary: '', otheraliases: '', aliases: [] },
    phenotypeAssoc: [],
    diseaseAssoc: [],
    entrezError: false,
    networkError: false,
  };

  let record: jest.Mock;
  let navigate: jest.Mock;
  let resolve: jest.Mock;

  function create(): void {
    TestBed.configureTestingModule({
      imports: [EntityPageComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { data: { entityType: EntityType.GENE } }, paramMap: of(convertToParamMap({ id: 'NCBIGene:5725' })) } },
        { provide: Router, useValue: { navigate } },
        { provide: EntityDataResolverService, useValue: { resolve } },
        { provide: SessionHistoryService, useValue: { record } },
        {
          provide: LanguageService,
          useValue: { default: english, active$: of(english), languageSubject: { value: english } },
        },
      ],
    });
    TestBed.overrideComponent(EntityPageComponent, { set: { imports: [], template: '' } });
    TestBed.createComponent(EntityPageComponent).detectChanges();
  }

  beforeEach(() => {
    record = jest.fn();
    navigate = jest.fn();
    resolve = jest.fn();
  });

  it("reports the resolved view model's type, id and title to the session history service", () => {
    resolve.mockReturnValue(of(geneViewModel));
    create();

    expect(record).toHaveBeenCalledWith({ entityType: EntityType.GENE, id: 'NCBIGene:5725', label: 'PTBP1' });
  });

  it('does not report anything when the resolve errors', () => {
    resolve.mockReturnValue(throwError(() => new Error('not found')));
    create();

    expect(record).not.toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(['/error'], expect.anything());
  });
});

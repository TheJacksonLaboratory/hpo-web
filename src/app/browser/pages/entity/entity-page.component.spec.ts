import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { Subject, of, throwError } from 'rxjs';
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

  const captured = { fromEntity: true, isPopstate: false, isRewind: false };

  function create() {
    TestBed.configureTestingModule({
      imports: [EntityPageComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { data: { entityType: EntityType.GENE } }, paramMap: of(convertToParamMap({ id: 'NCBIGene:5725' })) } },
        { provide: Router, useValue: { navigate } },
        { provide: EntityDataResolverService, useValue: { resolve } },
        { provide: SessionHistoryService, useValue: { record, captureContext: () => captured } },
        {
          provide: LanguageService,
          useValue: { default: english, active$: of(english), languageSubject: { value: english } },
        },
      ],
    });
    TestBed.overrideComponent(EntityPageComponent, { set: { imports: [], template: '' } });
    const fixture = TestBed.createComponent(EntityPageComponent);
    fixture.detectChanges();
    return fixture;
  }

  beforeEach(() => {
    record = jest.fn();
    navigate = jest.fn();
    resolve = jest.fn();
  });

  it("reports the resolved view model's type, id and title to the session history service", () => {
    resolve.mockReturnValue(of(geneViewModel));
    create();

    expect(record).toHaveBeenCalledWith({ entityType: EntityType.GENE, id: 'NCBIGene:5725', label: 'PTBP1' }, captured);
  });

  it('reports with the context captured when the resolve started', () => {
    const resolved = new Subject<GenePageViewModel>();
    resolve.mockReturnValue(resolved);
    const captureContext = jest.fn().mockReturnValue(captured);
    TestBed.overrideProvider(SessionHistoryService, { useValue: { record, captureContext } });
    create();

    expect(captureContext).toHaveBeenCalledTimes(1);
    captureContext.mockReturnValue({ ...captured, isPopstate: true });
    resolved.next(geneViewModel);

    expect(record).toHaveBeenCalledWith(expect.anything(), captured);
  });

  it('does not report after the page is destroyed', () => {
    const resolved = new Subject<GenePageViewModel>();
    resolve.mockReturnValue(resolved);
    create().destroy();
    resolved.next(geneViewModel);

    expect(record).not.toHaveBeenCalled();
  });

  it('does not report anything when the resolve errors', () => {
    resolve.mockReturnValue(throwError(() => new Error('not found')));
    create();

    expect(record).not.toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(['/error'], expect.anything());
  });
});

import { Injectable } from '@angular/core';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { EntityType, EntrezGene, Language, Term, TermTree } from '../../models/models';
import { AnnotationService } from '../../services/annotation/annotation.service';
import { OntologyService } from '../../services/ontology/ontology.service';
import { LanguageService } from '../../services/language/language.service';
import { GeneService } from '../../services/gene/gene.service';
import { EntityPageViewModel, GenePageViewModel, PublicationReference, TermPageViewModel } from './entity-page.types';

const MAX_TREE_WIDTH = 40;

/**
 * Fetches and shapes the data behind each entity page.
 *
 * One fetch function per {@link EntityType}, looked up by
 * {@link EntityDataResolverService.resolve}. This is the seam the gene and
 * disease steps extend: register a resolver, add its view model to the
 * {@link EntityPageViewModel} union, and the shell needs no other change.
 */
@Injectable({ providedIn: 'root' })
export class EntityDataResolverService {
  /**
   * Fetch function per entity type. Partial by design - an unregistered type
   * is a real, reportable state while the migration is in progress, not a
   * gap to paper over.
   */
  private resolvers: Partial<Record<EntityType, (id: string) => Observable<EntityPageViewModel>>> = {
    [EntityType.PHENOTYPE]: (id) => this.fetchTerm(id),
    [EntityType.GENE]: (id) => this.fetchGene(id),
  };

  constructor(
    private ontologyService: OntologyService,
    private annotationService: AnnotationService,
    private languageService: LanguageService,
    private geneService: GeneService,
  ) {}

  /**
   * Builds the view model for one entity page.
   *
   * @param entityType Which entity page is being rendered, from the route's `data.entityType`.
   * @param id The entity id from the route - may be an obsolete term id, which resolves to its replacement.
   * @returns A single-value stream with the view model.
   * @throws Errors on the stream when no resolver is registered for `entityType`,
   * or when the entity does not exist. Both are routed to the error page by the shell.
   */
  resolve(entityType: EntityType, id: string): Observable<EntityPageViewModel> {
    const resolver = this.resolvers[entityType];
    if (!resolver) {
      return throwError(() => new Error(`No entity-page resolver registered for entity type ${entityType}.`));
    }
    return resolver(id);
  }

  /**
   * Resolves the term, its immediate hierarchy, and its annotations.
   *
   * A failing annotation call is caught and surfaced as `networkError` rather
   * than failing the route, because the term half of the page is still worth
   * showing. A missing term is not recoverable and does error.
   */
  private fetchTerm(id: string): Observable<TermPageViewModel> {
    return this.ontologyService.term(id).pipe(
      switchMap((term) => {
        if (!term) {
          return throwError(() => new Error(`Could not find requested ${id}.`));
        }

        const normalizedTerm = this.normalizeTerm(term);
        const languages = this.buildLanguages(normalizedTerm);

        return forkJoin({
          parents: this.ontologyService.parents(normalizedTerm.id).pipe(catchError(() => of([]))),
          children: this.ontologyService.children(normalizedTerm.id).pipe(catchError(() => of([]))),
        }).pipe(
          switchMap(({ parents, children }) => {
            const treeData = this.buildTreeData(normalizedTerm, parents, children);

            return this.annotationService.fromPhenotype(normalizedTerm.id).pipe(
              map((associations) =>
                this.buildTermViewModel(id, normalizedTerm, treeData, languages, {
                  diseaseAssoc: associations.diseases,
                  geneAssoc: associations.genes,
                  medicalActions: associations.medicalActions,
                  loincAssoc: associations.assays,
                  networkError: false,
                }),
              ),
              catchError(() =>
                of(
                  this.buildTermViewModel(id, normalizedTerm, treeData, languages, {
                    diseaseAssoc: [],
                    geneAssoc: [],
                    medicalActions: [],
                    loincAssoc: [],
                    networkError: true,
                  }),
                ),
              ),
            );
          }),
        );
      }),
    );
  }

  /**
   * Resolves the Entrez record and the gene's annotations.
   *
   * Both calls are allowed to fail independently: the Entrez lookup supplies
   * the summary, the annotation call supplies the tables, and losing one is
   * not a reason to drop the other. Unlike the term page there is nothing to
   * look up the entity by first, so neither failure can error the route.
   */
  private fetchGene(id: string): Observable<GenePageViewModel> {
    // Entrez keys its records by bare uid, while the route carries the
    // prefixed id - `NCBIGene:1497` is looked up as `1497`. Older links point
    // at the bare id, which is left as-is rather than losing the lookup.
    const uid = id.includes(':') ? id.split(':')[1] : id;

    return forkJoin({
      entrez: this.geneService.searchGeneInfo(uid).pipe(
        map((response) => response.result[uid] ?? null),
        catchError(() => of(null)),
      ),
      associations: this.annotationService.fromGene(id).pipe(catchError(() => of(null))),
    }).pipe(
      map(({ entrez, associations }) => ({
        kind: EntityType.GENE as const,
        id,
        title: entrez?.name ?? id,
        downloadCounts: {
          diseases: associations?.diseases.length ?? 0,
          terms: associations?.phenotypes.length ?? 0,
        },
        gene: this.normalizeGene(entrez),
        phenotypeAssoc: associations?.phenotypes ?? [],
        diseaseAssoc: associations?.diseases ?? [],
        entrezError: entrez === null,
        networkError: associations === null,
      })),
    );
  }

  /**
   * Fills in the display defaults the gene template assumes, and splits the
   * comma-joined `otheraliases` string Entrez returns into the synonym list
   * the summary renders.
   */
  private normalizeGene(gene: EntrezGene | null): EntrezGene {
    return {
      uid: gene?.uid,
      name: gene?.name ?? '',
      maplocation: gene?.maplocation ?? '',
      summary: gene?.summary || 'No Entrez definition entry.',
      otheraliases: gene?.otheraliases ?? '',
      aliases: gene?.otheraliases ? gene.otheraliases.split(',').map((alias) => alias.trim()) : [],
    };
  }

  /**
   * Assembles the term view model, deriving the {@link EntityPageViewModelBase}
   * fields the page shell reads. Shared by the success and network-error paths
   * so those two can never disagree about the shell's inputs.
   */
  private buildTermViewModel(
    paramId: string,
    term: Term,
    treeData: TermTree,
    languages: Language[],
    associations: Pick<
      TermPageViewModel,
      'diseaseAssoc' | 'geneAssoc' | 'medicalActions' | 'loincAssoc' | 'networkError'
    >,
  ): TermPageViewModel {
    return {
      kind: EntityType.PHENOTYPE,
      id: term.id,
      title: term.name,
      downloadCounts: {
        diseases: associations.diseaseAssoc.length,
        genes: associations.geneAssoc.length,
      },
      paramId,
      term,
      treeData,
      languages,
      publications: this.buildPublications(term),
      ...associations,
    };
  }

  /**
   * Lifts the term's bare PMID list into the shape the Publications section
   * renders. Ids only until real citation metadata exists - see
   * {@link PublicationReference}.
   */
  private buildPublications(term: Term): PublicationReference[] {
    return (term.publicationReferences ?? []).map((id) => ({ id }));
  }

  /**
   * Fills in the display defaults the templates assume are always present, so
   * no template has to branch on null. Also derives the OBO PURL, which is not
   * part of the API payload.
   */
  private normalizeTerm(term: Term): Term {
    return {
      ...term,
      comment: term.comment != null ? term.comment : '',
      synonyms: term.synonyms.length !== 0 ? term.synonyms : ['No synonyms found for this term.'],
      definition: term.definition != null ? term.definition : 'Sorry this term has no definition.',
      purl: 'https://purl.obolibrary.org/obo/' + term.id.replace(':', '_'),
      xrefs: term.xrefs != null ? term.xrefs : [],
    };
  }

  /**
   * Collapses the term's translations to one entry per language, led by the
   * default. A term carries a separate translation row per translated field
   * (name, definition, ...), so the raw list repeats languages.
   *
   * @returns An empty array when the term has no translations, which hides the language selector.
   */
  private buildLanguages(term: Term): Language[] {
    if (!term.translations || term.translations.length === 0) {
      return [];
    }
    const unique = [...new Set(term.translations.map((t) => JSON.stringify({ language: t.language, language_long: t.language_long })))]
      .map((entry) => JSON.parse(entry) as Language);
    return [this.languageService.default, ...unique];
  }

  /**
   * Orders children by subtree size and precomputes each one's descendant-bar
   * geometry, so the hierarchy template renders widths rather than deriving
   * them. Bars are sized as a proportion of the parent's descendant count.
   */
  private buildTreeData(term: Term, parents: Term[], children: Term[]): TermTree {
    const sortedChildren = [...children].sort((a, b) => (a.descendantCount > b.descendantCount ? -1 : 1));
    sortedChildren.forEach((child) => {
      const percent = child.descendantCount / term.descendantCount;
      const newWidth = Math.ceil(MAX_TREE_WIDTH * percent);
      child.treeCountWidth = newWidth;
      child.treeMargin = -46 + ((MAX_TREE_WIDTH - newWidth) - 2);
    });

    return {
      parents,
      children: sortedChildren,
      descendantCount: term.descendantCount,
      maxTermWidth: MAX_TREE_WIDTH,
    };
  }
}

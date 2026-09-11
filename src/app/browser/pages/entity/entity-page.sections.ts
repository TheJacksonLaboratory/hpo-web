import { EntityType, PanelMenuItem } from '../../models/models';
import { EntityPageViewModel } from './entity-page.types';
import { buildTermPageSections } from './content/term-page-content.sections';
import { buildGenePageSections } from './content/gene-page-content.sections';

/**
 * Dispatches to the section config of whichever entity page is being rendered.
 * Each type's config lives in `content/<type>-page-content.sections.ts`.
 *
 * @param viewModel The resolved view model, narrowed by its `kind` discriminant.
 * @returns Panel-menu items in the order the sections appear on the page.
 */
export function buildSections(viewModel: EntityPageViewModel): PanelMenuItem[] {
  switch (viewModel.kind) {
    case EntityType.PHENOTYPE:
      return buildTermPageSections(viewModel);
    case EntityType.GENE:
      return buildGenePageSections(viewModel);
  }
}

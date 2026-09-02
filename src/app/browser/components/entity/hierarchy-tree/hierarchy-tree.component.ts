import { Component, Input } from '@angular/core';
import { NgStyle } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Tooltip } from 'primeng/tooltip';
import { Language, Term, TermTree } from '../../../models/models';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

/**
 * The phenotype page's left rail: the term's immediate parents and children,
 * with a bar beside each child sized to that child's share of the subtree.
 *
 * Term-specific - only the phenotype page has a hierarchy, so gene and disease
 * pages render no left rail at all.
 */
@Component({
  selector: 'app-hierarchy-tree',
  standalone: true,
  imports: [NgStyle, RouterLink, Tooltip, TranslatePipe],
  templateUrl: './hierarchy-tree.component.html',
  styleUrl: './hierarchy-tree.component.scss',
})
export class HierarchyTreeComponent {
  /** The term at the centre of the hierarchy - the one this page is about. */
  @Input() term: Term;

  /**
   * Parents and children to render. Children arrive pre-sorted with their bar
   * geometry already computed by `EntityDataResolverService`.
   */
  @Input() treeData: TermTree;

  /** Language to render term labels in. */
  @Input() selectedLanguage: Language;

  /**
   * Inline styles for one child's descendant-count bar.
   *
   * @param child A child term carrying the precomputed `treeCountWidth` and `treeMargin`.
   * @returns Width and margins for the bar element.
   */
  setTreeStyles(child: Term): { width: string; 'margin-left': string; 'margin-right': string } {
    return { width: child.treeCountWidth + 'px', 'margin-left': child.treeMargin + 'px', 'margin-right': '20px' };
  }
}

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssociationsTableBlockComponent } from './associations-table-block.component';

@Component({
  standalone: true,
  imports: [AssociationsTableBlockComponent],
  template: `
    <app-associations-table-block
      anchorId="disease-associations"
      title="Disease Associations"
      [value]="value"
      [loading]="loading"
      [networkError]="networkError"
      [emptyCtaLink]="emptyCtaLink"
      [description]="description"
    >
      <ng-template #headerCells>
        <th>Id</th>
        <th>Name</th>
      </ng-template>
      <ng-template #rowCells let-row>
        <td>{{ row.id }}</td>
        <td>{{ row.name }}</td>
      </ng-template>
    </app-associations-table-block>
  `,
})
class HostComponent {
  value: { id: string; name: string }[] = [];
  loading = false;
  networkError = false;
  emptyCtaLink?: string;
  description?: string;
}

describe('AssociationsTableBlockComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
  });

  it('omits the description subheader when none is given', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h2').nextElementSibling).toBeNull();
  });

  it('renders the description as a subheader directly under the heading', () => {
    fixture.componentInstance.description = 'Diseases curated with this phenotype.';
    fixture.detectChanges();

    const subheader = fixture.nativeElement.querySelector('h2').nextElementSibling;
    expect(subheader.tagName).toBe('P');
    expect(subheader.textContent.trim()).toBe('Diseases curated with this phenotype.');
  });

  it('keeps the description visible when the section is empty', () => {
    fixture.componentInstance.value = [];
    fixture.componentInstance.description = 'Diseases curated with this phenotype.';
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-empty-state')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Diseases curated with this phenotype.');
  });

  it('shows a loading skeleton and no table while loading', () => {
    fixture.componentInstance.loading = true;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('p-skeleton')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('p-table')).toBeFalsy();
    expect(fixture.nativeElement.querySelector('app-empty-state')).toBeFalsy();
  });

  it('shows a network error message instead of the table', () => {
    fixture.componentInstance.networkError = true;
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Ontology Annotation Network Error');
    expect(fixture.nativeElement.querySelector('p-table')).toBeFalsy();
  });

  it('delegates to the empty state when there are no rows', () => {
    fixture.componentInstance.value = [];
    fixture.componentInstance.emptyCtaLink = 'https://example.com';
    fixture.detectChanges();

    const emptyState = fixture.nativeElement.querySelector('app-empty-state');
    expect(emptyState).toBeTruthy();
    expect(emptyState.querySelector('a').getAttribute('href')).toBe('https://example.com');
  });

  it('renders projected header/row templates when rows are present', () => {
    fixture.componentInstance.value = [
      { id: 'OMIM:100100', name: 'Test disease one' },
      { id: 'OMIM:100200', name: 'Test disease two' },
    ];
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('OMIM:100100');
    expect(text).toContain('Test disease two');
  });

  it('reports the row count in the heading, in every state', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h2').textContent).toContain('Disease Associations (0)');

    fixture.componentInstance.value = [
      { id: 'OMIM:100100', name: 'Test disease one' },
      { id: 'OMIM:100200', name: 'Test disease two' },
    ];
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h2').textContent).toContain('Disease Associations (2)');
  });
});

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

@Component({
  standalone: true,
  imports: [AssociationsTableBlockComponent],
  template: `
    <app-associations-table-block
      anchorId="phenotype-associations"
      title="Phenotype Associations"
      [value]="value"
      [groupRowsBy]="groupRowsBy"
      [groupOrder]="groupOrder"
      [paginated]="false"
    >
      <ng-template #headerCells>
        <th>Id</th>
        <th>Name</th>
      </ng-template>
      <ng-template #groupHeaderCells let-row>
        <td colspan="2">{{ row.category }} ({{ row.categoryCount }})</td>
      </ng-template>
      <ng-template #rowCells let-row>
        <td>{{ row.id }}</td>
        <td>{{ row.name }}</td>
      </ng-template>
    </app-associations-table-block>
  `,
})
class GroupedHostComponent {
  value: { id: string; name: string; category: string; categoryCount: number }[] = [
    { id: 'HP:0004322', name: 'Short stature', category: 'Growth', categoryCount: 2 },
    { id: 'HP:0001510', name: 'Growth delay', category: 'Growth', categoryCount: 2 },
    { id: 'HP:0000252', name: 'Microcephaly', category: 'Head and neck', categoryCount: 1 },
  ];
  groupRowsBy?: string = 'category';
  groupOrder?: string[];
}

describe('AssociationsTableBlockComponent grouping', () => {
  let fixture: ComponentFixture<GroupedHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [GroupedHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(GroupedHostComponent);
  });

  it('inserts one subheader per run of rows sharing the grouped value', () => {
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Growth (2)');
    expect(text).toContain('Head and neck (1)');
  });

  it('renders every row alongside the subheaders', () => {
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    for (const name of ['Short stature', 'Growth delay', 'Microcephaly']) {
      expect(text).toContain(name);
    }
  });

  const subheaderText = () =>
    Array.from(fixture.nativeElement.querySelectorAll('tbody td[colspan]')).map((cell: any) =>
      cell.textContent.trim(),
    );

  it('gathers scattered rows of one value into a single group', () => {
    fixture.componentInstance.value = [
      { id: 'HP:0004322', name: 'Short stature', category: 'Growth', categoryCount: 2 },
      { id: 'HP:0000252', name: 'Microcephaly', category: 'Head and neck', categoryCount: 1 },
      { id: 'HP:0001510', name: 'Growth delay', category: 'Growth', categoryCount: 2 },
    ];
    fixture.detectChanges();

    expect(subheaderText()).toEqual(['Growth (2)', 'Head and neck (1)']);
  });

  it('orders groups alphabetically when no explicit order is given', () => {
    fixture.componentInstance.value = [
      { id: 'HP:0001250', name: 'Seizure', category: 'Nervous System', categoryCount: 1 },
      { id: 'HP:0004322', name: 'Short stature', category: 'Growth', categoryCount: 1 },
      { id: 'HP:0000007', name: 'Autosomal recessive inheritance', category: 'Inheritance', categoryCount: 1 },
    ];
    fixture.detectChanges();

    expect(subheaderText()).toEqual(['Growth (1)', 'Inheritance (1)', 'Nervous System (1)']);
  });

  it('follows an explicit group order instead of sorting alphabetically', () => {
    fixture.componentInstance.groupOrder = ['Inheritance', 'Growth', 'Nervous System'];
    fixture.componentInstance.value = [
      { id: 'HP:0001250', name: 'Seizure', category: 'Nervous System', categoryCount: 1 },
      { id: 'HP:0004322', name: 'Short stature', category: 'Growth', categoryCount: 1 },
      { id: 'HP:0000007', name: 'Autosomal recessive inheritance', category: 'Inheritance', categoryCount: 1 },
    ];
    fixture.detectChanges();

    expect(subheaderText()).toEqual(['Inheritance (1)', 'Growth (1)', 'Nervous System (1)']);
  });

  it('sorts a group outside the explicit order last', () => {
    fixture.componentInstance.groupOrder = ['Inheritance', 'Growth'];
    fixture.componentInstance.value = [
      { id: 'HP:9999999', name: 'Unknown', category: 'Some New Category', categoryCount: 1 },
      { id: 'HP:0004322', name: 'Short stature', category: 'Growth', categoryCount: 1 },
    ];
    fixture.detectChanges();

    expect(subheaderText()).toEqual(['Growth (1)', 'Some New Category (1)']);
  });

  it('renders no subheaders when grouping is off', () => {
    fixture.componentInstance.groupRowsBy = undefined;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('tbody td[colspan]')).toHaveLength(0);
    expect(fixture.nativeElement.textContent).toContain('Short stature');
  });
});

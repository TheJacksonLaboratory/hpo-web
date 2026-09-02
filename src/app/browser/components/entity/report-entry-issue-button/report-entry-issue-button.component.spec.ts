import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportEntryIssueButtonComponent } from './report-entry-issue-button.component';

describe('ReportEntryIssueButtonComponent', () => {
  let fixture: ComponentFixture<ReportEntryIssueButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ReportEntryIssueButtonComponent] }).compileComponents();
    fixture = TestBed.createComponent(ReportEntryIssueButtonComponent);
  });

  it('points at the curation issue tracker with the entity id prefilled', () => {
    fixture.componentInstance.id = 'HP:0001250';
    fixture.detectChanges();

    const href = fixture.nativeElement.querySelector('a').getAttribute('href');
    expect(href).toContain('obophenotype/human-phenotype-ontology/issues/new');
    expect(href).toContain(encodeURIComponent('Issue with HP:0001250'));
  });

  it('encodes ids so the colon does not break the query string', () => {
    fixture.componentInstance.id = 'MONDO:0000001';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('a').getAttribute('href')).toContain('Issue%20with%20MONDO%3A0000001');
  });

  it('opens in a new tab', () => {
    fixture.componentInstance.id = 'HP:0001250';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('a').getAttribute('target')).toBe('_blank');
  });
});

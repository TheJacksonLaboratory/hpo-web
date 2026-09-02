import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HierarchyTreeComponent } from './hierarchy-tree.component';

describe('HierarchyTreeComponent', () => {
  let fixture: ComponentFixture<HierarchyTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HierarchyTreeComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HierarchyTreeComponent);
    fixture.componentInstance.term = { id: 'HP:0001250', name: 'Seizure', synonyms: [] };
    fixture.componentInstance.selectedLanguage = { language: 'en', language_long: 'English' };
    fixture.componentInstance.treeData = {
      parents: [{ id: 'HP:0012638', name: 'Abnormal nervous system physiology', synonyms: [], descendantCount: 500 }],
      children: [
        { id: 'HP:0002133', name: 'Status epilepticus', synonyms: [], descendantCount: 0 },
        { id: 'HP:0011146', name: 'Enuresis nocturna', synonyms: [], descendantCount: 1, treeCountWidth: 20, treeMargin: -100 },
      ],
      descendantCount: 4,
    };
  });

  it('renders a link for each parent and child', () => {
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Abnormal nervous system physiology');
    expect(text).toContain('Status epilepticus');
    expect(text).toContain('Enuresis nocturna');
  });

  it('bolds the current term without linking it', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('strong').textContent).toContain('Seizure');
  });

  it('computes proportional width/margin styles from a child\'s precomputed tree fields', () => {
    const style = fixture.componentInstance.setTreeStyles(fixture.componentInstance.treeData.children[1]);
    expect(style).toEqual({ width: '20px', 'margin-left': '-100px', 'margin-right': '20px' });
  });
});

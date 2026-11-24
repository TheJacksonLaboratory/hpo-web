Here is a clean, production-ready `README.md` structured as an implementation plan. You can drop this straight into your repository to document how the automated citation pipeline works.

---

# README.md

## Automated HPO Homepage Citation Reel: Implementation Plan

This document outlines the architecture, automated data pipeline, and frontend implementation for displaying a rotating highlight of the absolute newest scientific papers citing the Human Phenotype Ontology (HPO) on the homepage.

---

## 📋 Architectural Overview

To protect our API rate limits and optimize the HPO homepage for speed, we decouple data collection from client-side rendering using a **Serverless Static-File Cache** strategy.

```
[GitHub Action (Every 2 Weeks)]
               │
               ▼
   [Fetch Top 15 from OpenAlex]
               │
               ▼
 [Compress Keys & Strip Metadata]
               │
               ▼
 [Commit to src/assets/data/*.json] ──► [Production Build/Deploy]
                                                    │
                                                    ▼
                                      [Angular Frontend Reads Static File]
                                                    │
                                                    ▼
                                      [Shuffle & Display 1 Paper]

```

### Key Design Metrics

* **Network Payload Size:** ~1.5 KB raw (~500 bytes over the wire via Gzip).
* **API Dependencies:** Zero runtime network calls to 3rd-party servers (OpenAlex).
* **UI Footprint:** Rotates through a subslice of the 15 absolute newest papers, displaying **exactly one** record at a time to keep the layout tight.

---

## 🛠️ Step 1: Data Extraction Script

Create a Node.js automation utility script inside your repository at `scripts/update-citations.js`. This script pulls from the OpenAlex REST API and enforces our minimalist, single-character key schema:

* `t`: Title
* `a`: Formatted Authors string
* `d`: Publication Date (`YYYY-MM`)
* `u`: Clean DOI Suffix string

```javascript
// scripts/update-citations.js
const fs = require('fs');

async function updateCitations() {
  const openAlexId = 'W2134547434'; // HPO 2008 Paper Core ID
  const apiUrl = `https://api.openalex.org/works?filter=cites:${openAlexId}&sort=publication_date:desc&per_page=15`;

  try {
    console.log('Fetching top 15 newest citations from OpenAlex...');
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    const compressedPool = (data.results || []).map(paper => {
      const authorsList = paper.authorships || [];
      let authorString = 'Unknown';
      if (authorsList.length > 0) {
        const names = authorsList.map(a => a.author.display_name);
        authorString = names.length > 2 ? `${names[0]}, ${names[1]} et al.` : names.join(', ');
      }

      return {
        t: paper.title || 'No Title',
        a: authorString,
        d: (paper.publication_date || '').substring(0, 7), 
        u: (paper.doi || '').replace('https://doi.org/', '') 
      };
    });

    const outputPath = './src/assets/data/hpo-citations.min.json';
    fs.mkdirSync('./src/assets/data', { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(compressedPool));
    console.log(`Successfully compiled tiny footprint asset to ${outputPath}`);

  } catch (error) {
    console.error('Pipeline process failure:', error);
    process.exit(1);
  }
}

updateCitations();

```

---

## 🤖 Step 2: GitHub Action Automation

Create the workflow file at `.github/workflows/update-citations.yml`. This routine acts as an automated cron-job that wakes up twice a month to refresh our static dataset pool.

```yaml
# .github/workflows/update-citations.yml
name: Scheduled HPO Citation Update

on:
  schedule:
    # Triggers at midnight on the 1st and 15th of every month
    - cron: '0 0 1,15 * *'
  workflow_dispatch: # Allows manual trigger from GitHub Actions dashboard

jobs:
  update-and-commit:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Generate Minified Citations File
        run: node scripts/update-citations.js

      - name: Commit and Push Changes
        run: |
          git config --global user.name "github-actions[bot]"
          git config --global user.email "github-actions[bot]@users.noreply.github.com"
          git add src/assets/data/hpo-citations.min.json
          
          if git diff --staged --quiet; then
            echo "No new citations found since last run."
          else
            git commit -m "chore(data): automated update of latest HPO citations [skip ci]"
            git push
          fi

```

---

## 💻 Step 3: Angular Frontend Implementation

Our component reads the local file synchronously or asynchronously via Angular's `HttpClient`. It shuffles the array locally to randomly select and mount **exactly one** record.

### Component Code

```typescript
// hpo-single-citation.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface Citation {
  t: string; // Title
  a: string; // Authors
  d: string; // Date (YYYY-MM)
  u: string; // DOI Suffix
}

@Component({
  selector: 'app-hpo-single-citation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hpo-single-citation.component.html',
  styleUrls: ['./hpo-single-citation.component.css']
})
export class HpoSingleCitationComponent implements OnInit {
  private http = inject(HttpClient);
  paper: Citation | null = null;

  ngOnInit() {
    this.http.get<Citation[]>('assets/data/hpo-citations.min.json').subscribe(pool => {
      if (pool && pool.length > 0) {
        // Randomly select exactly 1 publication from the top-15 subslice
        const randomIndex = Math.floor(Math.random() * pool.length);
        this.paper = pool[randomIndex];
      }
    });
  }
}

```

### Component Template HTML

```html
@if (paper) {
  <div class="hpo-citation-card">
    <div class="citation-header">
      <span class="badge">Recent Community Highlight</span>
    </div>
    <a [href]="'https://doi.org/' + paper.u" target="_blank" class="paper-title">
      "{{ paper.t }}"
    </a>
    <p class="paper-meta">
      Published: <strong>{{ paper.d }}</strong> — By: <em>{{ paper.a }}</em>
    </p>
  </div>
}

```

---

## 📊 Deployment and Fallback Safety Net

1. **Build Step Pipeline Integration:** Because the file is written straight to standard Angular assets, it requires no adjustments to standard build processes.
2. **Fail-Safe Operation:** If the GitHub Action script ever fails due to a network timeout or upstream API changes, the workspace stays intact, and the pipeline safely continues displaying the prior generation's static JSON payload. No broken homepage widgets can occur.
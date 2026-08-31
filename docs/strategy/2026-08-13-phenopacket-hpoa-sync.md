# Phenopacket Store → small files: structure, sync, and gaps

Written 2026-08-13, after the PI conversation on data staleness.
Companion to [2026-08-12-redesign-direction.md](./2026-08-12-redesign-direction.md), which
covers the serving layer. This document covers the **content** layer.

Measured against artifacts, not from memory. The two sides are time-aligned to within a day:

- **Phenopacket Store release `0.1.27`**, published 2026-06-09 — 10,377 phenopackets, 700 cohorts
- **`hpo-annotation-data`** at `b31e381f5`, committed 2026-06-08 — 8,693 `.tab` files, 183,812 rows
- **`hp.json`** at 2026-06-04, for term validity
- Scripts: `gap27.py` and friends in the session scratchpad

> An earlier draft used a local `all_phenopackets.zip` from Feb 2025 (`0.1.24`). Every number
> below supersedes it. The structural findings all held; the counts grew by roughly a third.

---

## What the ecosystem diagram asks for

Two orange arrows labelled **"Automatic"** run from **PhenoBoard** and **Phenopacket Store
GitHub** into **Small File (non aggregate)**, which feeds `hpo-annotation-data` → `hpoannotqc`
→ the HPOA big file → ontology release → `ontology-service` / OAN → hpo.jax.org.

Everything downstream of the small files is automated today. The two orange arrows are not.
That is the whole of the ask.

---

## Part 1 — Store structure: keyed by names, needs to be keyed by IDs

### How it is laid out

```
0.1.27/
  phenopacket_store.summary.tsv
  <COHORT>/PMID_<pmid>_<individual>.json
```

The addressable structure — directory names and file names — is entirely **labels**. The
identifiers exist inside the JSON and are never used as keys.

| Concept | In the path | Inside the packet |
|---|---|---|
| Gene | cohort directory, as a **symbol** (`LIPT2`) | `geneContext.valueId` → `HGNC:37216` |
| Disease | **absent from the path entirely** | `interpretations[].diagnosis.disease.id` → `OMIM:617668` |
| Publication | filename prefix `PMID_28757203` | `metaData.externalReferences[].id` |
| Individual | filename suffix, a free-text label | `subject.id` |

The IDs are clean and complete, so re-keying is mechanical rather than a curation exercise:

- **699 of 700 cohorts resolve to exactly one HGNC id.** No cohort maps to two genes. The lone
  exception is `11q_terminal_deletion`, a locus with no gene.
- Every gene reference in the store is `HGNC:`; every disease is `OMIM:`. No mixed prefixes.
- All 10,377 packet ids are unique; every packet has exactly one PMID; none has zero.

### Why names as keys is the actual problem

Symbols drift and are mistyped; IDs do not. Two cohort directories are wrong **right now**:

| Directory | Real symbol for that HGNC id |
|---|---|
| `HNRPA2B1` | `HNRNPA2B1` (HGNC:5033) — transposition |
| `MTTV` | `MT-TV` (HGNC:7500) — dropped hyphen |

This is a recurring class, not a one-off: the Feb 2025 release had a different pair, including
`RECQL2`, which is an obsolete alias for **WRN** — a consumer keying on the directory name
would have attributed those packets to the wrong gene entirely. Both of those were later fixed
by hand, and two new ones appeared. Keying by HGNC id ends the category.

### The published index does not work

`phenopacket_store.summary.tsv` ships in the release root with 10,377 rows and these columns:

```
patient_id  cohort  disease_id  disease  gene  allele_1  allele_2  PMID  filename
```

- **0 of 10,377 `filename` values resolve to a file in the archive.** The index is generated
  from the notebook layout (`ESAM/phenopackets/…`) while the archive is flattened
  (`ESAM/…`), and the values have also lost their `.json` extension — the current example
  reads `ESAM/phenopackets/PMID_36996813_Individual_11`. The index points at nothing.
- `disease_id` is present, but **`gene` is a symbol with no `gene_id` column** — so the one
  identifier a consumer most needs for the cohort key is the one the index omits.
- There is **no phenotype in the index at all.** It is a genotype manifest. A phenotype
  resource cannot be indexed by it.

### Consistency issues a public consumer hits

| | |
|---|---|
| `phenopacketSchemaVersion` | three values: `2.0.2` (9,921), `2` (368), `2.0` (88) |
| HPO version inside packets | **9 distinct, spanning 2024-02-27 → 2026-02-16** — a two-year spread in one release, and the release declares no version of its own |
| `metaData.createdBy` | **10,220 of 10,377 omit the `ORCID:` prefix**; 19 include it. This regressed — the Feb 2025 release had it the other way round |

The HPO version spread turns out to be **less dangerous than it looks**, and that is worth
recording so it does not get over-scoped: against `hp.json` 2026-06-04, of the 4,558 distinct
HP terms the store uses, **none are missing from current HPO** and only 7 are deprecated,
affecting 26 feature rows out of 224,863.

The real consequence is labels, not ids: **87 terms carry a label in the packet that no longer
matches HPO** (`HP:0000787` says "Nephrolithiasis"; HPO now says "Kidney stone"). So any
converter must re-resolve `phenotypeName` from the current ontology and never copy the label
out of the packet. This is the `TermId/Label Updates` box on the diagram.

---

## Part 2 — The sync

### Structure of a small file

One file per disease, `OMIM-100070.tab`, 14 tab-separated columns:

```
diseaseID  diseaseName  phenotypeID  phenotypeName  onsetID  onsetName  frequency
sex  negation  modifier  description  publication  evidence  biocuration
```

A row is one **(disease, HPO term, publication)** assertion with an aggregate frequency — a
disease-level summary. The store is individual-level. **The sync is an aggregation, not a
copy**, and (disease, term, PMID) is the join key on both sides.

Corpus shape: 71.5% of rows carry a PMID; evidence is PCS 131,683 / IEA 31,346 / TAS 20,783;
frequency is `n/m` in 115,630 rows and empty in 64,472; **negation is used in 0 of 183,812
rows**; `biocuration` already uses `ORCID:…[date]`, so credit transfers directly.

### Column mapping

| Small-file column | Store source | Status |
|---|---|---|
| `diseaseID` / `diseaseName` | `interpretations[].diagnosis.disease` | direct |
| `phenotypeID` | `phenotypicFeatures[].type.id` | direct |
| `phenotypeName` | **re-resolve from HPO**, not from the packet | 87 stale labels |
| `frequency` | **derived**: k observed / m recorded per (disease, term, PMID) | see G2 |
| `publication` | `metaData.externalReferences[].id` | direct |
| `evidence` | always `PCS` — every packet is a published case report | direct |
| `biocuration` | `createdBy` + `created` | normalise the 10,220 bare ORCIDs |
| `negation` | `phenotypicFeatures[].excluded` | **G3 — currently discarded** |
| `onsetID` / `onsetName` | `phenotypicFeatures[].onset.ontologyClass` | **G4 — 96% absent** |
| `sex` | `subject.sex` — per individual, not per annotation | **G5 — semantics differ** |
| `modifier` | `phenotypicFeatures[].modifiers[]` | direct |
| `description` | none | stays blank |
| — | variants, measurements, medical actions, age | **dropped, stays store-only** |

---

## The gaps

### G1 — The same evidence is curated twice by hand, and the small files are the half that lags

Both artifacts were hand curated. **Neither was generated from the other** — `hpoannotqc` has
no phenopacket awareness, nothing in the pipeline writes small files from the store, and the
two were built independently from the same papers, largely by the same curator.

That makes the agreement between them a measurement rather than a tautology. 75.9% of
store-observed (disease, term, PMID) triples appear verbatim in the small files, and 93.9% of
comparable frequencies match the store's k/m exactly — two independent manual passes reaching
the same number. So the aggregation rule in G2 is **the curator's own rule, recovered from the
data**, and the 26,455 overlapping rows are a ground-truth test set: a converter that
reproduces them is reproducing what the curator would have written by hand.

The staleness mechanism is that the same intellectual work is done twice and only one half is
still moving. Current backlog:

| | |
|---|---|
| Observed triples in the store, absent from small files | **8,422** |
| ...where the (disease, term) pair is entirely new | 5,357 |
| Frequencies that disagree between the two | **1,238** |
| Small files a sync would modify | **379** of 8,693 |
| Store diseases with no small file at all | 2 (`OMIM:601674`, `OMIM:621193`) |

### G2 — The denominator rule is settled, but conflicts have no owner

Two candidate rules, tested against 26,455 overlapping rows:

- `k/m`, m = individuals in whom the term was **recorded** (observed or explicitly excluded) — **93.9%**
- `k/N`, N = all individuals in the (disease, PMID) group — 1.4%
- neither — 4.7% (**1,238 rows**)

The rule is `k/m`. The open question is the 1,238: sampling shows the small file reading `3/3`
where the store computes `2/8` for the same triple, both touched by the same curator, with
nothing recording which is current. The sync cannot resolve these and must surface them.

### G3 — Explicit absence is thrown away

**59.1% of all phenotypic features in the store are `excluded: true`** — 132,795 of 224,863.
The small-file corpus has **zero** negation rows.

- **6,517** (disease, term, PMID) triples are *only ever* excluded — **2,028** of them with
  m ≥ 3 — and are invisible to HPOA entirely. These are the strongest candidate `NOT`
  annotations in the corpus.
- Every frequency denominator depends on exclusions. Without them there is no m, and "reported
  in 3 patients" cannot become "3 of 8".

This is the largest structural difference between the two models and the one place the store
holds evidence HPOA has no representation of.

### G4 — Onset mostly does not transfer

215,583 of 224,863 features carry no onset. Of the rest, 2,730 are HPO onset classes (transfer
directly) and 6,436 are ISO-8601 ages needing an age→onset-class conversion that does not
exist. Disease-level onset sits separately at `diseases[].onset` with no column to land in.

### G5 — Sex means different things on each side

`subject.sex` is a property of an individual (M 5,060 / F 4,517 / unknown 799). The small-file
`sex` column asserts a sex-*specific* annotation. Deriving one from the other is an inference,
not a transfer. Left blank until the PI decides a rule.

### G6 — Coverage is 8.9%, and that is the ceiling

778 of 8,693 diseases have store backing; 7,915 do not. **The store cannot fix HPOA staleness
at large.** It deepens a narrow slice with individual-level evidence and real denominators.
The other 91% stays on manual curation and is a separate problem — worth stating plainly so
the sync is not oversold as the answer to staleness.

### G7 — Nothing marks a row as store-derived

Re-running the sync cannot distinguish its own previous output from hand curation, so it
cannot update the former without risking the latter. `biocuration` carries an ORCID and a date
but no provenance marker. This must be solved before the first automated run, or the second
run is destructive.

### G8 — Cohort is a gene, disease is the key

Cohorts are gene-organised and the disease appears nowhere in the path. The converter reads
the disease from each packet and groups by (disease, PMID) across the whole release — 1,780
groups, 1,097 of them with two or more individuals.

---

## What the sync has to be

1. **One-way, store → small files.** The store is individual-level and strictly richer;
   nothing flows back.
2. **Grain: (disease, HPO term, PMID)**, frequency `k/m`, evidence `PCS`, biocuration from
   `createdBy` + `created`, `phenotypeName` re-resolved from current HPO.
3. **Triggered on store release**, mirroring `ontology-check-trigger.yml` — the pattern
   `ontology-service` already proves.
4. **Emits a pull request against `hpo-annotation-data`, not a direct write.** The PI reviews a
   diff. This keeps the human gate the PI wants, and it is what makes the automation acceptable
   rather than a replacement for curation.
5. **Conflicts reported, never auto-resolved** — the 1,238 disagreements go in the PR body.
6. **Generated rows identifiable**, so run N+1 can update run N's output and leave hand
   curation alone (G7).
7. **Validated against the 26,455 hand-curated overlapping rows before it is trusted on the
   8,422 new ones.** It must reproduce what the curator wrote by hand at ≥93.9%; every miss is
   either a converter bug or one of the 1,238 known conflicts, and the two must be told apart.

---

## Sequencing

**ID-key the store first, then build the sync on it.** The sync groups by (disease, PMID)
across cohorts, so it wants identifier-keyed access; building it against label-keyed
directories means writing the same resolution logic twice and inheriting the symbol drift.

## Decisions needed from the PI

1. The 1,238 frequency conflicts — store wins, small file wins, or every one goes to review?
2. Do we begin emitting `NOT` rows from `excluded`? 2,028 candidates at m ≥ 3, in a corpus that
   has never had one. Highest-value item and the biggest change in kind.
3. The 6,436 ISO-8601 ages — convert to HPO onset classes, or drop onset for now?
4. Sex-specific annotations — define a rule, or leave the column blank?
5. Small files: **support or replace**? The sync writing small files keeps `hpoannotqc` and the
   7,915 non-store diseases working unchanged. Generating HPOA rows directly for store-backed
   diseases is fewer moving parts but forks the pipeline.

## Open item

There may be existing Rust that already does some of this conversion. Not in the local
`phenopacket-rs` clone, which has no HPOA or small-file code. Worth locating before the
converter is scoped, though the inputs, outputs and validation target are the same either way.

---

## Relationship to the serving-layer plan

Independent, and both are needed. The redesign plan (HPO-154 → HPO-155 → HPO-175) fixes how
fast the site can *serve* a release and how much provenance it *shows*. This document fixes how
fast curated evidence *reaches* a release. Shipping provenance UI over content that is 8,422
rows behind the store just renders the gap faster.

The one hard link is G3. If `NOT` rows start being emitted, HPO-175 — the existing
`NOT`-qualifier rows served as positive assertions — stops being an edge case and becomes a
correctness requirement on the serving side.

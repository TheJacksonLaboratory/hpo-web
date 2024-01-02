// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
const HPO_API_BASE_URL = 'http://localhost:8080/api/hp/';
const ONTOLOGY_SERVICE_API_HP = HPO_API_BASE_URL + 'hp/';
export const environment = {
  production: false,

  VERSION: require('../../package.json').version,
  // HPO MIGRATE SEARCH
  HPO_API_SEARCH_URL: HPO_API_BASE_URL + 'search',
  HPO_API_DOWNLOAD_EXCEL_TERM_PATH: 'download/term',
  HPO_API_DOWNLOAD_EXCEL_DISEASE_PATH: 'download/disease',
  HPO_API_DOWNLOAD_EXCEL_GENE_PATH: 'download/gene',
  HPO_GOOGLE_ANALYTICS_TRACKING_ID: '',
  HPO_GOOGLE_ANALYTICS_TEST_TRACKING_ID: 'UA-119669503-2',
  HPO_ENABLE_GA_TEST: false,

  // NEW ONTOLOGY API
  ONTOLOGY_API_HP_TERMS: ONTOLOGY_SERVICE_API_HP + 'terms/',
  ONTOLOGY_API_HP_SEARCH: ONTOLOGY_SERVICE_API_HP + 'search',
  ONTOLOGY_NETWORK_ANNOTATION_API: HPO_API_BASE_URL + 'network/annotation/',
  ONTOLOGY_NETWORK_SEARCH_API: HPO_API_BASE_URL + 'network/search/',

  // Monarch external disease definition URL
  HPO_MONARCH_DISEASE_URL: 'https://api.monarchinitiative.org/api/bioentity/disease/',
  // ENTREZ external URL
  HPO_ENTREZ_SEARCH_URL: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi',
  // UniProt External Url
  HPO_UNIPROT_MAPPING_URL: 'https://www.uniprot.org/uploadlists/',
  // UniProt widget URL
  HPO_UNIPROT_WIDGET_URL: 'https://www.uniprot.org/uniprot/',
  // Contributors File
  HPO_CONTRIBUTORS_URL: 'https://raw.githubusercontent.com/monarch-initiative/hpo-web-config/master/individual-contributors.csv',
  // Team Monarch Json
  HPO_TEAM_HPO_URL: 'assets/team.json',
  // News
  HPO_NEWS_JSON_URL: 'https://raw.githubusercontent.com/monarch-initiative/hpo-web-config/master/news.json',
  // Publications
  HPO_PUBLICATION_REST_URL: 'https://raw.githubusercontent.com/monarch-initiative/hpo-web-config/master/hpocitations.txt',
  //HPOA
  HPO_ANNOTATION_FILE_PURL: 'https://purl.obolibrary.org/obo/hp/hpoa/phenotype.hpoa',
  HPO_GITHUB_REPO_URL:'https://api.github.com/repos/obophenotype/human-phenotype-ontology',
  ONTO_RELEASE_NO_EXT: 'https://github.com/obophenotype/human-phenotype-ontology/releases/latest/download/hp',
  HPO_RELEASES: 'https://github.com/obophenotype/human-phenotype-ontology/releases'
};


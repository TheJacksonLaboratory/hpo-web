// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
const  HPO_API_BASE_URL = 'http://localhost:8080/api/hpo/';
export const environment = {
  production: false,

  VERSION: require('../../package.json').version,
  // HPO API environment variables
  HPO_API_SEARCH_URL:  HPO_API_BASE_URL + 'search',
  HPO_API_TERM_SEARCH_URL: HPO_API_BASE_URL + 'term/',
  HPO_API_TERM_TREE_URL: HPO_API_BASE_URL + 'term/relations',
  HPO_API_GENE_SEARCH_URL: HPO_API_BASE_URL + 'search/gene',
  HPO_API_DISEASE_SEARCH_URL: HPO_API_BASE_URL + 'search/disease',
  HPO_API_DOWNLOAD_EXCEL_TERM_URL: HPO_API_BASE_URL + 'download/term',
  HPO_API_DOWNLOAD_EXCEL_DISEASE_URL: HPO_API_BASE_URL + 'download/disease',
  HPO_API_DOWNLOAD_EXCEL_GENE_URL: HPO_API_BASE_URL + 'download/gene',
  HPO_GOOGLE_ANALYTICS_TRACKING_ID: '',
  HPO_GOOGLE_ANALYTICS_TEST_TRACKING_ID: 'UA-119669503-2',
  HPO_ENABLE_GA_TEST: false,


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
  // News
  HPO_NEWS_JSON_URL: 'https://raw.githubusercontent.com/monarch-initiative/hpo-web-config/master/news.json',
  // Publications
  HPO_PUBLICATION_REST_URL: 'todo'
};


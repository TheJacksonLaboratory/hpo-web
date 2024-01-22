const ONTOLOGY_API_BASE_URL = 'http://localhost:8081/api/';
const ONTOLOGY_API_ANNOTATION_BASE_URL = 'http://localhost:8080/api/';
const ONTOLOGY_SERVICE_API_HP = ONTOLOGY_API_BASE_URL + 'hp/';

export const environment = {
  production: false,

  VERSION: require('../../package.json').version,
  // HPO API environment variables
  HPO_API_SEARCH_URL: ONTOLOGY_API_BASE_URL + 'search',
  HPO_API_DOWNLOAD_EXCEL_TERM_PATH: 'download/term',
  HPO_API_DOWNLOAD_EXCEL_DISEASE_PATH: 'download/disease',
  HPO_API_DOWNLOAD_EXCEL_GENE_PATH: 'download/gene',
  ONTOLOGY_API_HP_TERMS: ONTOLOGY_SERVICE_API_HP + 'terms/',
  ONTOLOGY_API_HP_SEARCH: ONTOLOGY_SERVICE_API_HP + 'search',
  ONTOLOGY_NETWORK_ANNOTATION_API: ONTOLOGY_API_ANNOTATION_BASE_URL + 'network/annotation/',
  ONTOLOGY_NETWORK_SEARCH_API: ONTOLOGY_API_ANNOTATION_BASE_URL + 'network/search/',
  // Analytics
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
  // Team Monarch Json
  HPO_TEAM_HPO_URL: 'assets/team.json',
  // News
  HPO_NEWS_JSON_URL: 'https://raw.githubusercontent.com/monarch-initiative/hpo-web-config/master/news.json',
  // Publications
  HPO_PUBLICATION_REST_URL: 'https://raw.githubusercontent.com/monarch-initiative/hpo-web-config/master/hpocitations.txt',
  //HPOA
  HPO_ANNOTATION_FILE_PURL: 'https://purl.obolibrary.org/obo/hp/hpoa/phenotype.hpoa',
  HPO_GITHUB_REPO_URL:'https://api.github.com/repos/obophenotype/human-phenotype-ontology',
  ONTO_RELEASE_NO_EXT: 'https://github.com/obophenotype/human-phenotype-ontology/releases/latest/download/',
  HPO_RELEASES: 'https://github.com/obophenotype/human-phenotype-ontology/releases'
};

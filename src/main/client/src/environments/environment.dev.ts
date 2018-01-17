const HPO_API_BASE_URL = '../api/hpo/';
export const environment = {
  production: false,

  // HPO API environment variables
  HPO_API_SEARCH_URL:  HPO_API_BASE_URL + 'search',
  HPO_API_TERM_SEARCH_URL: HPO_API_BASE_URL + 'term/',
  HPO_API_TERM_TREE_URL: HPO_API_BASE_URL + 'term/relations',
  HPO_API_GENE_SEARCH_URL: HPO_API_BASE_URL + 'search/gene',
  HPO_API_DISEASE_SEARCH_URL: HPO_API_BASE_URL + 'search/disease',

  //ENTREZ external URL
  HPO_ENTREZ_SEARCH_URL: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi',
  //UniProt External Url
  HPO_UNIPROT_MAPPING_URL: 'http://www.uniprot.org/uploadlists/'
};

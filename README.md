# Hpo Web

This is the hpo website hosted at [https://hpo.jax.org](https://hpo.jax.org). An Angular application currently at version 14.

## Developing

`npm run start`

## Testing
`npm run test`

## Deploying
Currently the HPO site is deployed on the google cloud in the `jax-robinson-hpo-01`. See `.github/workflows/hpo-web.yml`. This deploys the latest main branch to production. This is only needed when a new language gets added or a new ui feature is implemented. (this is not needed on new ontology releases)
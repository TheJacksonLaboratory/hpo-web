# HPO Web

Front end for the Human Phenotype Ontology site, [hpo.jax.org](https://hpo.jax.org). Data is served by the [JAX Ontology API](https://ontology.jax.org/api/).

Angular 21 · Angular Material · Tailwind CSS · Node 24

## Development

```bash
npm install
npm run start:prod   # http://localhost:4200, production API
```

`npm run start` targets local API services (see `src/environments/environment.ts`).

| Command | |
| --- | --- |
| `npm run test` | Unit tests (Jest) |
| `npm run lint` | Lint |
| `npm run e2e` | End-to-end tests (Cypress, app must be running) |
| `npm run build:prod` | Production build to `dist/hpo-web/browser` |

## Deployment

Pull requests to `main` run lint and tests, and deploy to SQA.

To release, bump `version` in `package.json`, merge to `main`, and run the **HPO-WEB Prod Static Deployment** workflow. Ontology releases don't need a redeploy.

## License

[MIT](LICENSE.md)

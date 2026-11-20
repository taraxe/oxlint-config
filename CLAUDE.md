# CLAUDE.md

Preset oxlint commun aux projets Taraxe. Le README (en français, comme le reste du dépôt) est la référence : principes, ce qui reste dans chaque projet, règles écartées.

## Commandes

```sh
npm ci
npm test   # node verifier.mjs : règles triées, toutes en "error", toutes reconnues par oxlint
```

## Règles du dépôt

- `base.json` et `react.json` sont la seule source des règles communes. Ne pas recopier une règle du preset dans un projet.
- Une règle du preset est toujours `"error"`, et les règles restent triées (règles sans préfixe d'abord, puis par plugin). `npm test` le vérifie.
- Ne pas réactiver une catégorie d'oxlint, ni une règle de la table « Règles écartées après examen » du README, sans accord explicite.
- Avant de proposer une règle : la lier dans les trois projets (`node_modules/@taraxe/oxlint-config`) et lancer leur lint. Dire combien de signalements elle produit dans chacun.
- Une version = une ligne dans `CHANGELOG.md`, la version de `package.json`, puis le tag `v<version>` posé après la fusion. Les projets épinglent un commit (archive HTTPS, voir le README), jamais `main`.
- Commits en français.

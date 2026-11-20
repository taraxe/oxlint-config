# @taraxe/oxlint-config

Les règles [oxlint](https://oxc.rs/docs/guide/usage/linter) communes aux projets Taraxe (taraxe.com, Broadcast, Offshore Races). Une seule source : une règle se change ici, pas dans trois configurations.

- `base.json` : JavaScript et TypeScript, avec les règles typées (185 règles).
- `react.json` : React et accessibilité JSX (56 règles), à ajouter par-dessus la base.

## Installation

```sh
npm install -D "@taraxe/oxlint-config@https://codeload.github.com/taraxe/oxlint-config/tar.gz/<commit>" oxlint@^1.94.0 oxlint-tsgolint
```

`<commit>` est le SHA complet du commit voulu (ou un tag `v<version>`). L'archive HTTPS s'installe sans Git ni clé SSH, ce qui compte pour les builds Cloudflare ; `github:taraxe/oxlint-config#…` inscrit une adresse `git+ssh` dans le `package-lock.json`.

`.oxlintrc.json` du projet :

```jsonc
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "extends": [
    "./node_modules/@taraxe/oxlint-config/base.json",
    "./node_modules/@taraxe/oxlint-config/react.json" // projets React seulement
  ],
  "env": { "browser": true, "node": true, "es2024": true },
  "ignorePatterns": ["dist/**"],
  "rules": {
    // ce qui est propre au projet
  }
}
```

Lancer avec `oxlint --deny-warnings`. `env` et `ignorePatterns` ne sont pas hérités : ils restent dans le projet.

## Principes

- **Toutes les règles sont nommées.** Les catégories d'oxlint (`correctness`, `suspicious`…) sont coupées : une montée de version d'oxlint ne peut pas activer une règle sans qu'on l'ait décidé ici.
- **Une règle du preset est une erreur.** Un avertissement, ou une règle coupée, se décide dans le projet, avec sa raison.
- **Le type porte la règle quand il le peut.** Pas de `any`, pas d'assertion (`as`, `!`), pas de valeur non typée qui circule (`no-unsafe-*`), `switch` exhaustif, promesses attendues ou marquées `void`.
- **Une exception se met sur la ligne**, avec sa raison : `// oxlint-disable-next-line <règle> -- <pourquoi>`.

## Ce que le projet garde chez lui

- Les règles de son cadre : `nextjs/*` (Broadcast), `vitest/*` et le plugin maison (Offshore Races).
- Les options qui dépendent de ses outils : par exemple, sur taraxe.com, `no-floating-promises` laisse passer `describe` et `test` de `node:test`.
- L'accessibilité au-delà du socle commun : les règles `jsx-a11y` sur lesquelles les projets ne sont pas encore d'accord restent locales, en attendant d'être tranchées.
- Les scripts JavaScript sans types : un projet peut couper les cinq règles `typescript/no-unsafe-*` sur `**/*.{js,mjs,cjs}`.

## Règles écartées après examen

Elles faisaient partie de la catégorie `suspicious`. Ne pas les rajouter sans rouvrir la discussion.

| Règle | Pourquoi |
| --- | --- |
| `unicorn/consistent-function-scoping` | Les petites fonctions locales se lisent mieux là où elles servent. |
| `no-underscore-dangle` | Les API externes (Stripe, D1) ont des noms en `_`. |
| `unicorn/no-array-sort`, `unicorn/no-array-reverse` | Trier une copie qu'on vient de créer est sans risque. |
| `typescript/consistent-return` | Redondant avec le contrôle des types. |
| `typescript/no-unnecessary-type-parameters` | Faux positifs sur les gardes génériques. |
| `promise/always-return`, `promise/no-promise-in-callback` | Trop de bruit sur du code correct. |
| `unicorn/prefer-add-event-listener`, `unicorn/no-new-array` | Préférences de style. |
| `import/no-unassigned-import`, `import/no-named-as-default`, `import/no-named-as-default-member` | Imports de CSS et de polyfills ; faux positifs sur les bibliothèques. |

## Changer une règle

1. Modifier `base.json` ou `react.json` (les règles restent triées), puis `npm test`.
2. Essayer dans les trois projets avant de publier : lier ce dossier dans `node_modules/@taraxe/oxlint-config` et lancer leur lint.
3. Monter la version dans `package.json`, ajouter la ligne du `CHANGELOG.md`, fusionner, puis poser le tag `v<version>` sur ce commit.
4. Dans chaque projet, pointer la dépendance sur le nouveau commit, avec les corrections que la règle demande.

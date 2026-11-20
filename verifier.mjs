// Vérifie les presets : JSON valide, règles triées, toutes en "error", aucune inconnue d'oxlint.
import { readFileSync, mkdtempSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const fichiers = ["base.json", "react.json"];
let erreurs = 0;
const erreur = (m) => { console.error(m); erreurs++; };
const rang = (nom) => `${nom.includes("/") ? 1 : 0}${nom}`;

for (const f of fichiers) {
  const preset = JSON.parse(readFileSync(f, "utf8"));
  const noms = Object.keys(preset.rules);
  if (noms.join() !== noms.toSorted((a, b) => (rang(a) < rang(b) ? -1 : 1)).join()) erreur(`${f} : règles non triées`);
  for (const [nom, valeur] of Object.entries(preset.rules)) {
    const niveau = Array.isArray(valeur) ? valeur[0] : valeur;
    if (niveau !== "error") erreur(`${f} : ${nom} doit être "error" (une règle absente est coupée, un avertissement se décide dans le projet)`);
  }
}
if (JSON.parse(readFileSync("base.json", "utf8")).categories.correctness !== "off") erreur("base.json : les catégories doivent rester coupées");

// oxlint refuse une règle qu'il ne connaît pas : on lui fait résoudre un projet vide qui étend les presets.
const dossier = mkdtempSync(join(tmpdir(), "oxlint-config-"));
writeFileSync(join(dossier, ".oxlintrc.json"), JSON.stringify({ extends: fichiers.map((f) => resolve(f)) }));
try {
  const resolu = JSON.parse(execFileSync(resolve("node_modules/.bin/oxlint"), ["--print-config"], { cwd: dossier, encoding: "utf8" }));
  const attendu = fichiers.reduce((n, f) => n + Object.keys(JSON.parse(readFileSync(f, "utf8")).rules).length, 0);
  const actives = Object.values(resolu.rules).filter((v) => (Array.isArray(v) ? v[0] : v) !== "allow").length;
  if (actives !== attendu) erreur(`oxlint résout ${actives} règles, les presets en déclarent ${attendu}`);
  else console.log(`${actives} règles, toutes reconnues par oxlint`);
} catch (e) {
  erreur(`oxlint refuse les presets : ${e.stderr || e.message}`);
}
process.exit(erreurs ? 1 : 0);

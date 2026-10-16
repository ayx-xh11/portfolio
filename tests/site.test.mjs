import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = join(projectRoot, "src");
const html = readFileSync(join(sourceRoot, "index.htm"), "utf8");
const css = readFileSync(join(sourceRoot, "css", "style.css"), "utf8");

function matches(pattern, value) {
  return [...value.matchAll(pattern)].map((match) => match[1]);
}

test("local page assets exist", () => {
  const references = matches(/(?:href|src)="([^"]+)"/g, html).filter(
    (reference) => !reference.startsWith("#") && !/^[a-z]+:/i.test(reference),
  );

  for (const reference of references) {
    assert.ok(existsSync(join(sourceRoot, reference)), `Missing local asset: ${reference}`);
  }
});

test("internal navigation points to unique section IDs", () => {
  const ids = matches(/\sid="([^"]+)"/g, html);
  const internalLinks = matches(/href="#([^"]+)"/g, html);

  assert.equal(new Set(ids).size, ids.length, "Every HTML id must be unique");

  for (const target of internalLinks) {
    assert.ok(ids.includes(target), `Missing internal link target: #${target}`);
  }
});

test("page includes core metadata and semantic landmarks", () => {
  assert.match(html, /<html lang="en">/);
  assert.match(html, /<meta\s+name="description"/);
  assert.match(html, /<header class="site-header"/);
  assert.match(html, /<nav[^>]+aria-label="Primary"/);
  assert.match(html, /<main id="main-content">/);
  assert.match(html, /<footer class="site-footer">/);
});

test("interaction has accessible fallbacks", () => {
  assert.match(html, /class="skip-link"/);
  assert.match(html, /class="gravity-field" aria-hidden="true"/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /:focus-visible/);
});

test("starter placeholders and dead links are removed", () => {
  assert.doesNotMatch(html, /lorem ipsum/i);
  assert.doesNotMatch(html, /href="#"/);
  assert.doesNotMatch(html, /<title>timepass<\/title>/i);
});

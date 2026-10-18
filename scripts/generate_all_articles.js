// scripts/generate_all_articles.js
const fs = require('fs');
const path = require('path');

const { articlesPart1 } = require('./articles_data_1.js');
const { articlesPart2 } = require('./articles_data_2.js');
const { articlesPart3 } = require('./articles_data_3.js');
const { calibrateToRange } = require('./article_builder_utils.js');

const allRawArticles = [...articlesPart1, ...articlesPart2, ...articlesPart3];
const targetDir = path.join(__dirname, '..', 'src', 'lib', 'data', 'articles');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

console.log(`Processing ${allRawArticles.length} articles...`);

const calibratedArticles = allRawArticles.map((raw, idx) => {
  const calibrated = calibrateToRange(raw, 1600, 1800);
  if (calibrated.wordCount < 1600 || calibrated.wordCount > 1800) {
    throw new Error(`Article ${calibrated.slug} has invalid word count: ${calibrated.wordCount}`);
  }
  console.log(`✓ Article ${idx + 1} (${calibrated.slug}): ${calibrated.wordCount} words`);
  return calibrated;
});

// Write individual article files
calibratedArticles.forEach((art, idx) => {
  const fileNum = String(idx + 1).padStart(2, '0');
  const fileName = `art${fileNum}.ts`;
  const filePath = path.join(targetDir, fileName);

  const fileContent = `import { ArticleRecord } from "@/lib/types/article";

export const ARTICLE_${fileNum}: ArticleRecord = ${JSON.stringify(art, null, 2)};
`;

  fs.writeFileSync(filePath, fileContent, 'utf8');
});

// Write index.ts
const imports = calibratedArticles.map((_, idx) => {
  const fileNum = String(idx + 1).padStart(2, '0');
  return `import { ARTICLE_${fileNum} } from "./art${fileNum}";`;
}).join('\n');

const exportsList = calibratedArticles.map((_, idx) => {
  const fileNum = String(idx + 1).padStart(2, '0');
  return `  ARTICLE_${fileNum},`;
}).join('\n');

const indexContent = `import { ArticleRecord } from "@/lib/types/article";
${imports}

export const ALL_ARTICLES: ArticleRecord[] = [
${exportsList}
];

export {
${exportsList}
};
`;

fs.writeFileSync(path.join(targetDir, 'index.ts'), indexContent, 'utf8');

console.log(`\nSuccessfully generated ${calibratedArticles.length} articles in ${targetDir}`);

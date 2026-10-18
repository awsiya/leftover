// scripts/article_builder_utils.js
const fs = require('fs');
const path = require('path');

function countWords(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function getArticleTotalWords(article) {
  let count = 0;
  count += countWords(article.title);
  count += countWords(article.subtitle);
  count += countWords(article.excerpt);
  for (const s of article.sections) {
    count += countWords(s.title);
    count += countWords(s.content);
  }
  return count;
}

function calibrateToRange(article, targetMin = 1620, targetMax = 1780) {
  let cloned = JSON.parse(JSON.stringify(article));
  let currentWords = getArticleTotalWords(cloned);

  if (currentWords < targetMin) {
    console.warn(`Warning: Article ${cloned.slug} has only ${currentWords} words (below ${targetMin})`);
  }

  // Trim if over targetMax
  while (getArticleTotalWords(cloned) > targetMax) {
    // Find section with the most words
    let maxSec = cloned.sections.reduce((max, s) => {
      return countWords(s.content) > countWords(max.content) ? s : max;
    }, cloned.sections[0]);

    let paragraphs = maxSec.content.split('\n\n');
    let lastPara = paragraphs[paragraphs.length - 1];
    let sentences = lastPara.match(/[^.!?]+[.!?]+/g);

    if (sentences && sentences.length > 1) {
      sentences.pop();
      paragraphs[paragraphs.length - 1] = sentences.join(' ').trim();
      maxSec.content = paragraphs.join('\n\n');
    } else if (paragraphs.length > 1) {
      paragraphs.pop();
      maxSec.content = paragraphs.join('\n\n');
    } else {
      break;
    }
  }

  const finalCount = getArticleTotalWords(cloned);
  cloned.wordCount = finalCount;
  cloned.readingTimeMinutes = Math.max(5, Math.ceil(finalCount / 200));
  return cloned;
}

module.exports = {
  countWords,
  getArticleTotalWords,
  calibrateToRange,
};

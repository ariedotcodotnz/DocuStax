#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.BASE_URL || 'https://docustax.example.com';
const DOCUMENTS_DIR = path.join(__dirname, '..', 'documents');
const OUTPUT_DIR = path.join(__dirname, '..', 'dist');
const SITEMAP_PATH = path.join(OUTPUT_DIR, 'sitemap.xml');

// Read manifest to get all document slugs
const manifestPath = path.join(DOCUMENTS_DIR, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

// Generate sitemap
const generateSitemap = async () => {
  console.log('Generating sitemap...');

  const urls = [];

  // Add homepage
  urls.push({
    loc: BASE_URL,
    changefreq: 'weekly',
    priority: '1.0',
  });

  // Add browse page
  urls.push({
    loc: `${BASE_URL}/browse`,
    changefreq: 'weekly',
    priority: '0.9',
  });

  // Add document pages
  for (const slug of manifest) {
    const metadataPath = path.join(DOCUMENTS_DIR, slug, 'metadata.json');
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));

    urls.push({
      loc: `${BASE_URL}/doc/${slug}`,
      lastmod: metadata.date,
      changefreq: 'monthly',
      priority: '0.8',
    });
  }

  // Get unique categories and tags
  const categories = new Set();
  const tags = new Set();

  for (const slug of manifest) {
    const metadataPath = path.join(DOCUMENTS_DIR, slug, 'metadata.json');
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));

    categories.add(metadata.category);
    metadata.tags.forEach(tag => tags.add(tag));
  }

  // Add category pages
  for (const category of categories) {
    urls.push({
      loc: `${BASE_URL}/category/${encodeURIComponent(category)}`,
      changefreq: 'weekly',
      priority: '0.7',
    });
  }

  // Add tag pages
  for (const tag of tags) {
    urls.push({
      loc: `${BASE_URL}/tag/${encodeURIComponent(tag)}`,
      changefreq: 'weekly',
      priority: '0.6',
    });
  }

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>${url.lastmod ? `
    <lastmod>${url.lastmod}</lastmod>` : ''}${url.changefreq ? `
    <changefreq>${url.changefreq}</changefreq>` : ''}${url.priority ? `
    <priority>${url.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Write sitemap
  fs.writeFileSync(SITEMAP_PATH, xml);
  console.log(`✅ Sitemap generated: ${SITEMAP_PATH}`);
  console.log(`   Total URLs: ${urls.length}`);
};

generateSitemap().catch(err => {
  console.error('❌ Error generating sitemap:', err);
  process.exit(1);
});

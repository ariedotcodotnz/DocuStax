#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCUMENTS_DIR = path.join(__dirname, '..', 'documents');
const MANIFEST_PATH = path.join(DOCUMENTS_DIR, 'manifest.json');

/**
 * Automatically generates manifest.json by scanning the documents directory
 * for all subdirectories that contain a metadata.json file.
 */
const generateManifest = async () => {
  console.log('🔍 Scanning documents directory...');

  // Read all entries in the documents directory
  const entries = fs.readdirSync(DOCUMENTS_DIR, { withFileTypes: true });

  // Filter for directories only and exclude hidden directories
  const documentSlugs = entries
    .filter(entry => {
      // Must be a directory
      if (!entry.isDirectory()) return false;

      // Exclude hidden directories (starting with .)
      if (entry.name.startsWith('.')) return false;

      // Check if metadata.json exists in the directory
      const metadataPath = path.join(DOCUMENTS_DIR, entry.name, 'metadata.json');
      return fs.existsSync(metadataPath);
    })
    .map(entry => entry.name)
    .sort(); // Sort alphabetically for consistency

  if (documentSlugs.length === 0) {
    console.warn('⚠️  No document folders found in', DOCUMENTS_DIR);
    console.warn('   Make sure each document folder contains a metadata.json file.');
  }

  // Generate the manifest JSON
  const manifestContent = JSON.stringify(documentSlugs, null, 2);

  // Write the manifest file
  fs.writeFileSync(MANIFEST_PATH, manifestContent + '\n');

  console.log(`✅ Manifest generated: ${MANIFEST_PATH}`);
  console.log(`   Total documents: ${documentSlugs.length}`);

  if (documentSlugs.length > 0) {
    console.log('   Documents found:');
    documentSlugs.forEach(slug => console.log(`   - ${slug}`));
  }
};

generateManifest().catch(err => {
  console.error('❌ Error generating manifest:', err);
  process.exit(1);
});
